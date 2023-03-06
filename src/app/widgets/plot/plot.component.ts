import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import PatternPlot from "../../lib/plotting/pattern-plot";
import LineItem from "../../lib/plotting/items/lineItem";
import * as _ from 'lodash';
import {PatternService} from "../../shared/pattern.service";
import {PeakService} from "../../shared/peak.service";
import {Model} from "../../shared/models/model.interface";
import {Item} from "../../lib/plotting/items/item";
import {BkgService} from "../../shared/bkg.service";
import {MousePositionService} from "../../shared/mouse-position.service";

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit, AfterViewInit {

  @ViewChild('container') plotContainer!: ElementRef;


  throttleImageMouseMoved;

  plot!: PatternPlot;
  mainLine!: LineItem;
  bkgLine!: LineItem;
  sumLine!: LineItem;
  private peakGroup: Item;
  private modelSumGroup: Item;
  peakLines: LineItem[] = [];

  throttleResize;

  constructor(
    private patternService: PatternService,
    private peakService: PeakService,
    private bkgService: BkgService,
    private mouseService: MousePositionService) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this._initPlot();
    this._initResizeHandling();
    this._initMouseEvents();
    this._initLineGroups(); // group for all model lines, needs to be created before main line to be behind it
    this._initMainLine();
    this._initPeakLines();
    this._initBkgLine();
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

  _initMouseEvents(): void {
    this.throttleImageMouseMoved = _.throttle((x, y) => {
      this.mouseService.updatePatternMousePosition(x, y);
    }, 100);

    this.plot.mouseMoved.subscribe({
      next: ({x, y}) => {
        this.throttleImageMouseMoved(x, y);
      }
    });

    this.plot.mouseClicked.subscribe({
      next: ({x, y}) => {
        this.mouseService.updatePatternClickPosition(x, y)
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.throttleResize();
  }

  _initMainLine(): void {
    this.mainLine = new LineItem();
    this.mainLine.autoRanged = true;
    this.plot.addItem(this.mainLine);

    this.patternService.pattern$.subscribe((pattern) => {
      if (pattern) {
        this.mainLine.setData(pattern.x, pattern.y);
      }
    });
  }

  _initLineGroups(): void {
    this.peakGroup = new Item();
    this.plot.addItem(this.peakGroup);
    this.modelSumGroup = new Item();
    this.plot.addItem(this.modelSumGroup);

  }

  _initPeakLines(): void {
    this.peakService.addedPeak$.subscribe((peak: Model) => {
      this.addModelLine().setData(this.mainLine.x, peak.evaluate(this.mainLine.x));
      this.updateSumLine();
    });

    this.peakService.removedPeak$.subscribe((index) => {
      this.removeModelLine(index);
      this.updateSumLine();
    });

    this.peakService.updatedPeak$.subscribe((data: { "index": number, model: Model }) => {
      this.peakLines[data.index].setData(this.mainLine.x, data.model.evaluate(this.mainLine.x));
      this.updateSumLine();
    });

    this.peakService.peaks$.subscribe((peaks: Model[]) => {
      const peakNum = peaks.length;
      const modelLineNum = this.peakLines.length;

      for (let i = this.peakLines.length; i < peaks.length; i++) {
        this.addModelLine();
      }
      for (let i = peakNum; i < modelLineNum; i++) {
        this.removeModelLine(0);
      }

      for (let i = 0; i < peaks.length; i++) {
        this.peakLines[i].setData(this.mainLine.x, peaks[i].evaluate(this.mainLine.x));
      }
      this.updateSumLine();
    });
  }

  addModelLine(): LineItem {
    const line = new LineItem("green");
    this.plot.addItem(line, this.peakGroup.root);
    this.peakLines.push(line);
    return line;
  }

  removeModelLine(index: number): void {
    this.plot.removeItem(this.peakLines[index]);
    this.peakLines.splice(index, 1);
  }

  _initBkgLine(): void {
    this.bkgLine = new LineItem("orange");
    this.plot.addItem(this.bkgLine, this.peakGroup.root);

    this.bkgService.bkgModel$.subscribe((bkgModel: Model | undefined) => {
      if (!bkgModel) {
        this.bkgLine.setData([], []);
        return;
      }
      this.bkgLine.setData(this.mainLine.x, bkgModel.evaluate(this.mainLine.x));
    });
  }

  _initModelSumLine(): void {
    this.sumLine = new LineItem("red");
    this.plot.addItem(this.sumLine, this.modelSumGroup.root);

    this.bkgService.bkgModel$.subscribe(() => {
      this.updateSumLine();
    });
  }

  updateSumLine(): void {
    const sum = this.bkgLine.y.map((y, i) => {
      return y + this.peakLines.reduce((sum, peak) => sum + peak.y[i], 0);
    });
    this.sumLine.setData(this.mainLine.x, sum);
  }
}
