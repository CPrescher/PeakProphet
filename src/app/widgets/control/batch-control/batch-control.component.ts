import {Component} from '@angular/core';
import {BatchFitService} from "../../../shared/batch-fit.service";

@Component({
    selector: 'app-batch-control',
    templateUrl: './batch-control.component.html',
    styleUrls: ['./batch-control.component.css'],
    standalone: false
})
export class BatchControlComponent {
  startIndex = 1;
  propagateModels = true;

  constructor(
    public batchFitService: BatchFitService,
  ) {
  }

  startIndexChange(ev: any) {
    this.startIndex = Math.floor(ev.target.value);
  }
}
