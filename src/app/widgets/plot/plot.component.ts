import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import PatternPlot from "../../lib/plotting/pattern-plot";
import LineItem from "../../lib/plotting/items/lineItem";
import * as _ from 'lodash';
import {PatternService} from "../../shared/pattern.service";
import {PeakService} from "../../shared/peak.service";
import {Model} from "../../shared/peak-types/model.interface";
import {Item} from "../../lib/plotting/items/item";

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit, AfterViewInit {

  @ViewChild('container') plotContainer!: ElementRef;


  plot!: PatternPlot;
  mainLine!: LineItem;
  modelGroup: Item;
  modelLines: LineItem[] = [];

  throttleResize;

  constructor(
    private patternService: PatternService,
    private peakService: PeakService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this._initPlot();
    this._initResizeHandling();
    this._initModelGroup(); // group for all model lines, needs to be created before main line to be behind it
    this._initMainLine();
    this._initModelLines();
    this._initModelSumLine();
  }

  _initPlot(): void {
    this.plot = new PatternPlot(
      '#pattern-plot',
      500, 200,
    );
    this.plot.setXAxisLabel('X');
    this.plot.setYAxisLabel('Y');

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
    this.mainLine = new LineItem();
    this.mainLine.autoRanged = true;
    this.plot.addItem(this.mainLine);

    this.patternService.selected$.subscribe((pattern) => {
      if (pattern) {
        this.mainLine.setData(pattern.x, pattern.y);
      }
    });
  }

  _initModelGroup(): void {
    this.modelGroup = new Item();
    this.plot.addItem(this.modelGroup);
  }

  _initModelLines(): void {
    this.peakService.addedPeak$.subscribe((peak: Model) => {
      this.addModelLine().setData(this.mainLine.x, peak.evaluate(this.mainLine.x));
    });

    this.peakService.removedPeak$.subscribe((index) => {
      this.removeModelLine(index);
    });

    this.peakService.peaks$.subscribe((peaks: Model[]) => {
      const peakNum = peaks.length;
      const modelLineNum = this.modelLines.length;

      for (let i = this.modelLines.length; i < peaks.length; i++) {
        this.addModelLine();
      }
      for (let i = peakNum; i < modelLineNum; i++) {
        this.removeModelLine(0);
      }

      for (let i = 0; i < peaks.length; i++) {
        this.modelLines[i].setData(this.mainLine.x, peaks[i].evaluate(this.mainLine.x));
      }
    });
  }

  addModelLine(): LineItem {
    const line = new LineItem("green");
    this.plot.addItem(line, this.modelGroup.root);
    this.modelLines.push(line);
    return line;
  }

  removeModelLine(index: number): void {
    this.plot.removeItem(this.modelLines[index]);
    this.modelLines.splice(index, 1);
  }

  _initModelSumLine(): void {
    const sumLine = new LineItem("red");
    this.plot.addItem(sumLine, this.modelGroup.root);

    this.peakService.peaks$.subscribe((peaks: Model[]) => {
      const sum = this.mainLine.y.map((y, i) => {
        return y + peaks.reduce((sum, peak) => sum + peak.evaluate(this.mainLine.x)[i], 0);
      });
      sumLine.setData(this.mainLine.x, sum);
    });
  }
}
