import {Parameter} from "../parameter.model";
import {GuessModel} from "../model.interface";

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
    const m = (y[numPoints-1] - y[0]) / (x[numPoints-1] - x[0]);
    const b = y[0] - m * x[0];
    this.getParameter('slope').value = m;
    this.getParameter('intercept').value = b;
  }
}
