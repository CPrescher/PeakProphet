import {Component, OnDestroy} from '@angular/core';
import {FitModelService} from "../../../shared/fit-model.service";
import {MatSelectionListChange} from "@angular/material/list";
import {firstValueFrom, lastValueFrom, Observable, Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {ProjectState} from "../../../project/store/project.state";
import {currentFitItemIndex, fitItems} from "../../../project/store/project.selectors";

@Component({
  selector: 'app-data-control',
  templateUrl: './data-control.component.html',
  styleUrls: ['./data-control.component.css']
})
export class DataControlComponent implements OnDestroy {

  public modelNum = 0;
  public selectedModelIndex = 0;

  public disabledBrowser = false;

  public selectedFitModelName: string = '';

  public fitModelNames: string[] = [];

  private _fitModelSubscription = new Subscription();
  private _selectedIndexSubscription = new Subscription();

  constructor(
    private fitModelService: FitModelService,
    private projectStore: Store<ProjectState>
  ) {
    this._selectedIndexSubscription = projectStore.select(currentFitItemIndex).subscribe((index: number | undefined) => {
      if (index !== undefined) {
        this.selectedModelIndex = index;
        this.modelNum = this.fitModelService.fitModels.length;
        this.selectedFitModelName = this.fitModelService.fitModels[index].name;
        this.disabledBrowser = false;
      } else {
        this.selectedFitModelName = '';
        this.disabledBrowser = true;
      }
    });

    this._fitModelSubscription = projectStore.select(fitItems).subscribe((fitItems) => {
      this.fitModelNames = [];
      for (const key in fitItems) {
        this.fitModelNames.push(fitItems[key].name);
      }
    });
  }

  ngOnDestroy(): void {
    this._fitModelSubscription.unsubscribe();
    this._selectedIndexSubscription.unsubscribe();
  }

  selectModel(index: number) {
    this.fitModelService.selectFitModel(index);
  }

  async onFileSelected(event: any) {
    const files = event.target.files;
    console.log(files)
    let readingFinished$: Observable<void> | undefined = undefined;
    for (let i = 0; i < files.length; i++) {
      await firstValueFrom(this.fitModelService.readData(files[i], i > 0));
    }
    this.modelNum = this.fitModelService.fitModels.length;
  }

  moveModelUp() {
    this.fitModelService.moveFitModelUp(this.selectedModelIndex);
  }

  moveModelDown() {
    this.fitModelService.moveFitModelDown(this.selectedModelIndex);
  }

  removeModel() {
    this.fitModelService.removeFitModel(this.selectedModelIndex);
  }

  clearModels() {
    this.fitModelService.clearFitModels();
  }

  onListSelectionChanged(event: MatSelectionListChange) {
    const selectedName = event.source.selectedOptions.selected[0].value;
    const index = this.fitModelNames.indexOf(selectedName);
    this.fitModelService.selectFitModel(index);
  }
}
