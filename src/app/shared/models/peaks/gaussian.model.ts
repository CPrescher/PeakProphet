import {ClickModel} from "../model.interface";
import {Parameter} from "../parameter.model";
import {gaussian} from "./model-functions";

export class GaussianModel implements ClickModel {
  parameters: Parameter[];
  name: string;

  clickSteps = 2;
  currentStep = 0;

  constructor(position = 0.0, fwhm = 0.5, amplitude = 1.0) {
    this.parameters = [
      new Parameter("Position", position),
      new Parameter("FWHM", fwhm),
      new Parameter("Amplitude", amplitude),
    ];
    this.name = "Gaussian";
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
    return gaussian(
      x,
      this.getParameter("Position").value,
      this.getParameter("FWHM").value,
      this.getParameter("Amplitude").value
    )
  }

  defineModel(x: number, y: number): void {
    switch (this.currentStep) {
      case 0:
        this.getParameter("Position").value = x;
        this.getParameter("Amplitude").value = y * 1.0644089904549099*this.getParameter("FWHM").value
        break;
      case 1:
        const position = this.getParameter("Position").value;
        const old_fwhm = this.getParameter("FWHM").value;
        const old_amplitude = this.getParameter("Amplitude").value;
        let new_fwhm = Math.abs(x - position) * 2;
        if(new_fwhm==0) {
            new_fwhm = 0.5
        }
        this.getParameter("FWHM").value = new_fwhm;
        this.getParameter("Amplitude").value = old_amplitude * new_fwhm / old_fwhm;
        break;
    }
  }
}
