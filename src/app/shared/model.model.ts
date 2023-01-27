import {Parameter} from "./parameter.model";

export interface Model {
  parameters: Parameter[];
  name: string;
  getParameter(name: string): Parameter;
  evaluate(x: number[]): number[];
}
