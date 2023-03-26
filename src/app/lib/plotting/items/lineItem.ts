import * as d3 from 'd3';
import {Item} from './item';

export default class LineItem extends Item {
  x: number[];
  y: number[];

  protected XY: {x: number, y: number}[] = [];
  protected lineElement;

  constructor(
    private color = 'white',
    private strokeWidth = 2,
    private dashed = false
  ) {
    super();
  }

  setColor(color: string): void {
    this.color = color;
    this.update();
  }

  setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    this.update();
  }

  setDashed(dashed: boolean): void {
    this.dashed = dashed;
    this.update();
  }

  setData(x: number[], y: number[]): void {
    this.x = x;
    this.y = y;
    this.XY = [];
    for (let i = 0; i < x.length; i++) {
      this.XY.push({x: x[i], y: y[i]});
    }
    this.xRange.min = Math.min(...x);
    this.xRange.max = Math.max(...x);
    this.yRange.min = Math.min(...y);
    this.yRange.max = Math.max(...y);
    this.dataChanged.next([]);
    this.update();
  }

  createLineElement(): void {
    this.lineElement = d3
      .line()
      // @ts-ignore
      .x(d => this.xScale(d.x))
      // @ts-ignore
      .y(d => this.yScale(d.y));
    // return
  }

  updateLine(): void {
    // Create line
    const path = this.root.selectAll('path').data([this.XY], d => this.xScale(d.x));

    path
      .enter()
      .append('path')
      .merge(path)
      .transition()
      .duration(0)

      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', this.strokeWidth)
      .attr('pointer-events', 'none')
      .attr('d', this.lineElement);

    if(this.dashed) {
      path
        .attr('stroke-dasharray', '5,5')
        .attr('stroke-linecap', 'round');
    } else {
      path
        .attr('stroke-dasharray', 'none')
        .attr('stroke-linecap', 'butt');
    }

    // path.exit().remove();
  }

  override update(): void {
    this.createLineElement();
    this.updateLine();
  }
}
