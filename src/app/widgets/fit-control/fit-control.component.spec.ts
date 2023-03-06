import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FitControlComponent} from './fit-control.component';
import {MaterialsModule} from "../../shared/gui/materials.module";
import {BrowseIndexComponent} from "../browse-index/browse-index.component";
import {FitModelService} from "../../shared/fit-model.service";

describe('PatternControlComponent', () => {
  let component: FitControlComponent;
  let fixture: ComponentFixture<FitControlComponent>;
  let fitModelService: FitModelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FitControlComponent, BrowseIndexComponent],
      imports: [MaterialsModule]
    })
      .compileComponents();

    fitModelService = TestBed.inject(FitModelService);

    fixture = TestBed.createComponent(FitControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should show the fit model name", () => {
    const div = fixture.debugElement.nativeElement.querySelector('[data-test="fit-model-name"]');
    expect(div.textContent).toBe(fitModelService.fitModels[component.selectedModelIndex].name);
  });
});
