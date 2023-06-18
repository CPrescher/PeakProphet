import {Injectable} from '@angular/core';
import {PatternService} from "./pattern.service";
import {FitModel} from "./data/fit-model";
import {createLinearChangingPeakPatterns} from "./data/pattern-generation";
import {ModelService} from "./model.service";
import {ClickModel} from "./models/model.interface";
import {Pattern} from "./data/pattern";
import {fromEvent, map, Observable, Subject, take, withLatestFrom} from "rxjs";
import {BkgService} from "./bkg.service";
import {LinearModel} from "./models/bkg/linear.model";
import {readXY} from "./data/input";
import {PlotState} from "../plot/plot.reducers";
import {Store} from "@ngrx/store";
import {setCurrentPattern} from "../plot/plot.actions";
import {
  addFitItem,
  addModel, clearFitItems,
  moveFitItem,
  removeFitItem,
  selectFitItem,
  setModels
} from "../project/store/project.actions";
import {ProjectState} from "../project/store/project.state";
import {GaussianModel} from "./models/peaks/gaussian.model";
import {currentFitItemIndex} from "../project/store/project.selectors";


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
  public currentFitItemIndex: number | undefined = undefined;

  constructor(
    private plotStore: Store<PlotState>,
    private projectStore: Store<ProjectState>,
    private patternService: PatternService,
    private peakService: ModelService,
    private bkgService: BkgService
  ) {
    const patterns = createLinearChangingPeakPatterns('gold ', 4, 10, [0, 10])
    for (let i = 0; i < patterns.length; i++) {
      this.addFitModel(`Dataset ${i + 1}`, patterns[i], [new GaussianModel(3.0),], true);
    }
    this.selectFitModel(0);

    this._setupObservables();
  }

  private _setupObservables() {
    this.projectStore.select(currentFitItemIndex).subscribe((index: number | undefined) => {
      this.currentFitItemIndex = index;
    });


    this.bkgService.bkgTypeChanged$.pipe(
      withLatestFrom(this.projectStore.select(currentFitItemIndex)),
    )
      .subscribe(([bkgModel, selectedIndex]) => {
        if (bkgModel) {
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

    this.projectStore.dispatch(addFitItem(
      {
        name: name,
        pattern: new Pattern(name, pattern.x, pattern.y),
      }
    ));

    peaks.forEach(peak => {
      this.projectStore.dispatch(addModel(
        {
          itemIndex: this.fitModels.length - 1,
          model: Object.assign({}, peak) // Using a copy of the peak
        }
      ));
    })

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
    this.plotStore.dispatch(setCurrentPattern({pattern: fitModel.pattern}));
    this.peakService.setPeaks(fitModel.peaks);
    this.bkgService.setBkgModel(fitModel.background);
  }

  private clearSubServices() {
    this.plotStore.dispatch(setCurrentPattern({pattern: undefined}));
    this.bkgService.clearBkgModel();
    this.peakService.setPeaks([]);
    if (this.currentFitItemIndex !== undefined) {
      this.projectStore.dispatch(setModels({itemIndex: this.currentFitItemIndex, peaks: []}));
    }
  }

  /**
   * Select a FitModel from the list of FitModels. This will send notifications to subscribers.
   * @param index - index of the FitModel to select
   */
  selectFitModel(index: number) {
    if (index < this.fitModels.length && index >= 0) {
      const fitModel = this.fitModels[index];
      this.updateSubServices(fitModel);
      this.projectStore.dispatch(selectFitItem({index}));
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
    const fitIndex = this.currentFitItemIndex;
    if (fitIndex !== undefined) {
      const fitModel = this.fitModels[fitIndex];

      let [result$, progress$, stopper$] = fitModel.fit();

      progress$.pipe(
      ).subscribe(([_, selectedIndex]) => {
        if (selectedIndex === fitIndex) {
          this.updateSubServices(fitModel)
        }
      });

      result$.pipe(
        withLatestFrom(this.projectStore.select(currentFitItemIndex)),
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
    this.projectStore.dispatch(removeFitItem({index}));
    this.fitModels.splice(index, 1);

    if (index === this.fitModels.length && index > 0) {
      this.selectFitModel(index - 1);
    } else if (index < this.fitModels.length) {
      this.selectFitModel(index);
    } else {
      this.projectStore.dispatch(selectFitItem({index: undefined}));
    }
    if (this.fitModels.length === 0) {
      this.clearSubServices();
    }
  }

  clearFitModels() {
    this.fitModels = [];
    this.projectStore.dispatch(selectFitItem({index: undefined}));
    this.clearSubServices();
    this.projectStore.dispatch(clearFitItems());
  }

  moveFitModelUp(index: number) {
    if (index > 0) {
      const model = this.fitModels[index];
      this.fitModels.splice(index, 1);
      this.fitModels.splice(index - 1, 0, model);
      this.selectFitModel(index - 1);
      this.projectStore.dispatch(moveFitItem({index, delta: -1}));
      this.projectStore.dispatch(selectFitItem({index: index - 1}))
    }
  }

  moveFitModelDown(index: number) {
    if (index < this.fitModels.length - 1) {
      const model = this.fitModels[index];
      this.fitModels.splice(index, 1);
      this.fitModels.splice(index + 1, 0, model);
      this.selectFitModel(index + 1);
      this.projectStore.dispatch(moveFitItem({index, delta: 1}));
      this.projectStore.dispatch(selectFitItem({index: index + 1}))
    }
  }
}
