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
    patternService.setPattern(new Pattern("RandomData", [2, 3, 4], [2, 3, 4, 5]));

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

  it("should create a model Line item when Peak is added", () => {
    const peakNum = peakService.peaks.length;
    peakService.addPeak("Gaussian");
    expect(component.peakLines.length).toBe(peakNum + 1);
  });

  it("should remove a model Line item when Peak is removed", () => {
    const peakNum = peakService.peaks.length;
    peakService.removePeak(0);
    expect(component.peakLines.length).toBe(peakNum - 1);
  });

  it("should assign x and y values to the model Line item", () => {
    peakService.addPeak("Gaussian");
    expect(component.peakLines[0].x).toBeTruthy();
    expect(component.peakLines[0].y).toBeTruthy();
  });

  it("should create a bkg Line item when Bkg is added", () => {
    bkgService.selectBkgType("quadratic");
    expect(component.bkgLine).toBeTruthy();
  });

  it("should assign x and y values to the bkg Line item", () => {
    bkgService.selectBkgType("quadratic");
    expect(component.bkgLine.x).toBeTruthy();
    expect(component.bkgLine.y).toBeTruthy();
  });

  it("handles clearing the pattern", () => {
    patternService.clearPattern();
    expect(component.mainLine.x).toEqual([]);
    expect(component.mainLine.y).toEqual([]);
  });

  it("handles clearing the background pattern", () => {
    bkgService.clearBkgModel();
    expect(component.bkgLine.x).toEqual([]);
    expect(component.bkgLine.y).toEqual([]);
  });

  it("loading data after clearing the pattern", () => {
    patternService.clearPattern();
    patternService.setPattern(new Pattern("RandomData", [2, 3, 4], [2, 3, 4, 5]));
    expect(component.mainLine.x).toEqual([2, 3, 4]);
    expect(component.mainLine.y).toEqual([2, 3, 4, 5])
  });
});
