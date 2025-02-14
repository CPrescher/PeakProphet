import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: 'input[numbersOnly]',
    standalone: false
})
export class NumbersOnlyDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    const regex = /[+-]?(\d+([.]\d*)?([eE]?[+-]?\d+)?|[.]\d+([eE][+-]?\d+)?)/g;
    const matches = initialValue.match(regex);
    this.el.nativeElement.value = matches ? matches[0] : '';
    if ( initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
