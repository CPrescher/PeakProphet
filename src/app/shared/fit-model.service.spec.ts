import { TestBed } from '@angular/core/testing';

import { FitModelService } from './fit-model.service';

describe('FitModelService', () => {
  let service: FitModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
