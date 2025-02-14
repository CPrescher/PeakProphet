import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Parameter} from "../../../shared/models/parameter.model";

@Component({
    selector: 'app-parameter-item-simple',
    templateUrl: './parameter-item-simple.component.html',
    styleUrls: ['./parameter-item-simple.component.scss'],
    standalone: false
})
export class ParameterItemSimpleComponent {
  @Input() parameter: Parameter;
  @Output() parameterChange = new EventEmitter<Parameter>();

  constructor() {
    this.parameter = new Parameter("Peak Position");
  }

  valueChange(newValue: any) {
    this.parameter.value = Number(newValue);
    this.parameterChange.emit(this.parameter);
  }
}
