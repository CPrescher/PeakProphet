import {Injectable} from '@angular/core';
import {FitModel} from "./data/fit-model";
import {io} from "socket.io-client";
import {distinctUntilChanged, filter, fromEvent, interval, Observable, Subject, take, takeUntil} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FitService {
  constructor() {
  }

  fitModel(fitModel: FitModel): [Observable<any>, Observable<any>, Subject<void>] {
    const json_data = JSON.stringify(fitModel)
    const sioClient = io('http://localhost:8009');
    // const sioClient = io('https://peakprophet.com:8009');

    fromEvent(sioClient, 'connect').subscribe(() => {
      sioClient.emit('fit', json_data);

      interval(30).pipe(
        takeUntil(fromEvent(sioClient, 'disconnect')),
      ).subscribe(() => {
        sioClient.emit('request_progress', json_data);
      });
    });

    const sioDisconnect$ = fromEvent(sioClient, 'disconnect');

    const result = fromEvent(sioClient, 'result').pipe(
      take(1),
    );

    const progress = fromEvent(sioClient, 'progress').pipe(
      filter( payload  => payload !== undefined),
      takeUntil(sioDisconnect$),
      distinctUntilChanged((prev, current) => prev.iter === current.iter),
    );

    result.subscribe({
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

    return [result, progress, stopper$]
  }
}
