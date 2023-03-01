import { TestBed } from '@angular/core/testing';

import { FitModelService } from './fit-model.service';
import {Pattern} from "./data/pattern";

describe('FitModelService', () => {
  let service: FitModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitModelService);
    service.fitModels = [];
    service.addFitModel("test", new Pattern("test", [1,2], [3,4]), []);
    service.addFitModel("test", new Pattern("test", [1,2], [3,4]), []);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should update selectedIndex$',  (done: DoneFn) => {
    service.selectFitModel(1);
    service.selectedIndex$.subscribe((index: number | undefined) => {
      expect(index).toEqual(1);
      done();
    });
  })

  it('should update fitModels',  () => {
    service.addFitModel("test", new Pattern("test", [1,2], [3,4]), []);
    expect(service.fitModels.length).toEqual(3);
  });

});
