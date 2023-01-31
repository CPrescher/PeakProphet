import {Model} from "./model.interface";
import {Parameter} from "./parameter.model";

export class GaussianModel implements Model {
  parameters: Parameter[];
  name: string;

  constructor(position=0.0, fwhm=0.5, intensity=1.0) {
    this.parameters = [
      new Parameter("Positions", position),
      new Parameter("FWHM", fwhm),
      new Parameter("Intensity", intensity),
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
