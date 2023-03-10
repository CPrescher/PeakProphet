import { Injectable } from '@angular/core';
import {FitModel} from "./data/fit-model";
import {io, Socket} from "socket.io-client";
import {updateFitModel} from "./models/updating";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FitService {

  private sioClient: Socket;
  private sid: string;

  private fitFinishedSubject = new Subject<void>();
  public fitFinished$ = this.fitFinishedSubject.asObservable();

  private fitProgressSubject = new Subject<void>();
  public fitProgress$ = this.fitProgressSubject.asObservable();


  constructor() { }

  fitModel(fitModel: FitModel): void {
    if (this.sioClient) {
      this.sioClient.disconnect();
    }
    const json_data = JSON.stringify(fitModel)
    this.sioClient = io('http://localhost:8000');
    this.sioClient.on('connect', () => {
      this.sid = this.sioClient.id;
      this.sioClient.emit('fit', json_data);
    });

    this.sioClient.on('fit_result', (payload) => {
      updateFitModel(fitModel, payload.result)
      this.sioClient.disconnect();
      this.fitFinishedSubject.next();
    });

    this.sioClient.on('fit_progress', (payload) => {
      updateFitModel(fitModel, payload.result)
      this.fitProgressSubject.next();
    });
  }
}
