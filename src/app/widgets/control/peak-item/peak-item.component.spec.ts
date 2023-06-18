import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeakItemComponent} from './peak-item.component';
import {MaterialsModule} from "../../../shared/gui/materials.module";
import {ParameterItemSimpleComponent} from "../../inline/parameter-item-simple/parameter-item-simple.component";
import {ModelService} from "../../../shared/model.service";
import {HarnessLoader} from "@angular/cdk/testing";
import {MatButtonHarness} from "@angular/material/button/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {BrowseIndexComponent} from "../../inline/browse-index/browse-index.component";
import {NumberInputComponent} from "../../inline/number-input/number-input.component";
import {By} from "@angular/platform-browser";

describe('PeakItemComponent', () => {
  let modelService: ModelService;
  let component: PeakItemComponent;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<PeakItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsModule],
      declarations: [PeakItemComponent, ParameterItemSimpleComponent, BrowseIndexComponent, NumberInputComponent]
    })
      .compileComponents();

    modelService = TestBed.inject(ModelService);
    modelService.clearPeaks();
    modelService.addPeak("Gaussian");
    modelService.addPeak("Lorentzian");

    fixture = TestBed.createComponent(PeakItemComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    spyOn(modelService, "addPeak").and.callFake(() => {
    });
    spyOn(modelService, "removePeak").and.callFake(() => {
    });
  });

  it('remove button calls correct method in model service', async () => {
    const removeButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '[data-test="remove-button"]'}));
    await removeButton.click();
    expect(modelService.removeModel).toHaveBeenCalled();
  });

  it("shows correct peak index upon selection", async () => {
    modelService.selectModel(1);
    const peakIndexElement = fixture.debugElement.nativeElement.querySelector('[data-test="peak-index"]');
    expect(peakIndexElement.textContent).toEqual("2");
  });

  it("calls correct model method when decrement peak index", async () => {
    modelService.selectModel(1);
    const decreaseButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '[data-test="decrease-button"]'}));

    spyOn(modelService, "selectPeak").and.callFake(() => {
    });
    await decreaseButton.click();
    expect(modelService.selectModel).toHaveBeenCalledWith(0);
  });

  it("calls correct model method when browsing  peaks", async () => {
    modelService.selectModel(0);
    const increaseButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '[data-test="increase-button"]'}));

    spyOn(modelService, "selectPeak").and.callFake(() => {
    });
    await increaseButton.click();
    expect(modelService.selectModel).toHaveBeenCalledWith(1);
  });


  it("shows correct peak type", async () => {
    modelService.selectModel(1);
    fixture.detectChanges();
    const peakTypeElement = fixture.debugElement.nativeElement.querySelector('[data-test="peak-type"]');
    expect(peakTypeElement.innerHTML).toEqual("Lorentzian");
  });

  it("updates parameter value", () => {
    modelService.selectModel(0);
    fixture.detectChanges();
    let parameterComponents = fixture.debugElement.queryAll(By.directive(ParameterItemSimpleComponent))
    let centerParameterComponent: ParameterItemSimpleComponent = parameterComponents[0].componentInstance;
    let widthParameterComponent: ParameterItemSimpleComponent = parameterComponents[1].componentInstance;
    let amplitudeParameterComponent: ParameterItemSimpleComponent = parameterComponents[2].componentInstance;
    centerParameterComponent.valueChange(90)
    widthParameterComponent.valueChange(10)
    amplitudeParameterComponent.valueChange(100)
    expect(modelService.getPeaks()[0].parameters[0].value).toEqual(90);
    expect(modelService.getPeaks()[0].parameters[1].value).toEqual(10);
    expect(modelService.getPeaks()[0].parameters[2].value).toEqual(100);
  });
});
