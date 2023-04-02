import { Component } from '@angular/core';
import {ShortcutService} from "../../shared/shortcut.service";
import {FitModelService} from "../../shared/fit-model.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {

  public hasData$: Observable<Boolean>;
  public version = '0.1.0';
  constructor(
    private _shortcutService: ShortcutService,
    private fitModelService: FitModelService,
  ){
    this.hasData$ = this.fitModelService.selectedIndex$.pipe(
      map(index => index !== undefined)
    )
  }

}
