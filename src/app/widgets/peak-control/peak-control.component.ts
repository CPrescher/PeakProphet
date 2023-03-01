import {Component, OnInit} from '@angular/core';
import {PeakService} from "../../shared/peak.service";

@Component({
  selector: 'app-peak-control',
  templateUrl: './peak-control.component.html',
  styleUrls: ['./peak-control.component.css']
})
export class PeakControlComponent implements OnInit {
  peakTypes: String[] = [];
  selectedPeakType: string = "Gaussian";

  constructor(private modelService: PeakService) {
  }

  ngOnInit() {
    this.peakTypes = Object.keys(this.modelService.peakTypes);
  }

  addPeak() {
    this.modelService.addPeak(this.selectedPeakType);
  }
}
