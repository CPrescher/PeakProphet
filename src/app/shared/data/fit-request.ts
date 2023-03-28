import {FitModel} from "./fit-model";
import {
  distinctUntilChanged,
  filter,
  fromEvent,
  interval,
  Observable,
  ReplaySubject,
  Subject,
  take,
  takeUntil
} from "rxjs";
import {io, Socket} from "socket.io-client";
import {isDevMode} from "@angular/core";

export class FitRequest {
  public result$: Observable<any>;
  public progress$: ReplaySubject<any> = new ReplaySubject<any>(10);
  private _requestProgress = true;
  private _firstProgress = true;
  public stopper$: Subject<void> = new Subject<void>();

  private sioClient: Socket;
  private sioDisconnect$: Observable<any>;
  private sioConnect$: Observable<any>;

  constructor(public fitModel: FitModel) {
    this.stopper$ = new Subject<void>();
  }

  public fit(): [Observable<any>, ReplaySubject<any>, Subject<void>] {
    const json_data = this._createJSONData(this.fitModel)

    this._connectToSocketIO();
    this._emitFitRequest(json_data);
    this._createResultObservable();
    this._emitProgressRequest(json_data);
    this._createProgressObservable();
    this._createStopper();

    return [this.result$, this.progress$, this.stopper$]
  }

  private _createJSONData(fitModel: FitModel) {
    return JSON.stringify({
      name: fitModel.name,
      pattern: fitModel.pattern,
      peaks: fitModel.peaks,
      background: fitModel.background
    })
  }

  private _connectToSocketIO() {
    if (isDevMode()) {
      this.sioClient = io('http://localhost:8009');
    } else {
      this.sioClient = io('https://peakprophet.com:8009');
    }

    this.sioConnect$ = fromEvent(this.sioClient, 'connect')
    this.sioDisconnect$ = fromEvent(this.sioClient, 'disconnect').pipe(take(1));
  }

  private _emitFitRequest(json_data: string) {
    this.sioConnect$.subscribe(() => {
      this.sioClient.emit('fit', json_data);
      this._requestProgress = true;
      this._firstProgress = true;
    });
  }

  private _createResultObservable() {
    this.result$ = fromEvent(this.sioClient, 'result').pipe(
      takeUntil(this.sioDisconnect$),
      take(1),
    );

    this.result$.subscribe({
      complete: () => {
        setTimeout(() => {
          this.sioClient.disconnect();
          this.sioClient.close();
        }, 500);
      }
    });
  }

  private _emitProgressRequest(json_data: string) {
    this.sioConnect$.subscribe(() => {
      interval(30).pipe(
        filter(() => this._requestProgress || this._firstProgress),
        takeUntil(this.sioDisconnect$),
        takeUntil(this.result$),
      ).subscribe(() => {
        this.sioClient.emit('request_progress', json_data);
        this._requestProgress = false;
      });
    });
  }

  private _createProgressObservable() {
    this.progress$ = new ReplaySubject<any>(10);
    fromEvent(this.sioClient, 'progress').pipe(
      filter(payload => payload !== undefined),
      takeUntil(this.sioDisconnect$),
      takeUntil(this.result$),
      distinctUntilChanged((prev, current) => prev.iter === current.iter),
    ).subscribe((payload) => {
      this.progress$.next(payload);
      this._requestProgress = true;
      this._firstProgress = false;
    });
  }

  private _createStopper() {
    this.stopper$.complete();
    this.stopper$ = new Subject<void>();
    this.stopper$.subscribe(() => {
      this.sioClient.emit('stop');
      this.sioClient.disconnect()
      this.sioClient.close();
      this._requestProgress = true;
    });
  }
}
