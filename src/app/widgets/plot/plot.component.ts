import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import PatternPlot from "../../lib/plotting/pattern-plot";
import LineItem from "../../lib/plotting/items/lineItem";
import * as _ from 'lodash';
import {PatternService} from "../../shared/pattern.service";
import {PeakService} from "../../shared/peak.service";
import {Model} from "../../shared/peak-types/model.interface";

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit, AfterViewInit {

  @ViewChild('container') plotContainer!: ElementRef;


  plot!: PatternPlot;
  mainLine!: LineItem;
  modelLines: LineItem[] = [];

  throttleResize;

  constructor(
    private patternService: PatternService,
    private modelService: PeakService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this._initPlot();
    this._initResizeHandling();

    this._initMainLine();
    this._initModelLines();
  }

  _initPlot(): void {
    this.plot = new PatternPlot(
      '#pattern-plot',
      500, 200,
    );
    this.plot.setXAxisLabel('X');
    this.plot.setYAxisLabel('Y');

    this.mainLine = new LineItem();
    this.mainLine.autoRanged = true;
    this.plot.addItem(this.mainLine);
  }

  _initResizeHandling(): void {
    this.throttleResize = _.throttle(() => {
      const width = this.plotContainer.nativeElement.clientWidth;
      const height = this.plotContainer.nativeElement.clientHeight;
      this.plot.resize(width, height);
    }, 50);

    setTimeout(() => this.throttleResize(), 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.throttleResize();
  }

  _initMainLine(): void {
    this.patternService.selected$.subscribe((pattern) => {
      if (pattern) {
        this.mainLine.setData(pattern.x, pattern.y);
      }
    });
  }

  _initModelLines(): void {
    this.modelService.addedPeak$.subscribe((peak: Model) => {
      const line = new LineItem("green");
      this.plot.addItem(line);
      this.modelLines.push(line);
      line.setData(this.mainLine.x, peak.evaluate(this.mainLine.x));
    });

    this.modelService.removedPeak$.subscribe((index) => {
      const line = this.modelLines[index];
      this.plot.removeItem(line);
      this.modelLines.splice(index, 1);
    });
  }
}
