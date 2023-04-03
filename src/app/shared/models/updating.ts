import {Model} from "./model.interface";
import {FitModel} from "../data/fit-model";
import {LinearModel} from "./bkg/linear.model";
import {QuadraticModel} from "./bkg/quadratic.model";
import {PolynomialModel} from "./bkg/polynomial.model";
import {GaussianModel} from "./peaks/gaussian.model";
import {LorentzianModel} from "./peaks/lorentzian.model";
import {PseudoVoigtModel} from "./peaks/pseudo-voigt.model";

export function updateModel(model: Model, newModelJson): Model {
  const newParametersNames = newModelJson.parameters.map((p) => p.name);
  const oldParametersNames = model.parameters.map((p) => p.name);

  if (newParametersNames.length !== oldParametersNames.length) {
    throw new Error(`Number of parameters does not match`);
  }

  if (newParametersNames.some((name) => !oldParametersNames.includes(name))) {
    throw new Error(`Parameter not found in existing model`);
  }

  if (oldParametersNames.some((name) => !newParametersNames.includes(name))) {
    throw new Error(`Parameter not found in updating JSON`);
  }

  if (model.type !== newModelJson.type) {
    throw new Error(`Model type does not match`);
  }

  model.parameters.forEach((parameter) => {
    const new_parameter = newModelJson.parameters.find((p) => p.name === parameter.name);
    parameter.value = new_parameter.value;
    parameter.error = new_parameter.error;
    parameter.vary = new_parameter.vary;
  });
  return model;
}


/**
 * Update the parameters of a FitModel with the parameters from a JSON object. Does Check for consistency between the
 * FitModel and the JSON object.
 * @param fitModel
 * @param updateJson
 */
export function updateFitModelParameters(fitModel: FitModel, updateJson): FitModel {
  if (fitModel.peaks.length !== updateJson.peaks.length) {
    throw new Error(`Number of peaks does not match`);
  }

  updateModel(fitModel.background, updateJson.background);
  fitModel.peaks.forEach((peak, index) => {
    updateModel(peak, updateJson.peaks[index]);
  });
  return fitModel;
}

/**
 * Update the parameters of a FitModel with the parameters from a JSON object. Does not check for consistency between
 * the FitModel and the JSON object. Will overwrite current background model and peak models. This includes changing
 * background type and peak number as well as peak types.
 * @param fitModel
 * @param updateJson
 */
export function updateFitModel(fitModel: FitModel, updateJson): FitModel {
  switch (updateJson.background.type) {
    case 'linear':
      fitModel.background = new LinearModel();
      break;
    case 'quadratic':
      fitModel.background = new QuadraticModel();
      break;
    case 'polynomial':
      fitModel.background = new PolynomialModel();
      break;
    default:
      throw new Error(`Unknown background type: ${updateJson.background.type}`);
  }
  updateModel(fitModel.background, updateJson.background);

  fitModel.peaks = [];
  updateJson.peaks.forEach((peakJson) => {
    switch (peakJson.type) {
      case 'Gaussian':
        fitModel.peaks.push(new GaussianModel());
        break;
      case 'Lorentzian':
        fitModel.peaks.push(new LorentzianModel());
        break;
      case 'PseudoVoigt':
        fitModel.peaks.push(new PseudoVoigtModel());
        break;
      default:
        throw new Error(`Unknown peak type: ${peakJson.type}`);
    }
    updateModel(fitModel.peaks[fitModel.peaks.length - 1], peakJson);
  });
  return fitModel;
}
