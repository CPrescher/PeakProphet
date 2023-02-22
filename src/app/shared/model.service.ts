import { Injectable } from '@angular/core';
import {Model} from "./model.interface";
import {GaussianModel} from "./gaussian.model";
import {LorentzianModel} from "./lorentzian.model";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private peaks: Model[] = [];


  public selectedPeakIndexSubject = new BehaviorSubject<number>(0);
  public selectedPeakSubject = new Subject<Model>();

  constructor() {
    this.peaks = [
      new GaussianModel(),
      new LorentzianModel(),
    ]
  }

  selectPeak(index: number) {
    if (index < this.peaks.length && index >= 0) {
      this.selectedPeakIndexSubject.next(index);
      this.selectedPeakSubject.next(this.peaks[index]);
    }
  }

  getPeaks(): Model[] {
    return this.peaks;
  }
}
