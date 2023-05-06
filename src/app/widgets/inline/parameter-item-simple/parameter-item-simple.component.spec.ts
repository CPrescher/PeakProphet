import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterItemSimpleComponent} from './parameter-item-simple.component';
import {MaterialsModule} from "../../../shared/gui/materials.module";
import {Parameter} from "../../../shared/models/parameter.model";
import {NumberInputComponent} from "../number-input/number-input.component";
import {By} from "@angular/platform-browser";

describe('ParameterItemSimpleComponent', () => {
  let component: ParameterItemSimpleComponent;
  let fixture: ComponentFixture<ParameterItemSimpleComponent>;
  let parameterInput: NumberInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsModule],
      declarations: [ParameterItemSimpleComponent, NumberInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ParameterItemSimpleComponent);
    component = fixture.componentInstance;
    parameterInput = fixture.debugElement.query(By.directive(NumberInputComponent)).context;
    fixture.detectChanges();
  });

  it('Shows the correct parameter name', async () => {
    component.parameter = new Parameter("Pixel value", 23);
    parameterInput.label = "Pixel value:";
  });

  it("Emits the correct parameter value", async () => {
    component.parameter = new Parameter("Pixel value", 23);
    parameterInput.valueChange.emit(53)
    expect(Number(component.parameter.value)).toEqual(53);
  })
});
