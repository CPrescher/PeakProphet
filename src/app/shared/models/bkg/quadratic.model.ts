import {GuessModel} from "../model.interface";
import {Parameter} from "../parameter.model";

export class QuadraticModel implements GuessModel {
  parameters: Parameter[];
  type: string;

  constructor(a: number = 0, b: number = 1, c: number = 0) {
    this.parameters = [
      new Parameter('a', a),
      new Parameter('b', b),
      new Parameter('c', c)
    ];
    this.type = 'quadratic';
  }

  getParameter(name: string): Parameter {
    const parameter = this.parameters.find(p => p.name === name);
    if(parameter !== undefined) {
      return parameter;
    } else {
      throw new Error(`Parameter ${name} not found`);
    }
  }
  evaluate(x: number[]): number[] {
    const a = this.getParameter('a').value;
    const b = this.getParameter('b').value;
    const c = this.getParameter('c').value;
    return x.map(x => a * x * x + b * x + c);
  }

  guess(x: number[], y: number[]): void {
    const numPoints = x.length;
    const b = (y[numPoints-1] - y[0]) / (x[numPoints-1] - x[0]);
    const c = y[0] - b * x[0];
    this.getParameter('a').value = 0;
    this.getParameter('b').value = b;
    this.getParameter('c').value = c;
  }
}
