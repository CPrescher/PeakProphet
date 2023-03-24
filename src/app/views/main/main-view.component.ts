import { Component } from '@angular/core';
import {ShortcutService} from "../../shared/shortcut.service";

@Component({
  selector: 'app-main',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {
  constructor(
    private _shortcutService: ShortcutService,
  ){}

}
