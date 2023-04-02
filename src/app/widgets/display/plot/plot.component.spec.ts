import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlotComponent} from './plot.component';
import {PeakService} from "../../../shared/peak.service";
import {PatternService} from "../../../shared/pattern.service";
import {BkgService} from "../../../shared/bkg.service";
import {Pattern} from "../../../shared/data/pattern";

describe('PlotComponent', () => {
  let component: PlotComponent;
  let fixture: ComponentFixture<PlotComponent>;
  let peakService: PeakService;
  let patternService: PatternService;
  let bkgService: BkgService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlotComponent]
    })
      .compileComponents();

    peakService = TestBed.inject(PeakService);
    patternService = TestBed.inject(PatternService);
    patternService.setPattern(new Pattern("RandomData", [2, 3, 4, 2, 1], [2, 3, 4, 5, 1]));

    bkgService = TestBed.inject(BkgService);


    fixture = TestBed.createComponent(PlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a plot', () => {
    expect(component.plot).toBeTruthy();
  });

  it("should create a model Line item when Peak is added", (done) => {
    const peakNum = peakService.peaks.length;
    peakService.addPeak("Gaussian");

    setTimeout(() => {
      expect(component.peakLines.length).toBe(peakNum + 1);
      done();
    }, 200);
  });

  it("should remove a model Line item when Peak is removed", (done) => {
    peakService.addPeak("Gaussian");

    setTimeout(() => {
      expect(component.peakLines.length).toBe(1);
      peakService.removePeak(0);
      setTimeout(() => {
        expect(component.peakLines.length).toBe(0);
        done();
      }, 200)
    }, 200);

  });

  it("should assign x and y values to the model Line item", (done) => {
    peakService.addPeak("Gaussian");
    setTimeout(() => {
      expect(component.peakLines[0].x).toBeTruthy();
      expect(component.peakLines[0].y).toBeTruthy();
      done();
    }, 200);
  });

  it("should create a bkg Line item when Bkg is added", (done) => {
    bkgService.selectBkgType("quadratic");
    setTimeout(() => {
      expect(component.bkgLine).toBeTruthy();
      done();
    }, 200);
  });

  it("should assign x and y values to the bkg Line item", (done) => {
    bkgService.selectBkgType("quadratic");

    setTimeout(() => {
      expect(component.bkgLine.x).toBeTruthy();
      expect(component.bkgLine.y).toBeTruthy();
      done();
    }, 200);
  });

  it("handles clearing the pattern", (done) => {
    patternService.clearPattern();
    setTimeout(() => {
      expect(component.mainLine.x).toEqual([]);
      expect(component.mainLine.y).toEqual([]);
      done();
    }, 200);
  });

  it("handles clearing the background pattern", (done) => {
    bkgService.clearBkgModel();
    // This is a hack to wait for the throttleTime to finish
    setTimeout(() => {
      expect(component.bkgLine.x).toEqual([]);
      expect(component.bkgLine.y).toEqual([]);
      done();
    }, 200)
  });

  it("loading data after clearing the pattern", (done) => {
    patternService.clearPattern();
    patternService.setPattern(new Pattern("RandomData", [2, 3, 4], [2, 3, 4, 5]));

    // This is a hack to wait for the throttleTime to finish
    setTimeout(() => {
      expect(component.mainLine.x).toEqual([2, 3, 4]);
      expect(component.mainLine.y).toEqual([2, 3, 4, 5]);
      done();
    }, 200)
  });
});
