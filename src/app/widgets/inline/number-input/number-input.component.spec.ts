import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberInputComponent} from './number-input.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {NumbersOnlyDirective} from "../../../shared/directives/numbers-only.directive";

describe('NumberInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberInputComponent, NumbersOnlyDirective],
      imports: [MatFormFieldModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    component.label = "Test label";
    component.value = 23;
    fixture.detectChanges();
  });

  it('should show correct label', () => {
    const labelElement: HTMLElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toEqual("Test label");
  });

  it('should show correct value', () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.value).toEqual("23");
  });

  it('should emit correct value',  () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#input');
    inputElement.value = "53";

    spyOn(component.valueChange, 'emit');
    inputElement.dispatchEvent(new Event('change'));

    expect(component.value).toEqual(53);
    expect(component.valueChange.emit).toHaveBeenCalledWith(53);
  });
});
