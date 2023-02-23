import {Injectable} from '@angular/core';
import {Model} from "./model.interface";
import {GaussianModel} from "./gaussian.model";
import {LorentzianModel} from "./lorentzian.model";
import {PseudoVoigtModel} from "./pseudo-voigt.model";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private peaks: Model[] = [];
  public peakTypes: { [key: string]: any } = {
    "Gaussian": GaussianModel,
    "Lorentzian": LorentzianModel,
    "Pseudo-Voigt": PseudoVoigtModel,
  }


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

  addPeak(peakTypeName: string) {
    const peakType = this.peakTypes[peakTypeName];
    if (peakType === undefined) {
      throw new Error(`Peak type ${peakTypeName} not found`);
    }
    const peak = new peakType();
    this.peaks.push(peak);
    this.selectPeak(this.peaks.length - 1);
  }

  removePeak(index: number) {
    if (index < this.peaks.length && index >= 0) {
      this.peaks.splice(index, 1);
      if (index === this.peaks.length) {
        this.selectPeak(index - 1);
      } else {
        this.selectPeak(index);
      }
    }
  }
}
