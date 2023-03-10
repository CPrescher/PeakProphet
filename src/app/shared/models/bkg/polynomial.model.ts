import {GuessModel} from "../model.interface";
import {Parameter} from "../parameter.model";

export class PolynomialModel implements GuessModel {
  parameters: Parameter[];
  degree: number;
  type: string;

  constructor(degree: number = 2, ...coefficients: number[]) {
    this.degree = degree;
    this.parameters = [];
    for(let i = 0; i <= degree; i++) {
      this.parameters.push(new Parameter(`c${i}`, coefficients[i]));
    }
    this.type = 'polynomial';
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
    const coefficients = this.parameters.map(p => p.value);
    return x.map(x => {
      let y = 0;
      for(let i = 0; i <= this.degree; i++) {
        y += coefficients[i] * Math.pow(x, i);
      }
      return y;
    });
  }

  guess(x: number[], y: number[]): void {
    return;
  }
}
