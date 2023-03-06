import {Injectable} from '@angular/core';
import {PatternService} from "./pattern.service";
import {FitModel} from "./data/fit-model";
import {createRandomPattern} from "./data/pattern-generation";
import {createRandomGaussian} from "./data/peak-generation";
import {PeakService} from "./peak.service";
import {ClickModel} from "./models/model.interface";
import {Pattern} from "./data/pattern";
import {BehaviorSubject, Subscription} from "rxjs";
import {BkgService} from "./bkg.service";
import {LinearModel} from "./models/bkg/linear.model";
import {readXY} from "./data/input";

@Injectable({
  providedIn: 'root'
})
export class FitModelService {
  public fitModels: FitModel[] = [];
  private fitModelsSubject = new BehaviorSubject<FitModel[]>([]);
  public fitModels$ = this.fitModelsSubject.asObservable();
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

  addFitModel(name: string, pattern: Pattern, peaks: ClickModel[]) {
    const fitModel = new FitModel(name, pattern, peaks, new LinearModel());
    this.fitModels.push(fitModel);
    this.patternService.setPattern(fitModel.pattern);
    this.peakService.setPeaks(fitModel.peaks);
    this.fitModelsSubject.next(this.fitModels);
    this.selectFitModel(this.fitModels.length - 1);
  }

  selectFitModel(index: number) {
    if (index < this.fitModels.length && index >= 0) {
      const fitModel = this.fitModels[index];
      this.patternService.setPattern(fitModel.pattern);
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

  readData(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (_) => {
      const data = fileReader.result;
      if (typeof data === 'string') {
        const result: { x: number[], y: number[] } = readXY(data);
        const pattern = new Pattern(file.name, result.x, result.y);
        this.addFitModel(file.name, pattern, []);
      }
    }
    fileReader.readAsText(file);
  }

  removeFitModel(index: number) {
    this.fitModels.splice(index, 1);
    if (index === this.fitModels.length && index > 0) {
      this.selectFitModel(index - 1);
    } else if (index < this.fitModels.length) {
      this.selectFitModel(index);
    }
    if (this.fitModels.length === 0) {
      this.peakService.clearPeaks();
      this.patternService.clearPattern();
    }
  }
}
