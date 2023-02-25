import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import PatternPlot from "../../lib/plotting/pattern-plot";
import LineItem from "../../lib/plotting/items/lineItem";
import VerticalLineItem from "../../lib/plotting/items/verticalLineItem";
import * as _ from 'lodash';

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

  constructor() {
  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this._initPlot();
    this._initResizeHandling();
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

    this.mainLine.setData([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
