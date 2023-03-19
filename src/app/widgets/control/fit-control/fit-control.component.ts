import { Component } from '@angular/core';
import {FitModelService} from "../../../shared/fit-model.service";
import {FitModel} from "../../../shared/data/fit-model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-fit-control',
  templateUrl: './fit-control.component.html',
  styleUrls: ['./fit-control.component.css']
})
export class FitControlComponent {
  public selectedFitModel: FitModel | undefined
  public stopSubject: Subject<void> | undefined = undefined;

  constructor(public fitModelService: FitModelService){
    fitModelService.selectedFitModel$.subscribe((fitModel) => {
      this.selectedFitModel = fitModel;
    });
  }

  fit(): void {
    this.stopSubject = this.fitModelService.fitData()
  }

  stopFit():void {
    if(this.stopSubject){
      this.stopSubject.next()
    }
  }
}
