import {Component} from '@angular/core';
import {MousePositionService} from "../../../shared/mouse-position.service";

@Component({
    selector: 'app-mouse-position',
    templateUrl: './mouse-position.component.html',
    styleUrls: ['./mouse-position.component.css'],
    standalone: false
})
export class MousePositionComponent {
  constructor(public mousePositionService: MousePositionService) {
  }
}
