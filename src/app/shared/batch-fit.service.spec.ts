import {TestBed} from '@angular/core/testing';

import {BatchFitService} from './batch-fit.service';
import {provideMockStore} from '@ngrx/store/testing';

describe('BatchFitService', () => {
  let service: BatchFitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({})
      ]
    });
    service = TestBed.inject(BatchFitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
