import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import PatternPlot from "../../../lib/plotting/pattern-plot";
import LineItem from "../../../lib/plotting/items/lineItem";
import {PatternService} from "../../../shared/pattern.service";
import {PeakService} from "../../../shared/peak.service";
import {ClickModel, Model} from "../../../shared/models/model.interface";
import {Item} from "../../../lib/plotting/items/item";
import {BkgService} from "../../../shared/bkg.service";
import {MousePositionService} from "../../../shared/mouse-position.service";
import {
  fromEvent,
  Subscription,
  auditTime,
  combineLatest,
  throttleTime,
  debounceTime,
  distinctUntilChanged
} from "rxjs";

@Component({
    selector: 'app-plot',
    templateUrl: './plot.component.html',
    styleUrls: ['./plot.component.css'],
    standalone: false
})
export class PlotComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('container') plotContainer!: ElementRef;

  plot!: PatternPlot;
  mainLine!: LineItem;
  bkgLine!: LineItem;
  sumLine!: LineItem;

  private dataGroup: Item;
  private peakGroup: Item;
  private modelSumGroup: Item;
  peakLines: LineItem[] = [];

  private _windowResizeSubscription = new Subscription();
  private _mouseMoveSubscription = new Subscription();
  private _mouseClickSubscription = new Subscription();
  private _patternSubscription = new Subscription();
  private _addedPeakSubscription = new Subscription();
  private _removedPeakSubscription = new Subscription();
  private _updatedPeakSubscription = new Subscription();
  private _selectedPeakSubscription = new Subscription();
  private _combinedUpdateSubscription = new Subscription();

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
    this._initModelUpdateHandling();
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

    this._windowResizeSubscription = fromEvent(window, 'resize').pipe(
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

    this._mouseMoveSubscription = this.plot.mouseMoved.pipe(
      throttleTime(30)
    ).subscribe(({x, y}) => {
      this.mouseService.updatePatternMousePosition(x, y);
    });

    this._mouseClickSubscription = this.plot.mouseClicked.subscribe({
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

    this._patternSubscription = this.patternService.pattern$.pipe(
      throttleTime(30, undefined, {leading: true, trailing: true})
    ).subscribe((pattern) => {
      if (pattern) {
        this.mainLine.setData(pattern.x, pattern.y);
      } else {
        this.mainLine.setData([], []);
      }
    });
  }


  _initPeakLines(): void {
    this._addedPeakSubscription = this.peakService.addedPeak$.subscribe((peak: Model) => {
      this.addModelLine().setData(this.mainLine.x, peak.evaluate(this.mainLine.x));
      this.updateSumLine();
    });

    this._removedPeakSubscription = this.peakService.removedPeak$.subscribe((index) => {
      this.removeModelLine(index);
      this.updateSumLine();
    });

    this._updatedPeakSubscription = this.peakService.updatedPeak$.pipe(
      throttleTime(30, undefined, {leading: true, trailing: true})
    ).subscribe((data: {
      "index": number,
      model: Model
    }) => {
      let y = data.model.evaluate(this.mainLine.x);
      if (this.bkgLine) {
        y = y.map((v, i) => v + this.bkgLine.y[i]);
      }
      this.peakLines[data.index].setData(this.mainLine.x, y);
      this.updateSumLine();
    });



    this._selectedPeakSubscription = this.peakService.selectedPeakIndex$.subscribe(
      (index: number | undefined) => {
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
    this.bkgLine = new LineItem("yellow");
    this.plot.addItem(this.bkgLine, this.peakGroup.root);
  }

  _initModelSumLine(): void {
    this.sumLine = new LineItem("red", 2, false);
    this.plot.addItem(this.sumLine, this.modelSumGroup.root);

  };

  _initModelUpdateHandling(): void {
    this._combinedUpdateSubscription = combineLatest(this.bkgService.bkgModel$, this.peakService.peaks$).pipe(
      throttleTime(30, undefined, {leading: true, trailing: true})
    ).subscribe(([bkgModel, peaks]) => {
      if (bkgModel === undefined) {
        this.bkgLine.setData([], []);
        return;
      }
      this.bkgLine.setData(this.mainLine.x, bkgModel.evaluate(this.mainLine.x));
      this.updatePeaks(peaks);
      this.updateSumLine();
    });
  }

  updatePeaks(peaks: ClickModel[]): void {
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
  }

  updateSumLine(): void {
    const nPeakLines = this.peakLines.length;
    const sum = this.bkgLine.y.map((y, i) => {
      return y * (1 - nPeakLines) + this.peakLines.reduce((sum, peak) => sum + peak.y[i], 0);
    });
    this.sumLine.setData(this.mainLine.x, sum);
  }

  ngOnDestroy(): void {
    this._mouseMoveSubscription.unsubscribe();
    this._mouseClickSubscription.unsubscribe();
    this._patternSubscription.unsubscribe();
    this._addedPeakSubscription.unsubscribe();
    this._removedPeakSubscription.unsubscribe();
    this._updatedPeakSubscription.unsubscribe();
    this._selectedPeakSubscription.unsubscribe();
    this._windowResizeSubscription.unsubscribe();
  }
}
