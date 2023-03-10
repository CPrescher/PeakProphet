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
      new Parameter("center", center),
      new Parameter("fwhm", fwhm),
      new Parameter("amplitude", amplitude),
      new Parameter("fraction", fraction),
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
    const position = this.getParameter("center").value;
    const fwhm = this.getParameter("fwhm").value;
    const amplitude = this.getParameter("amplitude").value;
    const fraction = this.getParameter("fraction").value;

    const gauss = gaussian(x, position, fwhm, amplitude);
    const lorentz = lorentzian(x, position, fwhm, amplitude);
    return x.map((v, i) => fraction * gauss[i] + (1 - fraction) * lorentz[i]);
  }

  defineModel(x: number, y: number): void {
    switch (this.currentStep) {
      case 0: {
        const fwhm = this.getParameter("fwhm").value;
        const eta = this.getParameter("fraction").value;

        this.getParameter("center").value = x;

        const gaussAmplitude = y * 1.7724538509055159 * fwhm / 1.6652;
        const lorentzAmplitude = y * fwhm * Math.PI * 0.5;
        this.getParameter("amplitude").value = eta * gaussAmplitude + (1 - eta) * lorentzAmplitude;
        break;
      }
      case 1: {
        const position = this.getParameter("center").value;
        const old_fwhm = this.getParameter("fwhm").value;
        const old_amplitude = this.getParameter("amplitude").value;

        let new_fwhm = Math.abs(x - position) * 2;
        if (new_fwhm == 0) {
          new_fwhm = 0.5
        }
        this.getParameter("fwhm").value = new_fwhm;
        this.getParameter("amplitude").value = old_amplitude * new_fwhm / old_fwhm;
        break;
      }
    }
  }

}
