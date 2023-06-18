import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClickModel} from "../../../shared/models/model.interface";
import {ModelService} from "../../../shared/model.service";
import {Observable, Subscription} from "rxjs";
import {Parameter} from "../../../shared/models/parameter.model";
import {ProjectState} from "../../../project/store/project.state";
import {Store} from "@ngrx/store";
import {currentFitItemIndex, currentModelIndex} from "../../../project/store/project.selectors";
import {removeModel} from "../../../project/store/project.actions";

@Component({
  selector: 'app-peak-item',
  templateUrl: './peak-item.component.html',
  styleUrls: ['./peak-item.component.css']
})
export class PeakItemComponent implements OnInit, OnDestroy {
  peak: ClickModel | undefined = undefined;

  selectedModelIndex: number | undefined = undefined;
  peakNum: number = 0;

  private selectedModelSubscription: Subscription = new Subscription();
  private selectedModelIndexSubscription: Subscription = new Subscription();

  private currentFitItemIndex: Observable<number | undefined>;
  private currentModelIndex: Observable<number | undefined>;


  constructor(
    private modelService: ModelService,
    public projectStore: Store<ProjectState>,) {
  }

  ngOnInit() {
    this.selectedModelSubscription = this.modelService.selectedModel$.subscribe((peak: ClickModel | undefined) => {
      this.peak = peak;
    });
    this.selectedModelIndexSubscription = this.modelService.selectedPeakIndex$.subscribe((index: number | undefined) => {
      this.selectedModelIndex = index;
      this.peakNum = this.modelService.getPeaks().length;
    });

    this.currentFitItemIndex = this.projectStore.select(currentFitItemIndex);
    this.currentFitItemIndex.subscribe((index: number | undefined) => {
      console.log("currentFitItemIndex", index);
    });

    this.currentModelIndex = this.projectStore.select(currentModelIndex);
    this.currentModelIndex.subscribe((index: number | undefined) => {
      console.log("currentModelIndex", index);
    });
  }

  removeModel() {
    if (this.selectedModelIndex !== undefined) {
      this.modelService.removeModel(this.selectedModelIndex);
    }
  }

  updateModel(parameter: Parameter) {
    if (this.peak !== undefined && this.selectedModelIndex !== undefined) {
      this.modelService.updateModel(this.selectedModelIndex, this.peak);
      this.modelService.updateParameter(this.selectedModelIndex, parameter);
    }
  }

  selectModel(index: number) {
    this.modelService.selectModel(index);
  }

  defineModel() {
    if(this.selectedModelIndex !== undefined) {
      this.modelService.clickDefineModel(this.selectedModelIndex);
    }
  }

  ngOnDestroy() {
    this.selectedModelSubscription.unsubscribe();
    this.selectedModelIndexSubscription.unsubscribe();
  }
}
