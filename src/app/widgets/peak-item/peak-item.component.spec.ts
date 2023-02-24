import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeakItemComponent} from './peak-item.component';
import {MaterialsModule} from "../../shared/gui/materials.module";
import {ParameterItemSimpleComponent} from "../parameters/parameter-item-simple/parameter-item-simple.component";
import {ModelService} from "../../shared/model.service";
import {HarnessLoader} from "@angular/cdk/testing";
import {MatButtonHarness} from "@angular/material/button/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";

describe('PeakItemComponent', () => {
  let modelService: ModelService;
  let component: PeakItemComponent;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<PeakItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsModule],
      declarations: [PeakItemComponent, ParameterItemSimpleComponent]
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
    expect(modelService.removePeak).toHaveBeenCalled();
  });

  it("shows correct peak index upon selection", async () => {
    modelService.selectPeak(1);
    const peakIndexElement = fixture.debugElement.nativeElement.querySelector('[data-test="peak-index"]');
    expect(peakIndexElement.textContent).toEqual("2");
  });

  it("calls correct model method when browsing  peaks", async () => {
    modelService.selectPeak(1);
    const decreaseButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '[data-test="decrease-button"]'}));
    const increaseButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '[data-test="increase-button"]'}));


    spyOn(modelService, "selectPeak").and.callFake(() => {
    });
    await decreaseButton.click();
    await increaseButton.click();
    expect(modelService.selectPeak).toHaveBeenCalledWith(0);
    expect(modelService.selectPeak).toHaveBeenCalledWith(2);
  });

  it("shows correct peak type", async () => {
    modelService.selectPeak(1);
    fixture.detectChanges();
    const peakTypeElement = fixture.debugElement.nativeElement.querySelector('[data-test="peak-type"]');
    expect(peakTypeElement.innerHTML).toEqual("Lorentzian");
  });
});
