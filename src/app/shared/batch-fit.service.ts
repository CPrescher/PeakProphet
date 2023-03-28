import {Injectable} from '@angular/core';
import {FitModelService} from "./fit-model.service";
import {skip, Subject, takeUntil, takeWhile} from "rxjs";
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
      let [result$, progress$, stopper$] = fitModels[index].fit();
      this.stopper$ = stopper$;

      // let showProgressTimer = timer(1000).subscribe(() => {
      progress$.pipe(
        skip(10),
        takeUntil(result$),
        takeWhile(() => this.fitting && !this.stop),
      ).subscribe(() => {
        this.fitModelService.selectFitModel(index);
      })
      // })

      result$.subscribe((payload) => {
        this.fitModelService.selectFitModel(index);
        index++;
        if (index < fitModels.length && !this.stop) {
          if (this.propagateModels) {
            updateFitModel(fitModels[index], payload.result)
          }
          // showProgressTimer.unsubscribe();
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
    this.fitting = false;
    this.stopper$.next();
  }
}
