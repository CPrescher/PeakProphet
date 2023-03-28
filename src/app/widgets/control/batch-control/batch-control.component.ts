import { Component } from '@angular/core';
import {BatchFitService} from "../../../shared/batch-fit.service";

@Component({
  selector: 'app-batch-control',
  templateUrl: './batch-control.component.html',
  styleUrls: ['./batch-control.component.css']
})
export class BatchControlComponent {

  constructor(
    public batchFitService: BatchFitService,
  ) { }

}
