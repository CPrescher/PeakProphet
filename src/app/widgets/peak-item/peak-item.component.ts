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
  constructor(
     private modelService: ModelService) {
  }

  ngOnInit() {
    this.peak = this.modelService.getPeaks()[0];
  }

}
