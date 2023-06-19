import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClickModel} from "../../../shared/models/model.interface";
import {ModelService} from "../../../shared/model.service";
import {Observable, Subscription} from "rxjs";
import {Parameter} from "../../../shared/models/parameter.model";
import {Model, ProjectState} from "../../../project/store/project.state";
import {Store} from "@ngrx/store";
import {
  currentFitItemIndex,
  currentModel,
  currentModelIndex,
  modelCount
} from "../../../project/store/project.selectors";
import {removeModel} from "../../../project/store/project.actions";
import {convertModel} from "../../../shared/models/peaks";

@Component({
  selector: 'app-peak-item',
  templateUrl: './peak-item.component.html',
  styleUrls: ['./peak-item.component.css']
})
export class PeakItemComponent implements OnInit, OnDestroy {
  model: ClickModel | undefined = undefined;

  selectedModelIndex: number | undefined = undefined;
  peakNum: number = 0;

  private selectedModelSubscription: Subscription = new Subscription();
  private selectedModelIndexSubscription: Subscription = new Subscription();
  private peakNumSubscription: Subscription = new Subscription();

  private currentFitItemIndex: Observable<number | undefined>;
  private currentModelIndex: Observable<number | undefined>;


  constructor(
    private modelService: ModelService,
    public projectStore: Store<ProjectState>,) {
  }

  ngOnInit() {
    this.selectedModelSubscription = this.projectStore.select(currentModel).subscribe(
      (model: ClickModel | undefined) => {
        this.model = model
      });
    this.selectedModelIndexSubscription = this.projectStore.select(currentModelIndex).subscribe(
      (index: number | undefined) => {
        this.selectedModelIndex = index;
      });

    this.currentModelIndex = this.projectStore.select(currentModelIndex);

    this.peakNumSubscription = this.projectStore.select(modelCount).subscribe(
      (count: number) => {
        this.peakNum = count;
      }
    );

    this.currentFitItemIndex = this.projectStore.select(currentFitItemIndex);
    this.currentFitItemIndex.subscribe((index: number | undefined) => {
      console.log("currentFitItemIndex", index);
    });
  }

  removeModel() {
    if (this.selectedModelIndex !== undefined) {
      this.modelService.removeModel(this.selectedModelIndex);
    }
  }

  updateModel(parameter: Parameter) {
    if (this.model !== undefined && this.selectedModelIndex !== undefined) {
      this.modelService.updateModel(this.selectedModelIndex, this.model);
      this.modelService.updateParameter(this.selectedModelIndex, parameter);
    }
  }

  selectModel(index: number) {
    this.modelService.selectModel(index);
  }

  defineModel() {
    if (this.selectedModelIndex !== undefined) {
      this.modelService.clickDefineModel(this.selectedModelIndex);
    }
  }

  ngOnDestroy() {
    this.selectedModelSubscription.unsubscribe();
    this.selectedModelIndexSubscription.unsubscribe();
  }
}
