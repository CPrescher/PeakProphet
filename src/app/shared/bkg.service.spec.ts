import { TestBed } from '@angular/core/testing';

import { BkgService } from './bkg.service';
import {QuadraticModel} from "./models/bkg/quadratic.model";

describe('BkgService', () => {
  let service: BkgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BkgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("select Bkg Type emits a new bkg model", (done: DoneFn) => {
    service.selectBkgType("quadratic");
    service.bkgModel$.subscribe((bkgModel) => {
      expect(bkgModel).toBeTruthy();
      done();
    });
  });

  it("sel Bkg Model emits the correct model", (done: DoneFn) => {
    const bkgModel = new QuadraticModel();
    service.selectBkgModel(bkgModel);
    service.bkgModel$.subscribe((bkgModel) => {
      expect(bkgModel).toBe(bkgModel);
      done();
    });
  });
});
