import {Injectable} from '@angular/core';
import {PatternService} from "./pattern.service";
import {FitModel} from "./data/fit-model";
import {createRandomPattern} from "./data/pattern-generation";
import {PeakService} from "./peak.service";
import {Model} from "./peak-types/model.interface";
import {Pattern} from "./data/pattern";
import {GaussianModel} from "./peak-types/gaussian.model";
import {LorentzianModel} from "./peak-types/lorentzian.model";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class FitModelService {
  public fitModels: FitModel[] = [];
  public selectedIndex: number;

  private selectedIndexSubject = new BehaviorSubject<number | undefined>(undefined);
  public selectedIndex$ = this.selectedIndexSubject.asObservable();

  public
  constructor(
    private patternService: PatternService,
    private peakService: PeakService,
  ) {
    const patterns = [
      createRandomPattern("Random Pattern 1", 10, [0, 100]),
      createRandomPattern("Random Pattern 2", 13, [0, 100]),
      createRandomPattern("Random Pattern 3", 50, [0, 100]),
    ];
    for (let i = 0; i < patterns.length; i++) {
      const peaks = [
        new GaussianModel(),
        new LorentzianModel(),
      ]
      this.addFitModel(`Fit Model ${i}`, patterns[i], peaks);
    }

  }

  addFitModel(name: string, pattern: Pattern, peaks: Model[]) {
    const fitModel = new FitModel(name, pattern, peaks);
    this.fitModels.push(fitModel);
    this.patternService.addPattern(fitModel.pattern.name, fitModel.pattern.x, fitModel.pattern.y);
    this.peakService.setPeaks(fitModel.peaks);
    this.selectFitModel(this.fitModels.length - 1);
  }

  selectFitModel(index: number) {
    if (index < this.fitModels.length && index >= 0) {
      const fitModel = this.fitModels[index];
      this.patternService.selectPattern(index);
      this.peakService.setPeaks(fitModel.peaks);
      this.selectedIndex = index;
    } else {
      throw new Error(`Cannot select fit model at index ${index}, it does not exist`);
    }
  }

  removeFitModel(index: number) {
    this.fitModels.splice(index, 1);
    this.patternService.removePattern(index);
    if (index === this.fitModels.length && index > 0) {
      this.selectFitModel(index - 1);
    } else if (index < this.fitModels.length) {
      this.selectFitModel(index);
    }
    if (this.fitModels.length === 0) {
      this.peakService.clearPeaks();
    }
  }
}
