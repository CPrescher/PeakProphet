import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Parameter} from "../../../shared/models/parameter.model";

@Component({
  selector: 'app-parameter-item-simple',
  templateUrl: './parameter-item-simple.component.html',
  styleUrls: ['./parameter-item-simple.component.css']
})
export class ParameterItemSimpleComponent {
  @Input() parameter: Parameter;
  @Output() parameterChange = new EventEmitter<Parameter>();

  constructor() {
    this.parameter = new Parameter("Peak Position");
  }

  inputChange(ev: any) {
    this.parameter.value = ev.target.value;
    this.parameterChange.emit(this.parameter);
  }
}
