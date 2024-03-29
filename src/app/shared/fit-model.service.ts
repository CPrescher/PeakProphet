import {Injectable} from '@angular/core';
import {PatternService} from "./pattern.service";
import {FitModel} from "./data/fit-model";
import {createLinearChangingPeakPatterns} from "./data/pattern-generation";
import {PeakService} from "./peak.service";
import {ClickModel} from "./models/model.interface";
import {Pattern} from "./data/pattern";
import {BehaviorSubject, fromEvent, map, Observable, Subject, take, tap, withLatestFrom} from "rxjs";
import {BkgService} from "./bkg.service";
import {LinearModel} from "./models/bkg/linear.model";
import {readXY} from "./data/input";


/**
 * A FitModelService is a service that manages the list of FitModels.
 * It enables adding, removing, and selecting FitModels, and updates the current FitModel.
 * It also enables fitting the current FitModel.
 */
@Injectable({
  providedIn: 'root'
})
export class FitModelService {
  public fitModels: FitModel[] = [];

  private fitModelsSubject = new BehaviorSubject<FitModel[]>([]);
  public fitModels$ = this.fitModelsSubject.asObservable();

  private fitProgressSubject = new Subject<any>();
  public fitProgress$ = this.fitProgressSubject.asObservable();

  private selectedIndexSubject = new BehaviorSubject<number | undefined>(undefined);
  public selectedIndex$ = this.selectedIndexSubject.asObservable();

  private selectedFitModelSubject = new BehaviorSubject<FitModel | undefined>(undefined);
  public selectedFitModel$ = this.selectedFitModelSubject.asObservable();

  constructor(
    private patternService: PatternService,
    private peakService: PeakService,
    private bkgService: BkgService
  ) {
    const patterns = createLinearChangingPeakPatterns('gold ', 4, 100, [0, 10])
    for (let i = 0; i < patterns.length; i++) {
      this.addFitModel(`Fit Model ${i + 1}`, patterns[i]);
    }
    this.selectFitModel(0);

    this._setupObservables();
  }

  private _setupObservables() {
    this.selectedIndex$.pipe(
      map((index) => {
        if (index !== undefined) {
          return this.fitModels[index];
        }
        return undefined;
      })
    ).subscribe(this.selectedFitModelSubject);


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

  /**
   * Add a FitModel to the list of FitModels.
   * @param name - name of the FitModel
   * @param pattern - pattern of the FitModel
   * @param peaks - peaks of the FitModel
   * @param silent - if true, the FitModel will not be selected and no signals sent to sub-services
   */
  addFitModel(name: string, pattern: Pattern, peaks: ClickModel[] = [], silent = false) {
    const bkg = new LinearModel();
    bkg.guess(pattern.x, pattern.y)
    const fitModel = new FitModel(name, pattern, peaks, bkg);
    this.fitModels.push(fitModel);
    this.fitModelsSubject.next(this.fitModels);

    if (!silent) {
      this.selectFitModel(this.fitModels.length - 1);
      this.updateSubServices(fitModel);
    }
  }

  /**
   * Remove a FitModel from the list of FitModels.
   * @param fitModel - FitModel to remove
   * @private
   */
  private updateSubServices(fitModel: FitModel) {
    this.patternService.setPattern(fitModel.pattern);
    this.peakService.setPeaks(fitModel.peaks);
    this.bkgService.setBkgModel(fitModel.background);
  }

  private clearSubServices() {
    this.patternService.clearPattern();
    this.bkgService.clearBkgModel();
    this.peakService.setPeaks([]);
  }

  /**
   * Select a FitModel from the list of FitModels. This will send notifications to subscribers.
   * @param index - index of the FitModel to select
   */
  selectFitModel(index: number) {
    if (index < this.fitModels.length && index >= 0) {
      const fitModel = this.fitModels[index];
      this.updateSubServices(fitModel);
      this.selectedIndexSubject.next(index);
    } else {
      throw new Error(`Cannot select fit model at index ${index}, it does not exist`);
    }
  }

  /**
   * Reads an XY-file and adds a FitModel with the corresponding pattern to the list of FitModels.
   * @param file - file to read
   * @param silent - if true, the FitModel will not be selected and no signals sent to sub-services
   * @returns an Observable that completes when the file has been read
   */
  readData(file: File, silent = false): Observable<void> {
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
    return fromEvent(fileReader, 'loadend').pipe(
      take(1),
      map(() => {
      }));
  }

  /**
   * Fit the current FitModel.
   * @returns a Subject that can be used to stop the fitting process
   */
  fitData(): Subject<void> | undefined {
    const fitIndex = this.selectedIndexSubject.value;
    if (fitIndex !== undefined) {
      const fitModel = this.fitModels[fitIndex];

      let [result$, progress$, stopper$] = fitModel.fit();

      progress$.pipe(
        withLatestFrom(this.selectedIndex$),
      ).subscribe(([_, selectedIndex]) => {
        if (selectedIndex === fitIndex) {
          this.updateSubServices(fitModel)
        }
      });

      result$.pipe(
        withLatestFrom(this.selectedIndex$),
      ).subscribe(([_, selectedIndex]) => {
        if (selectedIndex === fitIndex) {
          this.updateSubServices(fitModel)
        }
      });

      return stopper$;
    }
    return undefined;
  }

  /**
   * Remove a FitModel from the list of FitModels.
   * @param index - index of the FitModel to remove
   */
  removeFitModel(index: number) {
    this.fitModels.splice(index, 1);
    this.fitModelsSubject.next(this.fitModels);

    if (index === this.fitModels.length && index > 0) {
      this.selectFitModel(index - 1);
    } else if (index < this.fitModels.length) {
      this.selectFitModel(index);
    } else {
      this.selectedIndexSubject.next(undefined);
    }
    if (this.fitModels.length === 0) {
      this.clearSubServices();
    }
  }

  clearFitModels() {
    this.fitModels = [];
    this.fitModelsSubject.next(this.fitModels);
    this.selectedIndexSubject.next(undefined);
    this.clearSubServices();
  }

  moveFitModelUp(index: number) {
    if (index > 0) {
      const model = this.fitModels[index];
      this.fitModels.splice(index, 1);
      this.fitModels.splice(index - 1, 0, model);
      this.fitModelsSubject.next(this.fitModels);
      this.selectFitModel(index - 1);
    }
  }

  moveFitModelDown(index: number) {
    if (index < this.fitModels.length - 1) {
      const model = this.fitModels[index];
      this.fitModels.splice(index, 1);
      this.fitModels.splice(index + 1, 0, model);
      this.fitModelsSubject.next(this.fitModels);
      this.selectFitModel(index + 1);
    }
  }
}
