import {Model} from "./model.interface";
import {FitModel} from "../data/fit-model";

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
  });
  return model;
}

export function updateFitModel(fitModel: FitModel, updateJson): FitModel {
  if (fitModel.peaks.length !== updateJson.peaks.length) {
    throw new Error(`Number of peaks does not match`);
  }

  updateModel(fitModel.background, updateJson.background);
  fitModel.peaks.forEach((peak, index) => {
    updateModel(peak, updateJson.peaks[index]);
  });
  return fitModel;
}
