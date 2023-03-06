import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DataControlComponent} from './data-control.component';
import {MaterialsModule} from "../../shared/gui/materials.module";
import {BrowseIndexComponent} from "../browse-index/browse-index.component";
import {FitModelService} from "../../shared/fit-model.service";

describe('PatternControlComponent', () => {
  let component: DataControlComponent;
  let fixture: ComponentFixture<DataControlComponent>;
  let fitModelService: FitModelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataControlComponent, BrowseIndexComponent],
      imports: [MaterialsModule]
    })
      .compileComponents();

    fitModelService = TestBed.inject(FitModelService);

    fixture = TestBed.createComponent(DataControlComponent);
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
