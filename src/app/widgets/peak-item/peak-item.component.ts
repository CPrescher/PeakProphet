import {Component, OnInit} from '@angular/core';
import {Model} from "../../shared/models/model.interface";
import {PeakService} from "../../shared/peak.service";

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
    private peakService: PeakService) {
  }

  ngOnInit() {
    this.peakService.selectedPeak$.subscribe((peak: Model | undefined) => {
      this.peak = peak;
    });
    this.peakService.selectedPeakIndex$.subscribe((index: number | undefined) => {
      this.selectedModelIndex = index;
      this.peakNum = this.peakService.getPeaks().length;
    });
  }

  removePeak() {
    if (this.selectedModelIndex !== undefined) {
      this.peakService.removePeak(this.selectedModelIndex);
    }
  }

  updatePeak() {
    if (this.peak !== undefined && this.selectedModelIndex !== undefined) {
      this.peakService.updatePeak(this.selectedModelIndex, this.peak);
    }
  }

  selectPeak(index: number) {
    this.peakService.selectPeak(index);
  }
}
