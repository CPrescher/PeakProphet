import {Component, OnInit} from '@angular/core';
import {Model} from "../../shared/peak-types/model.interface";
import {ModelService} from "../../shared/model.service";

@Component({
  selector: 'app-peak-item',
  templateUrl: './peak-item.component.html',
  styleUrls: ['./peak-item.component.css']
})
export class PeakItemComponent implements OnInit {
  peak: Model | undefined = undefined;

  selectedModelIndex: number | undefined = undefined;
  peakNum: number = 0;

  constructor(
    private modelService: ModelService) {
  }

  ngOnInit() {
    this.modelService.selectedPeak$.subscribe((peak: Model | undefined) => {
      this.peak = peak;
    });
    this.modelService.selectedPeakIndex$.subscribe((index: number | undefined) => {
      this.selectedModelIndex = index;
      this.peakNum = this.modelService.getPeaks().length;
    });
  }

  increaseModelIndex() {
    if (this.selectedModelIndex !== undefined) {
      this.modelService.selectPeak(this.selectedModelIndex + 1);
    }
  }

  decreaseModelIndex() {
    if (this.selectedModelIndex !== undefined) {
      this.modelService.selectPeak(this.selectedModelIndex - 1);
    }
  }

  removePeak() {
    if (this.selectedModelIndex !== undefined) {
      this.modelService.removePeak(this.selectedModelIndex);
    }
  }
}
