import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OutputTableComponent} from './output-table.component';
import {MaterialsModule} from "../../../shared/gui/materials.module";
import {FitModelService} from "../../../shared/fit-model.service";
import {createRandomGaussian} from "../../../shared/data/peak-generation";
import {provideMockStore} from "@ngrx/store/testing";

describe('OutputTableComponent', () => {
  let component: OutputTableComponent;
  let fixture: ComponentFixture<OutputTableComponent>;
  let fitModelService: FitModelService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutputTableComponent],
      imports: [MaterialsModule],
      providers:[
        provideMockStore({})
      ]
    })
      .compileComponents();

    fitModelService = TestBed.inject(FitModelService);

    fitModelService.fitModels[0].peaks = [
      createRandomGaussian([0, 10], [0, 1], [5, 10]),
      createRandomGaussian([0, 10], [0, 1], [5, 10]),
      createRandomGaussian([0, 10], [0, 1], [5, 10])
    ]
    fitModelService.fitModels[1].peaks = [
      createRandomGaussian([0, 10], [0, 1], [5, 10]),
    ]
    fitModelService.fitModels[2].peaks = [
      createRandomGaussian([0, 10], [0, 1], [5, 10]),
      createRandomGaussian([0, 10], [0, 1], [5, 10]),
    ]

    fixture = TestBed.createComponent(OutputTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should convert fitmodels correctly into a table', () => {
    expect(component).toBeTruthy();
  });
});
