import {Model} from "./model.interface";
import {Parameter} from "./parameter.model";

export class GaussianModel implements Model {
  parameters: Parameter[];
  name: string;

  constructor() {
    this.parameters = [
      new Parameter("Position", 2.0),
      new Parameter("FWHM", 0.5),
      new Parameter("Intensity", 1.0),
    ];
    this.name = "Gaussian";
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
    const position = this.getParameter("Position").value;
    const fwhm = this.getParameter("FWHM").value;
    const intensity = this.getParameter("Intensity").value;
    const sigma = fwhm / (2 * Math.sqrt(2 * Math.log(2)));
    return x.map(v => intensity * Math.exp(-Math.pow(v - position, 2) / (2 * Math.pow(sigma, 2))));
  }
}
