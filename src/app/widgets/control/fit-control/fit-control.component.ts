import {Component} from '@angular/core';
import {FitModelService} from "../../../shared/fit-model.service";
import {Subject} from "rxjs";


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
  public displayedColumns = ['iter', 'chi2', 'red_chi2']

  constructor(public fitModelService: FitModelService) {
    this.fitModelService.fitProgress$.subscribe((progress) => {
      this.fitProgressData.push({"iter": progress.iter, "chi2": progress.chi2, "red_chi2": progress.red_chi2})
      this.fitProgressData$.next(
        this.fitProgressData.sort((a, b) => (a.iter < b.iter ? -1 : 1)).reverse())
      // console.log(this.fitProgressData)
    })
    // this.fitModelService.fitComplete$.subscribe((fitModel) => {
    //   this.fitProgressData = []
    //   this.fitProgressData$.next(this.fitProgressData)
    // }
  }

  fit(): void {
    this.fitProgressData = []
    this.stopSubject = this.fitModelService.fitData()
  }

  stopFit(): void {
    if (this.stopSubject) {
      this.stopSubject.next()
    }
  }
}
