import {ClickModel} from "../model.interface";
import {Parameter} from "../parameter.model";
import {lorentzian} from "./model-functions";

export class LorentzianModel implements ClickModel {
  parameters: Parameter[];
  type: string;
  clickSteps = 2;
  currentStep = 0;

  constructor(position=0.0, fwhm=0.5, intensity=1.0) {
    this.parameters = [
      new Parameter("Position", position),
      new Parameter("FWHM", fwhm),
      new Parameter("Amplitude", intensity),
    ];
    this.type = "Lorentzian";
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
    return lorentzian(
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
        this.getParameter("Amplitude").value = y * this.getParameter("FWHM").value * Math.PI * 0.5;
        break;
      case 1:
        const position = this.getParameter("Position").value;
        const old_fwhm = this.getParameter("FWHM").value;
        const old_intensity = this.getParameter("Amplitude").value;
        let new_fwhm = Math.abs(x - position) * 2;
        if(new_fwhm==0) {
            new_fwhm = 0.5
        }
        this.getParameter("FWHM").value = new_fwhm;
        this.getParameter("Amplitude").value = old_intensity * new_fwhm / old_fwhm;
        break;
    }
  }
}
