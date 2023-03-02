import {Injectable} from '@angular/core';
import {PatternService} from "./pattern.service";
import {FitModel} from "./data/fit-model";
import {createRandomPattern} from "./data/pattern-generation";
import {createRandomGaussian} from "./data/peak-generation";
import {PeakService} from "./peak.service";
import {Model} from "./models/model.interface";
import {Pattern} from "./data/pattern";
import {BehaviorSubject, Subscription} from "rxjs";
import {BkgService} from "./bkg.service";
import {LinearModel} from "./models/bkg/linear.model";

@Injectable({
  providedIn: 'root'
})
export class FitModelService {
  public fitModels: FitModel[] = [];
  private bkgSubscription: Subscription = new Subscription();

  private selectedIndexSubject = new BehaviorSubject<number | undefined>(undefined);
  public selectedIndex$ = this.selectedIndexSubject.asObservable();

  constructor(
    private patternService: PatternService,
    private peakService: PeakService,
    private bkgService: BkgService,
  ) {
    const patterns = [
      createRandomPattern("Random Pattern 1", 10, [0, 100]),
      createRandomPattern("Random Pattern 2", 13, [0, 100]),
      createRandomPattern("Random Pattern 3", 50, [0, 100]),
    ];
    for (let i = 0; i < patterns.length; i++) {
      const peaks = [
        createRandomGaussian(),
        createRandomGaussian(),
      ]
      this.addFitModel(`Fit Model ${i}`, patterns[i], peaks);
    }
  }

  addFitModel(name: string, pattern: Pattern, peaks: Model[]) {
    const fitModel = new FitModel(name, pattern, peaks, new LinearModel());
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
      this.selectedIndexSubject.next(index);
      this.bkgSubscription.unsubscribe();
      this.bkgService.selectBkgModel(fitModel.background);

      this.bkgSubscription = this.bkgService.bkgModel$.subscribe((bkgModel) => {
        if (bkgModel) {
          fitModel.background = bkgModel;
        }
      });
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
