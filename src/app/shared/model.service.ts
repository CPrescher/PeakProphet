import { Injectable } from '@angular/core';
import {Model} from "./model.interface";
import {GaussianModel} from "./gaussian.model";

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private peaks: Model[] = [];

  constructor() {
    this.peaks = [
      new GaussianModel(),
      new GaussianModel(),
    ]
  }

  getPeaks(): Model[] {
    return this.peaks;
  }
}
