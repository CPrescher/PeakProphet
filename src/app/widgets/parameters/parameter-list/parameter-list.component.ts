import { Component } from '@angular/core';
import {Parameter} from "../../../shared/parameter.model";

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.css']
})
export class ParameterListComponent {
  parameters = [
    new Parameter("Position", 2.0),
    new Parameter("FWHM", 0.5),
    new Parameter("Intensity", 1.0),
  ]

}
