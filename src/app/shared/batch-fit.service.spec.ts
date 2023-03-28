import { TestBed } from '@angular/core/testing';

import { BatchFitService } from './batch-fit.service';

describe('BatchFitService', () => {
  let service: BatchFitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchFitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
