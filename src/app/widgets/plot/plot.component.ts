import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import PatternPlot from "../../lib/plotting/pattern-plot";
import LineItem from "../../lib/plotting/items/lineItem";
import VerticalLineItem from "../../lib/plotting/items/verticalLineItem";
import * as _ from 'lodash';
import {PatternService} from "../../shared/pattern.service";

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit, AfterViewInit {

  @ViewChild('container') plotContainer!: ElementRef;



  plot!: PatternPlot;
  mainLine!: LineItem;
  verticalLine!: VerticalLineItem;


  throttleResize;

  constructor(private patternService: PatternService){
  }

  ngOnInit(): void {
    this.patternService.selected$.subscribe((pattern) => {
      if (pattern) {
        this.mainLine.setData(pattern.x, pattern.y);
      }
    });


  }
  ngAfterViewInit() {
    this._initPlot();
    this._initResizeHandling();

    this.patternService.addPattern("LALALA", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 10, 5, 6, 7, 8, 9])
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


}
