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

  public fitModelName: string = '';

  constructor(private fitModelService: FitModelService) {

    this.modelNum = this.fitModelService.fitModels.length;

    fitModelService.selectedIndex$.subscribe((index: number | undefined) => {
      if (index !== undefined) {
        this.selectedModelIndex = index;
        this.modelNum = this.fitModelService.fitModels.length;
        this.fitModelName = this.fitModelService.fitModels[index].name;
      }
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

}
