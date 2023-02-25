import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ModelService} from "../../shared/model.service";

import {PeakControlComponent} from './peak-control.component';
import {MaterialsModule} from "../../shared/gui/materials.module";
import {HarnessLoader} from "@angular/cdk/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {GaussianModel} from "../../shared/peak-types/gaussian.model";
import {LorentzianModel} from "../../shared/peak-types/lorentzian.model";
import {PseudoVoigtModel} from "../../shared/peak-types/pseudo-voigt.model";
import {MatSelectHarness} from "@angular/material/select/testing";
import {MatFormFieldHarness} from "@angular/material/form-field/testing";
import {MatButtonHarness} from "@angular/material/button/testing";

describe('PeakControlComponent', () => {
  let component: PeakControlComponent;
  let fixture: ComponentFixture<PeakControlComponent>;
  let loader: HarnessLoader;
  let modelService: ModelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsModule],
      declarations: [PeakControlComponent]
    })
      .compileComponents();

    modelService = TestBed.inject(ModelService);

    modelService.peakTypes = {
      "DummyBear": GaussianModel,
      "Gaussian": GaussianModel,
      "Lorentzian": LorentzianModel,
      "Pseudo-Voigt": PseudoVoigtModel,
    }

    fixture = TestBed.createComponent(PeakControlComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    spyOn(modelService, "addPeak").and.callFake(() => {});

  });

  it('should show correct peak type label', async () => {
    const peakTypeSelect = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness);
    expect(await peakTypeSelect.getLabel()).toEqual("Peak Type");
  });

  it('should show the correct peak types', async () => {
    const peakTypeSelect = await loader.getHarness<MatSelectHarness>(MatSelectHarness);
    await peakTypeSelect.open();
    const options = await peakTypeSelect.getOptions();
    expect(options.length).toEqual(4);
    expect(await options[0].getText()).toEqual("DummyBear");
    expect(await options[1].getText()).toEqual("Gaussian");
    expect(await options[2].getText()).toEqual("Lorentzian");
    expect(await options[3].getText()).toEqual("Pseudo-Voigt");
  });

  it('calls service add Peak function upon clicking add peak button', async () => {
    const addPeakButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness);
    await addPeakButton.click();
    expect(modelService.addPeak).toHaveBeenCalled();
  });
});
