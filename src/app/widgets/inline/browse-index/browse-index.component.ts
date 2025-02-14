import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-browse-index',
    templateUrl: './browse-index.component.html',
    styleUrls: ['./browse-index.component.css'],
    standalone: false
})
export class BrowseIndexComponent {
  @Input() index: number;
  @Input() max: number = Infinity;
  @Input() min: number = -Infinity;
  @Input() add: number = 0;
  @Output() indexChange = new EventEmitter<number>();

  decreaseIndex(): void {
    if (this.index > this.min) {
      this.index--;
      this.indexChange.emit(this.index);
    }
  }

  increaseIndex(): void {
    if (this.index < this.max) {
      this.index++;
      this.indexChange.emit(this.index);
    }
  }
}
