import {TestBed} from '@angular/core/testing';

import {ModelService} from './model.service';

describe('ModelService', () => {
  let service: ModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelService);
    service.clearPeaks();
    service.addPeak("Gaussian");
    service.addPeak("Lorentzian");
  });

  it('Should contain two peaks', () => {
    expect(service.getPeaks().length).toBe(2);
  });

  it('Should select the first peak', () => {
    service.selectPeak(0);
    service.selectedPeakIndexSubject.subscribe(index => {
      expect(index).toBe(0);
    });
  });

  it('Should select the second peak', () => {
    service.selectPeak(1);
    service.selectedPeakIndexSubject.subscribe(index => {
      expect(index).toBe(1);
    });
  });

  it('Should add a new peak', () => {
    service.addPeak("Gaussian");
    expect(service.getPeaks().length).toBe(3);
  });

  it('Should remove the first peak', () => {
    service.removePeak(0);
    expect(service.getPeaks().length).toBe(1);
    expect(service.getPeaks()[0].name).toBe("Lorentzian");
  });

  it('Should remove the second peak', () => {
    service.removePeak(1);
    expect(service.getPeaks().length).toBe(1);
    expect(service.getPeaks()[0].name).toBe("Gaussian");
  });

  it('Should throw an error when adding an invalid peak', () => {
    expect(() => service.addPeak("Invalid")).toThrowError("Peak type Invalid not found");
  });

  it('Should throw an error when removing an invalid peak', () => {
    expect(() => service.removePeak(2)).toThrowError(`Cannot remove peak at index 2, it does not exist`);
  });

  it('Should throw an error when selecting an invalid peak', () => {
    expect(() => service.selectPeak(2)).toThrowError(`Cannot select peak at index 2, it does not exist`);
  });

  it('Should clear all peaks', () => {
    service.clearPeaks();
    expect(service.getPeaks().length).toBe(0);
  });

  it('Should select the first peak', (done: DoneFn) => {
    service.selectedPeakSubject.subscribe(peak => {
      expect(peak.name).toBe("Gaussian");
      done();
    });
    service.selectPeak(0);
  });
});
