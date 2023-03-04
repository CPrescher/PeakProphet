import {Component, OnInit} from '@angular/core';
import {ClickModel} from "../../shared/models/model.interface";
import {PeakService} from "../../shared/peak.service";

@Component({
  selector: 'app-peak-item',
  templateUrl: './peak-item.component.html',
  styleUrls: ['./peak-item.component.css']
})
export class PeakItemComponent implements OnInit {
  peak: ClickModel | undefined = undefined;

  selectedPeakIndex: number | undefined = undefined;
  peakNum: number = 0;

  constructor(
    private peakService: PeakService) {
  }

  ngOnInit() {
    this.peakService.selectedPeak$.subscribe((peak: ClickModel | undefined) => {
      this.peak = peak;
    });
    this.peakService.selectedPeakIndex$.subscribe((index: number | undefined) => {
      this.selectedPeakIndex = index;
      this.peakNum = this.peakService.getPeaks().length;
    });
  }

  removePeak() {
    if (this.selectedPeakIndex !== undefined) {
      this.peakService.removePeak(this.selectedPeakIndex);
    }
  }

  updatePeak() {
    if (this.peak !== undefined && this.selectedPeakIndex !== undefined) {
      this.peakService.updatePeak(this.selectedPeakIndex, this.peak);
    }
  }

  selectPeak(index: number) {
    this.peakService.selectPeak(index);
  }

  definePeak() {
    if(this.selectedPeakIndex !== undefined) {
      this.peakService.clickDefinePeak(this.selectedPeakIndex);
    }
  }
}
