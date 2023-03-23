import {Injectable, isDevMode} from '@angular/core';
import {FitModel} from "./data/fit-model";
import {io, Socket} from "socket.io-client";
import {distinctUntilChanged, filter, fromEvent, interval, Observable, Subject, take, takeUntil} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FitService {
  constructor() {
  }

  fitModel(fitModel: FitModel): [Observable<any>, Observable<any>, Subject<void>] {
    const json_data = JSON.stringify(fitModel)


    let sioClient: Socket;
    if (isDevMode()) {
      sioClient = io('http://localhost:8009');
    } else {
      sioClient = io('https://peakprophet.com:8009');
    }

    fromEvent(sioClient, 'connect').subscribe(() => {
      sioClient.emit('fit', json_data);

      interval(30).pipe(
        takeUntil(fromEvent(sioClient, 'disconnect')),
      ).subscribe(() => {
        sioClient.emit('request_progress', json_data);
      });
    });

    const sioDisconnect$ = fromEvent(sioClient, 'disconnect');

    const result$ = fromEvent(sioClient, 'result').pipe(
      takeUntil(sioDisconnect$),
      take(1),
    );

    const progress = fromEvent(sioClient, 'progress').pipe(
      filter( payload  => payload !== undefined),
      takeUntil(sioDisconnect$),
      takeUntil(result$),
      distinctUntilChanged((prev, current) => prev.iter === current.iter),
    );

    result$.subscribe({
      complete: () => {
        setTimeout(() => {
          sioClient.disconnect();
        }, 200);
      }
    });

    let stopper$ = new Subject<void>();
    stopper$.subscribe(() => {
      console.log('stopping fit')
      sioClient.emit('stop')
    });

    return [result$, progress, stopper$]
  }
}
