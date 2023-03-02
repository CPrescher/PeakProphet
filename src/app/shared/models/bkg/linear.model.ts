import {Parameter} from "../parameter.model";
import {Model} from "../model.interface";

export class LinearModel implements Model {
  parameters: Parameter[];
  name: string;

  constructor(m: number = 0, b: number = 1) {
    this.parameters = [
      new Parameter('m', m),
      new Parameter('b', b)
    ];
    this.name = 'Linear';
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
    const m = this.getParameter('m').value;
    const b = this.getParameter('b').value;
    return x.map(x => m * x + b);
  }

  guess(x: number[], y: number[]): void {
    const numPoints = x.length;
    const m = (y[numPoints-1] - y[0]) / (x[numPoints-1] - x[0]);
    const b = y[0] - m * x[0];
    this.getParameter('m').value = m;
    this.getParameter('b').value = b;
  }
}
