import {Component} from '@angular/core';
import {FitModelService} from "../../../shared/fit-model.service";
import {MatSelectionListChange} from "@angular/material/list";

@Component({
  selector: 'app-data-control',
  templateUrl: './data-control.component.html',
  styleUrls: ['./data-control.component.css']
})
export class DataControlComponent {

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
    });
  }

  selectModel(index: number) {
    this.fitModelService.selectFitModel(index);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.fitModelService.readData(files[i], i>0);
    }
  }

  moveModelUp() {
    this.fitModelService.moveFitModelUp(this.selectedModelIndex);
  }
  moveModelDown() {
    this.fitModelService.moveFitModelDown(this.selectedModelIndex);
  }

  removeModel() {
    this.fitModelService.removeFitModel(this.selectedModelIndex);
  }

  clearModels() {
    this.fitModelService.clearFitModels();
  }

  onListSelectionChanged(event: MatSelectionListChange) {
    const selectedName = event.source.selectedOptions.selected[0].value;
    const index = this.fitModelNames.indexOf(selectedName);
    this.fitModelService.selectFitModel(index);
  }
}
