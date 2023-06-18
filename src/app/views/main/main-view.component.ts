import { Component } from '@angular/core';
import {ShortcutService} from "../../shared/shortcut.service";
import {FitModelService} from "../../shared/fit-model.service";
import {map, Observable} from "rxjs";
import {ProjectState} from "../../project/store/project.state";
import {Store} from "@ngrx/store";
import {currentFitItemIndex} from "../../project/store/project.selectors";

@Component({
  selector: 'app-main',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {

  public hasData$: Observable<Boolean>;
  public version = '0.1.1';
  constructor(
    private _shortcutService: ShortcutService,
    private fitModelService: FitModelService,
    private projectStore: Store<ProjectState>
  ){
    this.hasData$ = this.projectStore.select(currentFitItemIndex).pipe(
      map(index => index !== undefined)
    )
  }

}
