import {Component} from '@angular/core';
import {FitModelService} from "../../shared/fit-model.service";
import {MatSelectionListChange} from "@angular/material/list";

@Component({
  selector: 'app-fit-control',
  templateUrl: './fit-control.component.html',
  styleUrls: ['./fit-control.component.css']
})
export class FitControlComponent {

  public modelNum = 0;
  public selectedModelIndex = 0;

  public selectedFitModelName: string = '';

  public fitModelNames: string[] = [];

  constructor(private fitModelService: FitModelService) {

    this.modelNum = this.fitModelService.fitModels.length;

    fitModelService.selectedIndex$.subscribe((index: number | undefined) => {
      if (index !== undefined) {
        this.selectedModelIndex = index;
        this.modelNum = this.fitModelService.fitModels.length;
        this.selectedFitModelName = this.fitModelService.fitModels[index].name;
      }
    });

    fitModelService.fitModels$.subscribe((fitModels) => {
      this.fitModelNames = fitModels.map(fitModel => fitModel.name);
      // this.selectedFitModelName = fitModels[this.selectedModelIndex].name;
      console.log('fitModelNames', this.fitModelNames)
      console.log('selectedFitModelName', this.selectedFitModelName)
    });
  }

  selectModel(index: number) {
    this.fitModelService.selectFitModel(index);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.fitModelService.readData(files[i]);
    }
  }

  onListSelectionChanged(event: MatSelectionListChange) {
    const selectedName = event.source.selectedOptions.selected[0].value;
    const index = this.fitModelNames.indexOf(selectedName);
    this.fitModelService.selectFitModel(index);
  }
}
