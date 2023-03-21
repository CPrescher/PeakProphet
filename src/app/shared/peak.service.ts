import {Injectable} from '@angular/core';
import {ClickModel, Model} from "./models/model.interface";
import {GaussianModel} from "./models/peaks/gaussian.model";
import {LorentzianModel} from "./models/peaks/lorentzian.model";
import {PseudoVoigtModel} from "./models/peaks/pseudo-voigt.model";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {MousePositionService} from "./mouse-position.service";


/**
 * Service for managing peaks.
 * It enables adding, removing, and updating peaks of a FitModel. It also enables selecting a peak.
 */
@Injectable({
  providedIn: 'root'
})
export class PeakService {
  public peaks: ClickModel[] = [];
  private peaksSubject = new BehaviorSubject<ClickModel[]>([]);
  public peaks$ = this.peaksSubject.asObservable();

  public peakTypes: { [key: string]: any } = {
    "Gaussian": GaussianModel,
    "Lorentzian": LorentzianModel,
    "Pseudo-Voigt": PseudoVoigtModel,
  }

  private selectedPeakIndexSubject = new BehaviorSubject<number | undefined>(undefined);
  public selectedPeakIndex$ = this.selectedPeakIndexSubject.asObservable();
  private selectedPeakSubject = new BehaviorSubject<ClickModel | undefined>(undefined);
  public selectedPeak$ = this.selectedPeakSubject.asObservable();
  private addedPeakSubject = new Subject<ClickModel>();
  public addedPeak$ = this.addedPeakSubject.asObservable();

  private updatedPeakSubject = new Subject<{ "index": number, "model": ClickModel }>();
  public updatedPeak$ = this.updatedPeakSubject.asObservable();
  private removedPeakSubject = new Subject<number>();
  public removedPeak$ = this.removedPeakSubject.asObservable();

  constructor(private mousePositionService: MousePositionService) {
    this.peaks = [
      new GaussianModel(),
      new LorentzianModel(),
    ]

    this.selectedPeakIndexSubject.next(1);
    this.selectedPeakSubject.next(this.peaks[1]);
    this.peaksSubject.next(this.peaks);
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

  setPeaks(peaks: ClickModel[]) {
    this.peaks = peaks;
    this.peaksSubject.next(this.peaks);
    this.updatePeakSelectionSubjects();
  }

  /**
   * Updates the selected peak index and selected peak subjects to be valid references. Takes into account the case
   * where the selected peak index is out of bounds. If the selected peak index is out of bounds, it is set to the last
   * peak in the list.
   */
  updatePeakSelectionSubjects() {
    if (this.peaks.length === 0) {
      this.selectedPeakIndexSubject.next(undefined);
      this.selectedPeakSubject.next(undefined);
      return;
    } else {
      let selectedPeakIndex = this.selectedPeakIndexSubject.getValue();
      if (selectedPeakIndex === undefined || selectedPeakIndex >= this.peaks.length) {
        selectedPeakIndex = this.peaks.length - 1;
      }
      this.selectedPeakIndexSubject.next(selectedPeakIndex);
      this.selectedPeakSubject.next(this.peaks[selectedPeakIndex]);
    }
  }

  addPeak(peakTypeName: string) {
    const peakType = this.peakTypes[peakTypeName];
    if (peakType === undefined) {
      throw new Error(`Peak type ${peakTypeName} not found`);
    }
    const peak = new peakType();
    this.peaks.push(peak);
    this.addedPeakSubject.next(peak);
    this.selectPeak(this.peaks.length - 1);
  }

  removePeak(index: number) {
    if (index < this.peaks.length && index >= 0) {
      this.peaks.splice(index, 1);
      this.removedPeakSubject.next(index);
      this.peaksSubject.next(this.peaks);
      this.updatePeakSelectionSubjects();
    } else {
      throw new Error(`Cannot remove peak at index ${index}, it does not exist`);
    }
  }

  updatePeak(index: number, peak: ClickModel) {
    if (index < this.peaks.length && index >= 0) {
      this.peaks[index] = peak;
      this.updatedPeakSubject.next({"index": index, "model": peak});
    } else {
      throw new Error(`Cannot update peak at index ${index}, it does not exist`);
    }
  }

  clearPeaks() {
    this.peaks = [];
    this.selectedPeakIndexSubject.next(undefined);
    this.selectedPeakSubject.next(undefined);
    this.peaksSubject.next(this.peaks);
  }

  private mousePositionSubscription: Subscription = new Subscription();
  private mouseClickSubscription: Subscription = new Subscription();

  clickDefinePeak(index: number = this.selectedPeakIndexSubject.getValue() as number) {

    // Unsubscribe from any existing subscriptions
    this.mousePositionSubscription.unsubscribe()
    this.mouseClickSubscription.unsubscribe()
    // Reset the peak steps
    this.peaks[index].currentStep = 0;

    this.mousePositionSubscription =
      this.mousePositionService.patternMousePosition$.subscribe((mousePosition) => {
        const x = mousePosition.x;
        const y = mousePosition.y;
        this.peaks[index].defineModel(x, y);
        this.updatedPeakSubject.next({"index": index, "model": this.peaks[index]});
      });

    this.mouseClickSubscription =
      this.mousePositionService.patternClickPosition$.subscribe((mousePosition) => {
        this.peaks[index].defineModel(mousePosition.x, mousePosition.y);
        this.peaks[index].currentStep++;
        this.updatedPeakSubject.next({"index": index, "model": this.peaks[index]});
        if (this.peaks[index].currentStep === this.peaks[index].clickSteps) {
          this.mousePositionSubscription.unsubscribe();
          this.mouseClickSubscription.unsubscribe();
        }
      });
  }

}
