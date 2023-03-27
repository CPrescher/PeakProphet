import {Component} from '@angular/core';
import {FitModelService} from "../../../shared/fit-model.service";
import {Subject, Subscription, take} from "rxjs";
import {FitModel} from "../../../shared/data/fit-model";


export interface Progress {
  iter: number;
  chi2: number;
  red_chi2: number;
}

@Component({
  selector: 'app-fit-control',
  templateUrl: './fit-control.component.html',
  styleUrls: ['./fit-control.component.css']
})
export class FitControlComponent {
  public stopSubject: Subject<void> | undefined = undefined;

  public fitProgressData: Progress[] = []
  public fitProgressData$: Subject<Progress[]> = new Subject<Progress[]>()

  private progressSubscription: Subscription = new Subscription();

  public displayedColumns = ['iter', 'chi2', 'red_chi2']

  public selectedFitModel$ = this.fitModelService.selectedFitModel$;

  constructor(public fitModelService: FitModelService) {

    fitModelService.selectedFitModel$.subscribe((fitModel) => {
      if (fitModel === undefined) {
        return;
      }
      this.fitProgressData = []
      this.fitProgressData$.next(this.fitProgressData)

      this._subscribeToProgress(fitModel)
    })
  }


  fit(): void {
    this.fitProgressData = []
    this.stopSubject = this.fitModelService.fitData()
    this.fitModelService.selectedFitModel$.pipe(
      take(1)
    ).subscribe((fitModel) => {
      if (fitModel === undefined) {
        return;
      }
      this._subscribeToProgress(fitModel)
    })
  }

  private _subscribeToProgress(fitModel: FitModel): void {
    this.progressSubscription.unsubscribe()
    this.progressSubscription = fitModel.fitRequest.progress$.subscribe((progress) => {
      this.fitProgressData.push({"iter": progress.iter, "chi2": progress.chi2, "red_chi2": progress.red_chi2})
      this.fitProgressData$.next(
        this.fitProgressData.sort((a, b) => (a.iter < b.iter ? -1 : 1)).reverse())
    })
  }

  stopFit(): void {
    if (this.stopSubject) {
      this.stopSubject.next()
    }
  }
}
