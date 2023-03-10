import {Injectable} from '@angular/core';
import {PatternService} from "./pattern.service";
import {FitModel} from "./data/fit-model";
import {createRandomPattern} from "./data/pattern-generation";
import {createRandomGaussian} from "./data/peak-generation";
import {PeakService} from "./peak.service";
import {ClickModel} from "./models/model.interface";
import {Pattern} from "./data/pattern";
import {BehaviorSubject, take, throttleTime} from "rxjs";
import {BkgService} from "./bkg.service";
import {LinearModel} from "./models/bkg/linear.model";
import {readXY} from "./data/input";
import {FitService} from "./fit.service";

@Injectable({
  providedIn: 'root'
})
export class FitModelService {
  public fitModels: FitModel[] = [];
  private fitModelsSubject = new BehaviorSubject<FitModel[]>([]);
  public fitModels$ = this.fitModelsSubject.asObservable();
  private selectedIndexSubject = new BehaviorSubject<number | undefined>(undefined);
  public selectedIndex$ = this.selectedIndexSubject.asObservable();

  private selectedFitModelSubject = new BehaviorSubject<FitModel | undefined>(undefined);
  public selectedFitModel$ = this.selectedFitModelSubject.asObservable();

  constructor(
    private patternService: PatternService,
    private peakService: PeakService,
    private bkgService: BkgService,
    private fitService: FitService
  ) {
    const patterns = [
      createRandomPattern("Random Pattern 1", 1, [0, 10]),
      createRandomPattern("Random Pattern 2", 2, [0, 10]),
      createRandomPattern("Random Pattern 3", 3, [0, 10]),
    ];
    for (let i = 0; i < patterns.length; i++) {
      const peaks = [
        createRandomGaussian(),
        createRandomGaussian(),
      ]
      this.addFitModel(`Fit Model ${i}`, patterns[i], peaks);
    }


    this.bkgService.bkgTypeChanged$.subscribe((bkgModel) => {
      if (bkgModel) {
        const selectedIndex = this.selectedIndexSubject.value;
        if (selectedIndex !== undefined) {
          const selectedFitModel = this.fitModels[selectedIndex];
          bkgModel.guess(selectedFitModel.pattern.x, selectedFitModel.pattern.y);
          selectedFitModel.background = bkgModel;
          this.selectFitModel(selectedIndex);
        }
      }
    });
  }

  addFitModel(name: string, pattern: Pattern, peaks: ClickModel[], silent = false) {
    const bkg = new LinearModel();
    bkg.guess(pattern.x, pattern.y)
    const fitModel = new FitModel(name, pattern, peaks, bkg);
    this.fitModels.push(fitModel);
    this.fitModelsSubject.next(this.fitModels);

    if (!silent) {
      this.updateSubServices(fitModel);
      this.selectFitModel(this.fitModels.length - 1);
    }
  }

  private updateSubServices(fitModel: FitModel) {
    this.patternService.setPattern(fitModel.pattern);
    this.peakService.setPeaks(fitModel.peaks);
    this.bkgService.setBkgModel(fitModel.background);
  }

  selectFitModel(index: number) {
    if (index < this.fitModels.length && index >= 0) {
      const fitModel = this.fitModels[index];
      this.updateSubServices(fitModel);
      this.selectedIndexSubject.next(index);
      this.selectedFitModelSubject.next(fitModel);

    } else {
      throw new Error(`Cannot select fit model at index ${index}, it does not exist`);
    }
  }

  readData(file: File, silent = false) {
    const fileReader = new FileReader();
    fileReader.onload = (_) => {
      const data = fileReader.result;
      if (typeof data === 'string') {
        const result: { x: number[], y: number[] } = readXY(data);
        const pattern = new Pattern(file.name, result.x, result.y);
        this.addFitModel(file.name, pattern, [], silent);
      }
    }
    fileReader.readAsText(file);
  }

  fitData() {
    const selectedIndex = this.selectedIndexSubject.value;
    if (selectedIndex !== undefined) {
      this.fitService.fitModel(this.fitModels[selectedIndex]);


      let progressSub = this.fitService.fitProgress$.pipe(
        throttleTime(30)).subscribe(() => {
        console.log("Progress")
        this.selectFitModel(selectedIndex);
      })

      this.fitService.fitFinished$.pipe(take(1)).subscribe((fitModel) => {
        console.log("Finished");
        this.selectFitModel(selectedIndex);
        progressSub.unsubscribe();
      });
    }
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
