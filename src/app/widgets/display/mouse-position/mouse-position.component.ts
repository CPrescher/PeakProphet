import {Component} from '@angular/core';
import {MousePositionService} from "../../../shared/mouse-position.service";

@Component({
  selector: 'app-mouse-position',
  templateUrl: './mouse-position.component.html',
  styleUrls: ['./mouse-position.component.css']
})
export class MousePositionComponent {
  constructor(public mousePositionService: MousePositionService) {
  }
}
