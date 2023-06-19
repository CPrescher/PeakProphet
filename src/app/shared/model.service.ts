import {Injectable} from '@angular/core';
import {ClickModel, Model} from "./models/model.interface";
import {GaussianModel} from "./models/peaks/gaussian.model";
import {LorentzianModel} from "./models/peaks/lorentzian.model";
import {PseudoVoigtModel} from "./models/peaks/pseudo-voigt.model";
import {BehaviorSubject, Subject, Subscription, take, takeWhile, withLatestFrom} from "rxjs";
import {MousePositionService} from "./mouse-position.service";
import {BkgService} from "./bkg.service";
import {Store} from '@ngrx/store';
import {ProjectState} from "../project/store/project.state";
import {addModel, addModelType, clearModels, removeModel, selectModel, updateParameter} from '../project/store/project.actions';
import {currentFitItemIndex, currentModelIndex} from "../project/store/project.selectors";
import {Parameter} from "./models/parameter.model";


/**
 * Service for managing peaks.
 * It enables adding, removing, and updating peaks of a FitModel. It also enables selecting a peak.
 */
@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public models: ClickModel[] = [];

  public peakTypes: { [key: string]: any } = {
    "Gaussian": GaussianModel,
    "Lorentzian": LorentzianModel,
    "Pseudo-Voigt": PseudoVoigtModel,
  }

  private addedModelSubject = new Subject<ClickModel>();
  public addedModel$ = this.addedModelSubject.asObservable();

  private updatedModelSubject = new Subject<{ "index": number, "model": ClickModel }>();
  public updatedPeak$ = this.updatedModelSubject.asObservable();
  private removedModelSubject = new Subject<number>();
  public removedPeak$ = this.removedModelSubject.asObservable();

  private currentFitItemIndex: number | undefined = undefined;
  private currentModelIndex: number | undefined = 0;


  constructor(
    private projectStore: Store<ProjectState>,
    private mousePositionService: MousePositionService,
    private bkgService: BkgService,
  ) {
    this.projectStore.select(currentModelIndex).subscribe((index: number | undefined) => {
      this.currentModelIndex = index;
    });

    this.projectStore.select(currentFitItemIndex).subscribe((index: number | undefined) => {
      this.currentFitItemIndex = index;
    });
  }

  selectModel(index: number) {
    if (this.currentFitItemIndex === undefined) {
      throw new Error("Cannot select peak, no fit item is selected");
    }
    this.projectStore.dispatch(selectModel({itemIndex: this.currentFitItemIndex, modelIndex: index}));
  }

  getPeaks(): Model[] {
    return this.models;
  }

  setPeaks(peaks: ClickModel[]) {
    this.models = peaks;
    this.updatePeakSelectionSubjects();
  }

  /**
   * Updates the selected peak index and selected peak subjects to be valid references. Takes into account the case
   * where the selected peak index is out of bounds. If the selected peak index is out of bounds, it is set to the last
   * peak in the list.
   */
  updatePeakSelectionSubjects() {
    console.log(this.currentFitItemIndex)
    if (this.currentFitItemIndex === undefined) {
      return;
    }
    if (this.models.length === 0) {
      this.projectStore.dispatch(selectModel({itemIndex: this.currentFitItemIndex, modelIndex: undefined}));
      return;
    } else {
      if (this.currentModelIndex === undefined || this.currentModelIndex >= this.models.length) {
        this.projectStore.dispatch(selectModel({
          itemIndex: this.currentFitItemIndex,
          modelIndex: this.models.length - 1
        }));
      }
    }
  }

  addPeak(peakTypeName: string) {
    const peakType = this.peakTypes[peakTypeName];
    if (peakType === undefined) {
      throw new Error(`Peak type ${peakTypeName} not found`);
    }
    if (this.currentFitItemIndex === undefined) {
      throw new Error("Cannot add peak, no fit item is selected");
    }
    const peak = new peakType();
    const peak2 = new peakType();
    this.models.push(peak);
    this.addedModelSubject.next(peak);
    this.projectStore.dispatch(addModel({itemIndex: this.currentFitItemIndex, model: peak2}));
    this.projectStore.dispatch(selectModel({itemIndex: this.currentFitItemIndex, modelIndex: this.models.length - 1}));
    this.selectModel(this.models.length - 1);
  }

  removeModel(index?: number | undefined) {
    if (index === undefined) {
      index = this.currentModelIndex
      if (index === undefined) {
        return;
      }
    }
    if (this.currentFitItemIndex === undefined) {
      throw new Error("Cannot remove peak, no fit item is selected");
    }

    if (index < this.models.length && index >= 0) {
      this.models.splice(index, 1);
      this.removedModelSubject.next(index);
      this.updatePeakSelectionSubjects();

      this.projectStore.dispatch(removeModel({itemIndex: this.currentFitItemIndex, modelIndex: index}));
    } else {
      throw new Error(`Cannot remove peak at index ${index}, it does not exist`);
    }
  }

  updateModel(index: number, peak: ClickModel) {
    if (index < this.models.length && index >= 0) {
      this.models[index] = peak;
      this.updatedModelSubject.next({"index": index, "model": peak});
    } else {
      throw new Error(`Cannot update peak at index ${index}, it does not exist`);
    }
  }

  updateParameter(index: number, parameter: Parameter) {
    if (this.currentFitItemIndex === undefined) {
      throw new Error("Cannot update peak, no fit item is selected");
    }
    this.projectStore.dispatch(updateParameter({
      itemIndex: this.currentFitItemIndex,
      modelIndex: index,
      parameter: Object.assign({}, parameter) // Make a copy of the parameter
    }));
  }

  clearModels() {
    if (this.currentFitItemIndex === undefined) {
      throw new Error("Cannot update peak, no fit item is selected");
    }
    this.models = [];
    this.projectStore.dispatch(clearModels({itemIndex: this.currentFitItemIndex}));
  }

  private mousePositionSubscription: Subscription = new Subscription();
  private mouseClickSubscription: Subscription = new Subscription();

  clickDefineModel(index: number | undefined = this.currentModelIndex) {
    if (index === undefined) {
      return;
    }

    // Unsubscribe from any existing subscriptions
    this.mousePositionSubscription.unsubscribe()
    this.mouseClickSubscription.unsubscribe()
    // Reset the peak steps
    this.models[index].currentStep = 0;

    const mouseClickObservable =
      this.mousePositionService.patternClickPosition$.pipe(
        withLatestFrom(this.bkgService.bkgModel$),
        take(this.models[index].clickSteps)
      );

    this.mousePositionSubscription =
      this.mousePositionService.patternMousePosition$.pipe(
        withLatestFrom(this.bkgService.bkgModel$),
        takeWhile(() => this.models[index].currentStep < this.models[index].clickSteps)
      ).subscribe(([mousePosition, bkgModel]) => {
        const x = mousePosition.x;
        const y = mousePosition.y;
        const y_bkg = bkgModel ? bkgModel.evaluate([x])[0] : 0;

        this.models[index].defineModel(x, y - y_bkg);
        // update all parameter values in store
        this.models[index].parameters.forEach((parameter) => {
          this.updateParameter(index, parameter);
        });
        this.updatedModelSubject.next({"index": index, "model": this.models[index]});
      });

    this.mouseClickSubscription = mouseClickObservable.subscribe(([mousePosition, bkgModel]) => {
      const x = mousePosition.x;
      const y = mousePosition.y;
      const y_bkg = bkgModel ? bkgModel.evaluate([x])[0] : 0;

      this.models[index].defineModel(x, y - y_bkg);
      this.models[index].currentStep++;
      this.updatedModelSubject.next({"index": index, "model": this.models[index]});
    });
  }


  selectClosestModel(x: number, y: number) {
    let minDistance = Number.MAX_VALUE;
    let minIndex = 0;
    for (let i = 0; i < this.models.length; i++) {
      const distance = this.distanceToModel(x, y, i);
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }
    this.selectModel(minIndex);
  }

  private distanceToModel(x: number, y: number, index: number) {
    const y_val = this.models[index].evaluate([x])[0];
    return Math.abs(y - y_val);
  }

}
