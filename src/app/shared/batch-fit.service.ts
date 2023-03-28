import {Injectable} from '@angular/core';
import {FitModelService} from "./fit-model.service";
import {Subject} from "rxjs";
import {updateFitModel} from "./models/updating";

@Injectable({
  providedIn: 'root'
})
export class BatchFitService {

  constructor(private fitModelService: FitModelService) {
  }

  public batchFit() {
    const fitModels = this.fitModelService.fitModels;

    let nextSubject = new Subject<number>();

    nextSubject.subscribe((index) => {
      let [result$, _, __] = fitModels[index].fit();

      result$.subscribe((payload) => {
        this.fitModelService.selectFitModel(index);
        index++;
        if (index < fitModels.length) {
          updateFitModel(fitModels[index], payload.result)
          nextSubject.next(index);
        }
      })
    })

    nextSubject.next(0);
  }
}
