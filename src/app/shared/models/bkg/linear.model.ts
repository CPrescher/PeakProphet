import {Parameter} from "../parameter.model";
import {GuessModel} from "../model.interface";
import {averageAroundIndex, indexOfSmallest} from "../util";

export class LinearModel implements GuessModel {
  parameters: Parameter[];
  type: string;

  constructor(intercept: number = 0, slope: number = 1) {
    this.parameters = [
      new Parameter('intercept', intercept),
      new Parameter('slope', slope)
    ];
    this.type = 'linear';
  }

  getParameter(name: string): Parameter {
    const parameter = this.parameters.find(p => p.name === name);
    if (parameter !== undefined) {
      return parameter;
    } else {
      throw new Error(`Parameter ${name} not found`);
    }
  }

  evaluate(x: number[]): number[] {
    const intercept = this.getParameter('intercept').value;
    const slope = this.getParameter('slope').value;
    return x.map(x => slope * x + intercept);
  }

  guess(x: number[], y: number[]): void {
    const numPoints = x.length;
    const midPoint = Math.ceil(numPoints/2)

    const leftSideY = y.slice(0, midPoint)
    const rightSideY = y.slice(midPoint, numPoints)
    const leftMinIndex = indexOfSmallest(leftSideY)
    const rightMinIndex = indexOfSmallest(rightSideY) + midPoint

    const x0 = x[leftMinIndex]
    const y0 = averageAroundIndex(y, leftMinIndex, 1)
    const x1 = x[rightMinIndex]
    const y1 = averageAroundIndex(y, rightMinIndex, 1)

    const m = (y1 - y0) / (x1 - x0);
    const b = y0 - m * x0;
    this.getParameter('slope').value = m;
    this.getParameter('intercept').value = b;
  }
}
