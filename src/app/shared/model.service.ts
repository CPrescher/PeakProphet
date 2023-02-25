import {Injectable} from '@angular/core';
import {Model} from "./peak-types/model.interface";
import {GaussianModel} from "./peak-types/gaussian.model";
import {LorentzianModel} from "./peak-types/lorentzian.model";
import {PseudoVoigtModel} from "./peak-types/pseudo-voigt.model";
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


  private selectedPeakIndexSubject = new BehaviorSubject<number>(0);
  public selectedPeakIndex$ = this.selectedPeakIndexSubject.asObservable();
  private selectedPeakSubject = new Subject<Model>();
  public selectedPeak$ = this.selectedPeakSubject.asObservable();

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
    } else {
      throw new Error(`Cannot select peak at index ${index}, it does not exist`);
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
    } else {
      throw new Error(`Cannot remove peak at index ${index}, it does not exist`);
    }
  }

  clearPeaks() {
    this.peaks = [];
  }
}
