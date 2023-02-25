import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterItemSimpleComponent} from './parameter-item-simple.component';
import {MaterialsModule} from "../../../shared/gui/materials.module";
import {Parameter} from "../../../shared/peak-types/parameter.model";
import {HarnessLoader} from "@angular/cdk/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {MatInputHarness} from "@angular/material/input/testing";
import {MatFormFieldHarness} from "@angular/material/form-field/testing";

describe('ParameterItemSimpleComponent', () => {
  let component: ParameterItemSimpleComponent;
  let fixture: ComponentFixture<ParameterItemSimpleComponent>;

  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsModule],
      declarations: [ParameterItemSimpleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ParameterItemSimpleComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('Shows the correct parameter name', async () => {
    component.parameter = new Parameter("Pixel value", 23);

    const parameterFormField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness);
    expect(await parameterFormField.getLabel()).toEqual("Pixel value:");
  });

  it("Emits the correct parameter value", async () => {
    component.parameter = new Parameter("Pixel value", 23);

    const parameterInput = await loader.getHarness<MatInputHarness>(MatInputHarness);
    await parameterInput.setValue("53");

    const host = await parameterInput.host();
    await host.dispatchEvent("change");

    expect(Number(component.parameter.value)).toEqual(53);
  })
});
