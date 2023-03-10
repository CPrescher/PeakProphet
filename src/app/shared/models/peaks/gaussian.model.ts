import {ClickModel} from "../model.interface";
import {Parameter} from "../parameter.model";
import {gaussian} from "./model-functions";

export class GaussianModel implements ClickModel {
  parameters: Parameter[];
  type: string;

  clickSteps = 2;
  currentStep = 0;

  constructor(center = 0.0, fwhm = 0.5, amplitude = 1.0) {
    this.parameters = [
      new Parameter("center", center),
      new Parameter("fwhm", fwhm),
      new Parameter("amplitude", amplitude),
    ];
    this.type = "Gaussian";
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
      this.getParameter("center").value,
      this.getParameter("fwhm").value,
      this.getParameter("amplitude").value
    )
  }

  defineModel(x: number, y: number): void {
    switch (this.currentStep) {
      case 0:
        this.getParameter("center").value = x;
        this.getParameter("amplitude").value = y * 1.0644089904549099*this.getParameter("fwhm").value
        break;
      case 1:
        const position = this.getParameter("center").value;
        const old_fwhm = this.getParameter("fwhm").value;
        const old_amplitude = this.getParameter("amplitude").value;
        let new_fwhm = Math.abs(x - position) * 2;
        if(new_fwhm==0) {
            new_fwhm = 0.5
        }
        this.getParameter("fwhm").value = new_fwhm;
        this.getParameter("amplitude").value = old_amplitude * new_fwhm / old_fwhm;
        break;
    }
  }
}
