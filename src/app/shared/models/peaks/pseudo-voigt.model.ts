import {ClickModel} from "../model.interface";
import {Parameter} from "../parameter.model";
import {gaussian, lorentzian} from "./model-functions";

export class PseudoVoigtModel implements ClickModel {
  type: string;
  parameters: Parameter[];

  clickSteps = 2;
  currentStep = 0;

  constructor(center = 0.0, fwhm = 0.5, amplitude = 1.0, fraction = 0.5) {
    this.parameters = [
      new Parameter("Center", center),
      new Parameter("FWHM", fwhm),
      new Parameter("Amplitude", amplitude),
      new Parameter("Fraction", fraction),
    ];
    this.type = "PseudoVoigt";
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
    const position = this.getParameter("Center").value;
    const fwhm = this.getParameter("FWHM").value;
    const amplitude = this.getParameter("Amplitude").value;
    const eta = this.getParameter("Fraction").value;

    const gauss = gaussian(x, position, fwhm, amplitude);
    const lorentz = lorentzian(x, position, fwhm, amplitude);
    return x.map((v, i) => eta * gauss[i] + (1 - eta) * lorentz[i]);
  }

  defineModel(x: number, y: number): void {
    switch (this.currentStep) {
      case 0: {
        const fwhm = this.getParameter("FWHM").value;
        const eta = this.getParameter("Fraction").value;

        this.getParameter("Center").value = x;

        const gaussAmplitude = y * 1.7724538509055159 * fwhm / 1.6652;
        const lorentzAmplitude = y * fwhm * Math.PI * 0.5;
        this.getParameter("Amplitude").value = eta * gaussAmplitude + (1 - eta) * lorentzAmplitude;
        break;
      }
      case 1: {
        const position = this.getParameter("Center").value;
        const old_fwhm = this.getParameter("FWHM").value;
        const old_amplitude = this.getParameter("Amplitude").value;

        let new_fwhm = Math.abs(x - position) * 2;
        if (new_fwhm == 0) {
          new_fwhm = 0.5
        }
        this.getParameter("FWHM").value = new_fwhm;
        this.getParameter("Amplitude").value = old_amplitude * new_fwhm / old_fwhm;
        break;
      }
    }
  }

}
