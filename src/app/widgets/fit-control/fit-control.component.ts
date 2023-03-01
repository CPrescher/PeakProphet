import {Component} from '@angular/core';
import {FitModelService} from "../../shared/fit-model.service";

@Component({
  selector: 'app-fit-control',
  templateUrl: './fit-control.component.html',
  styleUrls: ['./fit-control.component.css']
})
export class FitControlComponent {

  public modelNum = 0;
  public selectedModelIndex = 0;

  constructor(private fitModelService: FitModelService) {

    this.modelNum = this.fitModelService.fitModels.length;

    fitModelService.selectedIndex$.subscribe((index: number | undefined) => {
      if (index !== undefined) {
        this.selectedModelIndex = index;
        this.modelNum = this.fitModelService.fitModels.length;
      }
    });
  }

  selectModel(index: number) {
    this.fitModelService.selectFitModel(index);
  }

  addModel() {

  }

}
