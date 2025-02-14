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

export class FitRequest {
  private resultSubject: Subject<any> = new Subject<any>();
  public result$: Observable<any>;

  private progressSubject: ReplaySubject<any> = new ReplaySubject<any>(10);
  public progress$: Observable<any> = this.progressSubject.asObservable();
  private _requestProgress = true;
  private _firstProgress = true;
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

  constructor(public fitModel: FitModel) {
    this.stopper$ = new Subject<void>();
  }

  public fit(): [Observable<any>, Observable<any>, Subject<void>] {
    const json_data = this._createJSONData(this.fitModel);

    this._connectToSocketIO();
    this._emitFitRequest(json_data);
    this._emitProgressRequest();
    this._createStopper();

    return [this.result$, this.progress$, this.stopper$];
  }

  private _createJSONData(fitModel: FitModel) {
    return JSON.stringify({
      name: fitModel.name,
      pattern: fitModel.pattern,
      peaks: fitModel.peaks,
      background: fitModel.background,
    });
  }

  private _connectToSocketIO() {
    this.sioClient = io(environment.backend_url);

    this.sioConnect$ = fromEvent(this.sioClient, 'connect');
    this.sioDisconnect$ = fromEvent(this.sioClient, 'disconnect').pipe(take(1));
  }

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

  private _resetSubscriptions() {
    this._connectSubscription.unsubscribe();
    this._disconnectSubscription.unsubscribe();
    this._progressRequestSubscription.unsubscribe();
    this._progressIntervalSubscription.unsubscribe();
    this._stopperSubscription.unsubscribe();
  }
}
