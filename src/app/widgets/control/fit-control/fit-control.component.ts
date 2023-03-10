import { Component } from '@angular/core';
import {FitModelService} from "../../../shared/fit-model.service";
import {FitModel} from "../../../shared/data/fit-model";

@Component({
  selector: 'app-fit-control',
  templateUrl: './fit-control.component.html',
  styleUrls: ['./fit-control.component.css']
})
export class FitControlComponent {
  public selectedFitModel: FitModel | undefined

  constructor(private fitModelService: FitModelService){
    fitModelService.selectedFitModel$.subscribe((fitModel) => {
      this.selectedFitModel = fitModel;
    });
  }

  fit(): void {
    // console.log(JSON.stringify(this.selectedFitModel));
    this.fitModelService.fitData()
  }
}
