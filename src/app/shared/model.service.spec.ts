import {TestBed} from '@angular/core/testing';

import {ModelService} from './model.service';

describe('ModelService', () => {
  let service: ModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelService);
    service.clearModels();
    service.addPeak("Gaussian");
    service.addPeak("Lorentzian");
  });

  it('Should contain two peaks', () => {
    expect(service.getPeaks().length).toBe(2);
  });

  it('Should select the first peak', () => {
    service.selectModel(0);
    service.selectedPeakIndex$.subscribe(index => {
      expect(index).toBe(0);
    });
  });

  it('Should select the second peak', () => {
    service.selectModel(1);
    service.selectedPeakIndex$.subscribe(index => {
      expect(index).toBe(1);
    });
  });

  it('Should add a new peak', () => {
    service.addPeak("Gaussian");
    expect(service.getPeaks().length).toBe(3);
  });

  it('Should remove the first peak', () => {
    service.removeModel(0);
    expect(service.getPeaks().length).toBe(1);
    expect(service.getPeaks()[0].type).toBe("Lorentzian");
  });

  it('Should remove the second peak', () => {
    service.removeModel(1);
    expect(service.getPeaks().length).toBe(1);
    expect(service.getPeaks()[0].type).toBe("Gaussian");
  });

  it('Should throw an error when adding an invalid peak', () => {
    expect(() => service.addPeak("Invalid")).toThrowError("Peak type Invalid not found");
  });

  it('Should throw an error when removing an invalid peak', () => {
    expect(() => service.removeModel(2)).toThrowError(`Cannot remove peak at index 2, it does not exist`);
  });

  it('Should throw an error when selecting an invalid peak', () => {
    expect(() => service.selectModel(2)).toThrowError(`Cannot select peak at index 2, it does not exist`);
  });

  it('Should clear all peaks', () => {
    service.clearModels();
    expect(service.getPeaks().length).toBe(0);
  });

  it('Should select the first peak', (done: DoneFn) => {
    service.selectModel(0);
    service.selectedModel$.subscribe(peak => {
      if (peak === undefined) return;
      expect(peak.type).toBe("Gaussian");
      done();
    });
  });

  it('send undefined when clearing peaks', (done: DoneFn) => {
    service.clearModels();
    service.selectedModel$.subscribe(peak => {
      expect(peak).toBe(undefined);
      done();
    });
  });

  it('should send undefined when removing the last peak', (done: DoneFn) => {
    service.clearModels();
    service.addPeak("Gaussian");
    service.removeModel(0);
    service.selectedModel$.subscribe(peak => {
      expect(peak).toBe(undefined);
      done();
    });
  });

  it("should send addedPeak when adding a peak", (done: DoneFn) => {
    service.addedModel$.subscribe(peak => {
      expect(peak.type).toBe("Gaussian");
      done();
    });
    service.addPeak("Gaussian");
  });

  it("should send removedPeak when removing a peak", (done: DoneFn) => {
    service.removedPeak$.subscribe(index => {
      expect(index).toBe(1);
      done();
    });
    service.removeModel(1);
  });
});
