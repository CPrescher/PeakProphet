import { FitModel } from './fit-model';
import {
  distinctUntilChanged,
  filter,
  fromEvent,
  interval,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

/**
 * Handles WebSocket communication for fitting operations using Socket.IO.
 * This class manages the connection lifecycle, data transmission, and progress monitoring
 * for model fitting operations.
 */
export class FitRequest {
  /** Subject for emitting fit results */
  private resultSubject: Subject<any> = new Subject<any>();
  /** Observable stream of fit results */
  public result$: Observable<any>;

  /** ReplaySubject to buffer and emit progress updates */
  private progressSubject: ReplaySubject<any> = new ReplaySubject<any>(10);
  /** Observable stream of progress updates */
  public progress$: Observable<any> = this.progressSubject.asObservable();
  /** Flag to control progress request timing */
  private _requestProgress = true;
  private _firstProgress = true;

  /** Subject to handle manual stopping of the fit operation */
  public stopper$: Subject<void> = new Subject<void>();

  private sioClient: Socket;
  private sioDisconnect$: Observable<any>;
  private sioConnect$: Observable<any>;

  private _connectSubscription = new Subscription();
  private _disconnectSubscription = new Subscription();
  private _resultSubscription = new Subscription();
  private _progressRequestSubscription = new Subscription();
  private _progressIntervalSubscription = new Subscription();
  private _stopperSubscription = new Subscription();

  /**
   * Creates a new FitRequest instance
   * @param fitModel The model configuration for the fitting operation
   */
  constructor(public fitModel: FitModel) {
    this.stopper$ = new Subject<void>();
  }

  /**
   * Initiates the fitting process
   * @returns A tuple of [result$, progress$, stopper$] observables for monitoring and controlling the fit
   */
  public fit(): [Observable<any>, Observable<any>, Subject<void>] {
    const json_data = this._createJSONData(this.fitModel);

    this._connectToSocketIO();
    this._emitFitRequest(json_data);
    this._emitProgressRequest();
    this._createStopper();

    return [this.result$, this.progress$, this.stopper$];
  }

  /**
   * Creates a JSON string from the fit model
   * @param fitModel The model to serialize
   * @returns JSON string representation of the model
   */
  private _createJSONData(fitModel: FitModel) {
    return JSON.stringify({
      name: fitModel.name,
      pattern: fitModel.pattern,
      peaks: fitModel.peaks,
      background: fitModel.background,
    });
  }

  /**
   * Establishes Socket.IO connection with automatic timeout
   * The connection automatically closes after 60 seconds to prevent indefinite
   * server connections in edge cases
   */
  private _connectToSocketIO() {
    this.sioClient = io(environment.backend_url);

    // Two observables: one for the connection and one for the disconnection.
    this.sioConnect$ = fromEvent(this.sioClient, 'connect');
    this.sioDisconnect$ = fromEvent(this.sioClient, 'disconnect').pipe(take(1));

    // The connection will be automatically closed after 60 seconds
    interval(60000).subscribe(() => {
      this.sioClient.emit('stop');
      this.sioClient.disconnect();
      this.sioClient.close();
    });
  }

  /**
   * Sets up the fit request and handles the response
   * Includes error handling and cleanup on completion
   * @param json_data The serialized model data to send
   */
  private _emitFitRequest(json_data: string) {
    this.resultSubject = new Subject<any>();
    this.result$ = this.resultSubject
      .asObservable()
      .pipe(takeUntil(this.sioDisconnect$), take(1));

    this._connectSubscription = this.sioConnect$.subscribe(() => {
      this.sioClient.emit('fit', json_data, (payload) => {
        this.resultSubject.next(payload);
        this.resultSubject.complete();
      });

      this._requestProgress = true;
      this._firstProgress = true;
    });

    this._resultSubscription = this.result$.subscribe({
      complete: () => {
        // A short timeout to ensure the result is sent.
        setTimeout(() => {
          this.sioClient.disconnect();
          this.sioClient.close();
        }, 500);
      },
    });

    this._disconnectSubscription = this.sioDisconnect$.subscribe(() => {
      this._resetSubscriptions();
    });
  }

  /**
   * Configures progress monitoring
   * Sends progress requests every 30ms and processes responses
   * Progress updates continue until either the fit completes or the connection closes
   */
  private _emitProgressRequest() {
    this.progressSubject.complete();
    this.progressSubject = new ReplaySubject<any>(10);

    this.progress$ = this.progressSubject.asObservable().pipe(
      filter((payload) => payload !== undefined),
      distinctUntilChanged((prev, current) => prev.iter === current.iter),
      takeUntil(this.sioDisconnect$),
      takeUntil(this.result$)
    );

    this._progressRequestSubscription = this.sioConnect$.subscribe(() => {
      this._progressIntervalSubscription = interval(30)
        .pipe(
          filter(() => this._requestProgress || this._firstProgress),
          takeUntil(this.sioDisconnect$),
          takeUntil(this.result$)
        )
        .subscribe(() => {
          this.sioClient.emit('request_progress', (payload) => {
            this.progressSubject.next(payload);
            this._requestProgress = true;
            this._firstProgress = false;
          });
          this._requestProgress = false;
        });
    });
  }

  /**
   * Sets up the stopping mechanism
   * When triggered, sends a stop signal to the server and closes the connection
   */
  private _createStopper() {
    this.stopper$.complete();
    this.stopper$ = new Subject<void>();
    this.stopper$.subscribe(() => {
      this.sioClient.emit('stop');
      this.sioClient.disconnect();
      this.sioClient.close();
      this._requestProgress = true;
    });
  }

  /**
   * Cleans up all subscriptions
   * Called when the socket disconnects or the operation completes
   */
  private _resetSubscriptions() {
    this._connectSubscription.unsubscribe();
    this._disconnectSubscription.unsubscribe();
    this._progressRequestSubscription.unsubscribe();
    this._progressIntervalSubscription.unsubscribe();
    this._stopperSubscription.unsubscribe();
  }
}
