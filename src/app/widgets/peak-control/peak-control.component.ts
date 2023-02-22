import {Component} from '@angular/core';

@Component({
  selector: 'app-peak-control',
  templateUrl: './peak-control.component.html',
  styleUrls: ['./peak-control.component.css']
})
export class PeakControlComponent {
  peakTypes = [
    "Gaussian", "Lorentzian", "Pseudo-Voigt"
  ]
  selectedPeakType = "Gaussian";

  addPeak() {
    console.log("addPeak");
  }
}
