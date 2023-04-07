import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent {
  @Input() label: string;
  @Input() value: number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  inputChange(ev: any) {
    this.value = Number(ev.target.value);
    this.valueChange.emit(this.value);
  }

}
