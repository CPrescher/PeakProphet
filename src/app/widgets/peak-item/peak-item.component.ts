import { Component, OnInit } from '@angular/core';
import {GaussianModel} from "../../shared/gaussian.model";
import {Model} from "../../shared/model.interface";
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
    this.modelService.selectedPeakSubject.subscribe((peak: Model) => {
      this.peak = peak;
    });
    this.modelService.selectedPeakIndexSubject.subscribe((index: number) => {
      this.selectedModelIndex = index;
    });
  }


  incrementModelIndex() {
    this.modelService.selectPeak(this.selectedModelIndex+1);
  }

  decrementModelIndex() {
    this.modelService.selectPeak(this.selectedModelIndex-1);
  }

}
