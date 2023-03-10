import { TestBed } from '@angular/core/testing';

import { FitService } from './fit.service';

describe('FitService', () => {
  let service: FitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
