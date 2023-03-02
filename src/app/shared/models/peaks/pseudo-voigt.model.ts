import {Model} from "../model.interface";
import {Parameter} from "../parameter.model";

export class PseudoVoigtModel implements Model {
  name: string;
  parameters: Parameter[];

  constructor(position = 0.0, fwhm = 0.5, intensity = 1.0, eta = 0.5) {
    this.parameters = [
      new Parameter("Position", position),
      new Parameter("FWHM", fwhm),
      new Parameter("Intensity", intensity),
      new Parameter("Eta", eta),
    ];
    this.name = "Pseudo-Voigt";
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
    const position = this.getParameter("Position").value;
    const fwhm = this.getParameter("FWHM").value;
    const intensity = this.getParameter("Intensity").value;
    const eta = this.getParameter("Eta").value;
    const sigma = fwhm / (2 * Math.sqrt(2 * Math.log(2)));
    const gamma = fwhm / 2;
    return x.map(v => intensity * (eta * Math.exp(-Math.pow(v - position, 2) / (2 * Math.pow(sigma, 2)))) + (1 - eta) * (gamma / (Math.pow(v - position, 2) + Math.pow(gamma, 2))));
  }

}
