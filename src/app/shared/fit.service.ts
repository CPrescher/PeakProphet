import {Injectable} from '@angular/core';
import {FitModel} from "./data/fit-model";
import {io} from "socket.io-client";
import {fromEvent, interval, map, Observable, take, takeUntil} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FitService {
  constructor() {
  }

  fitModel(fitModel: FitModel): [Observable<any>, Observable<any>] {
    const json_data = JSON.stringify(fitModel)
    const sioClient = io('http://localhost:8009');

    fromEvent(sioClient, 'connect').subscribe(() => {
      sioClient.emit('fit', json_data);

      interval(30).pipe(
        takeUntil(fromEvent(sioClient, 'disconnect')),
      ).subscribe(() => {
        sioClient.emit('get_progress', json_data);
      });
    });

    const sioDisconnect$ = fromEvent(sioClient, 'disconnect');

    const fitResult$ = fromEvent(sioClient, 'fit_result').pipe(
      take(1),
      map((payload) => payload.result),
    );

    const fitProgress$ = fromEvent(sioClient, 'fit_progress').pipe(
      takeUntil(sioDisconnect$),
      map((payload) => payload.result),
    );

    fitResult$.subscribe({
      complete: () => {
        setTimeout(() => {
          sioClient.disconnect();
        }, 200);
      }
    });

    return [fitResult$, fitProgress$]
  }
}
