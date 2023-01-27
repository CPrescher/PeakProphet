import {Component, Input} from '@angular/core';
import {Parameter} from "../../shared/parameter.model";

@Component({
  selector: 'app-parameter-item-simple',
  templateUrl: './parameter-item-simple.component.html',
  styleUrls: ['./parameter-item-simple.component.css']
})
export class ParameterItemSimpleComponent {
  @Input() parameter: Parameter;

  constructor() {
    this.parameter = new Parameter("Peak Position");
  }

  log(ev: any) {
    console.log(ev);
  }
}
