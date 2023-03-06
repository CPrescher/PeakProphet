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

  it("select Bkg Type emits a bkgTypeChanged", (done: DoneFn) => {
    service.selectBkgType("quadratic");
    service.bkgTypeChanged$.subscribe((bkgModel) => {
      expect(bkgModel).toBeTruthy();
      done();
    });
  });

  it("sel Bkg Model emits the correct model", (done: DoneFn) => {
    const bkgModel = new QuadraticModel();
    service.setBkgModel(bkgModel);
    service.bkgModel$.subscribe((bkgModel) => {
      expect(bkgModel).toBe(bkgModel);
      done();
    });
  });
});
