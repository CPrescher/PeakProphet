import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotComponent } from './plot.component';
import {PeakService} from "../../shared/peak.service";
import {PatternService} from "../../shared/pattern.service";

describe('PlotComponent', () => {
  let component: PlotComponent;
  let fixture: ComponentFixture<PlotComponent>;
  let modelService: PeakService;
  let patternService: PatternService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotComponent ]
    })
    .compileComponents();

    modelService = TestBed.inject(PeakService);
    patternService = TestBed.inject(PatternService);
    patternService.addPattern("RandomData", [2,3 ,4], [2,3,4,5]);


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
    modelService.addPeak("Gaussian");
    expect(component.modelLines.length).toBe(1);
  });

  it("should remove a model Line item when Peak is removed", () => {
    modelService.addPeak("Gaussian");
    modelService.removePeak(0);
    expect(component.modelLines.length).toBe(0);
  });

  it("should assign x and y values to the model Line item", () => {
    modelService.addPeak("Gaussian");
    expect(component.modelLines[0].x).toBeTruthy();
    expect(component.modelLines[0].y).toBeTruthy();
  });
});
