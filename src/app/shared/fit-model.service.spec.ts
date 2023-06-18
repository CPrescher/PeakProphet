import {TestBed} from '@angular/core/testing';

import {FitModelService} from './fit-model.service';
import {Pattern} from "./data/pattern";

import {provideMockStore} from '@ngrx/store/testing';

describe('FitModelService', () => {
  let service: FitModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({})
      ]
    });
    service = TestBed.inject(FitModelService);
    service.fitModels = [];
    service.addFitModel("test", new Pattern("test", [1, 2], [3, 4]), []);
    service.addFitModel("test", new Pattern("test", [1, 2], [3, 4]), []);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
