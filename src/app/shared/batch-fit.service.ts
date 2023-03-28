import {Injectable} from '@angular/core';
import {FitModelService} from "./fit-model.service";
import {Subject} from "rxjs";
import {updateFitModel} from "./models/updating";

@Injectable({
  providedIn: 'root'
})
export class BatchFitService {
  public stop = false;
  public fitting = false;

  public propagateModels = true;

  private stopper$: Subject<void> = new Subject<void>();

  constructor(private fitModelService: FitModelService) {
  }

  public batchFit(startIndex: number = 0) {
    this.stop = false;
    const fitModels = this.fitModelService.fitModels;

    let nextSubject = new Subject<number>();

    nextSubject.subscribe((index) => {
      let [result$, _, stopper$] = fitModels[index].fit();
      this.stopper$ = stopper$;

      result$.subscribe((payload) => {
        this.fitModelService.selectFitModel(index);
        index++;
        if (index < fitModels.length && !this.stop) {
          if(this.propagateModels) {
            updateFitModel(fitModels[index], payload.result)
          }
          nextSubject.next(index);
        } else {
          this.fitting = false;
        }
      })
    })

    this.fitting = true;
    nextSubject.next(startIndex);
  }

  public stopBatchFit() {
    this.stop = true;
    this.stopper$.next();
  }
}
