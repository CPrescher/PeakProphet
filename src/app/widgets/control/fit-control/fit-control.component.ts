import {Component, OnDestroy} from '@angular/core';
import {FitModelService} from "../../../shared/fit-model.service";
import {Subject, Subscription, take} from "rxjs";
import {FitModel} from "../../../shared/data/fit-model";
import {ProjectState} from "../../../project/store/project.state";
import {Store} from "@ngrx/store";
import {currentFitItem} from "../../../project/store/project.selectors";


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
export class FitControlComponent implements OnDestroy {
  public stopSubject: Subject<void> | undefined = undefined;

  public fitProgressData: Progress[] = []
  public fitProgressData$: Subject<Progress[]> = new Subject<Progress[]>()

  private _progressSubscription: Subscription = new Subscription();
  private _fitModelSubscription: Subscription = new Subscription();
  private _fitModelSubscription2: Subscription = new Subscription();

  public displayedColumns = ['iter', 'chi2', 'red_chi2']

  public selectedFitModel$ = this.projectStore.select(currentFitItem);

  constructor(
    public fitModelService: FitModelService,
    public projectStore: Store<ProjectState>
  ) {

    this._fitModelSubscription = this.projectStore.select(currentFitItem).subscribe((fitModel) => {
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
    this._fitModelSubscription2.unsubscribe()

    this._fitModelSubscription2 = this.projectStore.select(currentFitItem).pipe(
      take(1)
    ).subscribe((fitModel) => {
      if (fitModel === undefined) {
        return;
      }
      this._subscribeToProgress(fitModel)
    })
  }

  private _subscribeToProgress(fitModel: FitModel): void {
    // TODO: This way of subscription will not work with current implementation
    // this._progressSubscription.unsubscribe()
    // this._progressSubscription = fitModel.fitRequest.progress$.subscribe((progress) => {
    //   this.fitProgressData.push({"iter": progress.iter, "chi2": progress.chi2, "red_chi2": progress.red_chi2})
    //   this.fitProgressData$.next(
    //     this.fitProgressData.sort((a, b) => (a.iter < b.iter ? -1 : 1)).reverse())
    // })
  }

  stopFit(): void {
    if (this.stopSubject) {
      this.stopSubject.next()
    }
  }

  ngOnDestroy(): void {
    this._progressSubscription.unsubscribe()
    this._fitModelSubscription.unsubscribe()
    this._fitModelSubscription2.unsubscribe()
  }
}
