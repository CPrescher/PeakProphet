import {Injectable} from '@angular/core';
import {FitModelService} from "./fit-model.service";
import {skip, Subject, Subscription, takeUntil, takeWhile} from "rxjs";
import {updateFitModel} from "./models/updating";

@Injectable({
  providedIn: 'root'
})
export class BatchFitService {
  public stop = false;
  public fitting = false;

  public propagateModels = true;
  public startFromSelected = true;

  private stopper$: Subject<void> = new Subject<void>();

  public selectedIndex = 0;
  private selectedIndexSubscription = new Subscription();


  constructor(private fitModelService: FitModelService) {
    this.selectedIndexSubscription = this.fitModelService.selectedIndex$
      .subscribe((index) => {
        this.selectedIndex = index !== undefined ? index : 0;
      })
  }

  public batchFit() {
    this.stop = false;
    const fitModels = this.fitModelService.fitModels;
    let startIndex = this.startFromSelected ? this.selectedIndex : 0;

    let nextIndexSubject = new Subject<number>();

    nextIndexSubject.subscribe((index) => {
      let [result$, progress$, stopper$] = fitModels[index].fit();
      this.stopper$ = stopper$;

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
          nextIndexSubject.next(index);
        } else {
          this.fitting = false;
        }
      })
    })

    this.fitting = true;
    nextIndexSubject.next(startIndex);
  }

  public stopBatchFit() {
    this.stop = true;
    this.fitting = false;
    this.stopper$.next();
  }
}
