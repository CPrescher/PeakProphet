import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import PatternPlot from "../../../lib/plotting/pattern-plot";
import LineItem from "../../../lib/plotting/items/lineItem";
import {PatternService} from "../../../shared/pattern.service";
import {PeakService} from "../../../shared/peak.service";
import {Model} from "../../../shared/models/model.interface";
import {Item} from "../../../lib/plotting/items/item";
import {BkgService} from "../../../shared/bkg.service";
import {MousePositionService} from "../../../shared/mouse-position.service";
import {fromEvent, throttleTime} from "rxjs";

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit, AfterViewInit {

  @ViewChild('container') plotContainer!: ElementRef;

  plot!: PatternPlot;
  mainLine!: LineItem;
  bkgLine!: LineItem;
  sumLine!: LineItem;

  private dataGroup: Item;
  private peakGroup: Item;
  private modelSumGroup: Item;
  peakLines: LineItem[] = [];

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
    this._initLineGroups(); // groups for arranging the z depth of the lines
    this._initMainLine();
    this._initBkgLine();
    this._initModelSumLine();
    this._initPeakLines();
  }

  private _initPlot(): void {
    this.plot = new PatternPlot(
      '#pattern-plot',
      500, 200,
    );
    this.plot.setXAxisLabel('X');
    this.plot.setYAxisLabel('Y');

  }

  private _initResizeHandling(): void {
    setTimeout(() => this._autoResize(), 50);

    fromEvent(window, 'resize').pipe(
      throttleTime(30)
    ).subscribe(() => {
      const width = this.plotContainer.nativeElement.clientWidth;
      const height = this.plotContainer.nativeElement.clientHeight;
      this.plot.resize(width, height);
    })
  }

  private _autoResize(): void {
    const width = this.plotContainer.nativeElement.clientWidth;
    const height = this.plotContainer.nativeElement.clientHeight;
    this.plot.resize(width, height);
  }

  _initMouseEvents(): void {

    this.plot.mouseMoved.pipe(
      throttleTime(30)
    ).subscribe(({x, y}) => {
      this.mouseService.updatePatternMousePosition(x, y);
    });

    this.plot.mouseClicked.subscribe({
      next: ({x, y}) => {
        this.mouseService.updatePatternClickPosition(x, y)
      }
    });
  }


  _initLineGroups(): void {
    this.peakGroup = new Item();
    this.plot.addItem(this.peakGroup);
    this.dataGroup = new Item();
    this.plot.addItem(this.dataGroup);
    this.modelSumGroup = new Item();
    this.plot.addItem(this.modelSumGroup);
  }


  _initMainLine(): void {
    this.mainLine = new LineItem();
    this.mainLine.autoRanged = true;
    this.plot.addItem(this.mainLine, this.dataGroup.root);

    this.patternService.pattern$.subscribe((pattern) => {
      if (pattern) {
        this.mainLine.setData(pattern.x, pattern.y);
      } else {
        this.mainLine.setData([], []);
      }
    });
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
      let y = data.model.evaluate(this.mainLine.x);
      if (this.bkgLine) {
        y = y.map((v, i) => v + this.bkgLine.y[i]);
      }
      this.peakLines[data.index].setData(this.mainLine.x, y);
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
        let y = peaks[i].evaluate(this.mainLine.x);
        if (this.bkgLine) {
          y = y.map((v, i) => v + this.bkgLine.y[i]);
        }
        this.peakLines[i].setData(this.mainLine.x, y);
      }
    });

    this.peakService.selectedPeakIndex$.subscribe((index: number | undefined) => {
      if (index === undefined) {
        this.peakLines.forEach((line) => {
          line.setColor("green");
          line.setStrokeWidth(2);
        });
        return;
      }
      this.peakLines.forEach((line, i) => {
        if (i === index) {
          line.setColor("orange");
          line.setStrokeWidth(2.5);
        } else {
          line.setColor("green");
          line.setStrokeWidth(2);
        }
      });
    });
  }

  addModelLine(): LineItem {
    const line = new LineItem("green", 2, true);
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
    this.sumLine = new LineItem("red", 2, false);
    this.plot.addItem(this.sumLine, this.modelSumGroup.root);

    this.bkgService.bkgModel$.subscribe(() => {
      this.updateSumLine();
    });
  }

  updateSumLine(): void {
    const nPeakLines = this.peakLines.length;
    const sum = this.bkgLine.y.map((y, i) => {
      return y * (1 - nPeakLines) + this.peakLines.reduce((sum, peak) => sum + peak.y[i], 0);
    });
    this.sumLine.setData(this.mainLine.x, sum);
  }
}
