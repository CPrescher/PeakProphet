import { Component, OnInit } from '@angular/core';
import {GaussianModel} from "../../shared/peak-types/gaussian.model";
import {Model} from "../../shared/peak-types/model.interface";
import {ModelService} from "../../shared/model.service";

@Component({
  selector: 'app-peak-item',
  templateUrl: './peak-item.component.html',
  styleUrls: ['./peak-item.component.css']
})
export class PeakItemComponent implements OnInit{
  peak: Model = new GaussianModel();

  selectedModelIndex = 0;
  constructor(
     private modelService: ModelService) {
  }

  ngOnInit() {
    this.peak = this.modelService.getPeaks()[0];
    this.modelService.selectedPeak$.subscribe((peak: Model) => {
      this.peak = peak;
    });
    this.modelService.selectedPeakIndex$.subscribe((index: number) => {
      this.selectedModelIndex = index;
    });
  }


  increaseModelIndex() {
    this.modelService.selectPeak(this.selectedModelIndex+1);
  }

  decreaseModelIndex() {
    this.modelService.selectPeak(this.selectedModelIndex-1);
  }

  removePeak() {
    this.modelService.removePeak(this.selectedModelIndex);
  }

}
