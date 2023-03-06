import {Parameter} from "./parameter.model";

export interface Model {
  parameters: Parameter[];
  name: string;
  getParameter(name: string): Parameter;
  evaluate(x: number[]): number[];
}

export interface GuessModel extends Model {
  guess(x: number[], y: number[]): void;
}

export interface ClickModel extends Model {
  clickSteps: number;
  currentStep: number;
  defineModel(x: number, y: number): void;
}
