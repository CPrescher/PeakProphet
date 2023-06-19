import {GaussianModel} from "./gaussian.model";
import {LorentzianModel} from "./lorentzian.model";
import {PseudoVoigtModel} from "./pseudo-voigt.model";
import {ClickModel} from "../model.interface";
import {Parameter} from "../parameter.model";

export const peakTypes: { [key: string]: any } = {
  "Gaussian": GaussianModel,
  "Lorentzian": LorentzianModel,
  "PseudoVoigt": PseudoVoigtModel,
}

export function convertModel(model: any): ClickModel {
  const type = model.type;
  let parameters: Parameter[] = [];
  for (const id in model.parameters.ids) {
    const p = model.parameters.entities[model.parameters.ids[id]];
    parameters.push(new Parameter(p.name, p.value, p.vary, p.min, p.max, p.error));
  }
  let peak = new peakTypes[type]();
  peak.parameters = parameters;
  return peak;
}
