import {Component,OnInit} from '@angular/core';
import {ModelService} from "../../../shared/model.service";
import {Store} from "@ngrx/store";
import {ProjectState} from "../../../project/store/project.state";

@Component({
  selector: 'app-peak-control',
  templateUrl: './peak-control.component.html',
  styleUrls: ['./peak-control.component.css']
})
export class PeakControlComponent implements OnInit {
  peakTypes: String[] = [];
  selectedPeakType: string = "Gaussian";

  constructor(
    private projectStore: Store<ProjectState>,
    private peakService: ModelService) {
  }

  ngOnInit() {
    this.peakTypes = Object.keys(this.peakService.peakTypes);
  }

  addPeak() {
    this.peakService.addPeak(this.selectedPeakType);
    this.peakService.clickDefineModel()
  }
}
