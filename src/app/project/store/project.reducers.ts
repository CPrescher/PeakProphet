import {createReducer, on} from '@ngrx/store';
import {ProjectActions as ActionTypes} from "./action-types";
import {adapter, initialProjectState, ModelAdapter, ParameterAdapter} from "./project.state";
import {GaussianModel} from "../../shared/models/peaks/gaussian.model";
import {LorentzianModel} from "../../shared/models/peaks/lorentzian.model";
import {PseudoVoigtModel} from "../../shared/models/peaks/pseudo-voigt.model";
import {LinearModel} from "../../shared/models/bkg/linear.model";
import {Parameter} from "../../shared/models/parameter.model";

export const projectFeatureKey = 'project';


const peakTypes: { [key: string]: any } = {
  "Gaussian": GaussianModel,
  "Lorentzian": LorentzianModel,
  "Pseudo-Voigt": PseudoVoigtModel,
}

export const projectReducer = createReducer(
  initialProjectState,

  on(ActionTypes.setName, (state, action) => {
    return {...state, name: action.name};
  }),

  on(ActionTypes.addFitItem, (state, action) => {
      const item = {
        id: state.ids.length,
        name: action.name,
        pattern: action.pattern,
        models: ModelAdapter.getInitialState(),
        bkg_model: new LinearModel(),
        currentModelIndex: undefined,
      }
      return adapter.addOne(item, state)
    }
  ),

  on(ActionTypes.addModel, (state, action) => {
      const item = state.entities[action.itemIndex];
      if (item == undefined) {
        return state;
      }

      const model = {
        id: item.models.ids.length,
        type: action.model.type,
        parameters: ParameterAdapter.getInitialState(),
        clickSteps: action.model.clickSteps,
        currentStep: action.model.currentStep
      }

      action.model.parameters.forEach((param, key) => {
        const parameter = {
          id: model.parameters.ids.length,
          name: param.name,
          value: param.value,
          vary: true,
          min: -Infinity,
          max: Infinity,
          error: 0
        }
        model.parameters = ParameterAdapter.addOne(parameter, model.parameters);
      })

      return adapter.updateOne(
        {
          id: action.itemIndex,
          changes: {models: ModelAdapter.addOne(model, item.models)}
        }, state)
    }
  ),

  on(ActionTypes.removeModel, (state, action) => {
      const item = state.entities[action.itemIndex];
      if (item == undefined) {
        return state;
      }
      return adapter.updateOne({
        id: action.itemIndex,
        changes: {models: ModelAdapter.removeOne(action.modelIndex, item.models)}
      }, state)
    }
  ),

  on(ActionTypes.clearModels, (state, action) => {
      const item = state.entities[action.itemIndex];
      if (item == undefined) {
        return state;
      }
      return adapter.updateOne({
        id: action.itemIndex,
        changes: {
          models: ModelAdapter.removeAll(item.models),
          currentModelIndex: undefined
        }
      }, state)
    }
  ),

  on(ActionTypes.selectModel, (state, action) => {
      const item = state.entities[action.itemIndex];
      if (item == undefined) {
        return state;
      }
      return adapter.updateOne({
        id: action.itemIndex,
        changes: {currentModelIndex: action.modelIndex}
      }, state)
    }
  ),


  on(ActionTypes.selectFitItem, (state, action) => {
      return {...state, currentIndex: action.index};
    }
  ),

  on(ActionTypes.removeFitItem, (state, action) => {
      if (state.ids.length < action.index) {
        return state;
      }
      return adapter.removeOne(action.index, state);
    }
  ),

  on(ActionTypes.moveFitItem, (state, action) => {
      if (state.ids.length < action.index) {
        return state;
      }
      const ids = state.ids.slice();
      const new_index = action.index + action.delta;
      ids[action.index] = state.ids[new_index];
      ids[new_index] = state.ids[action.index];
      return {...state, ids: ids};
    }
  ),

  on(ActionTypes.clearFitItems, (state, action) => {
    return adapter.removeAll(state);
  }),

  on(ActionTypes.updateParameter, (state, action) => {
    const item = state.entities[action.itemIndex];
    if (item == undefined) {
      return state;
    }
    const model = item.models.entities[action.modelIndex];
    if (model == undefined) {
      return state;
    }
    if (model.parameters == undefined) {
      return state;
    }

    // const parameter = model.parameters.entities[action.parameter.name];
    // @ts-ignore we check before whether the entities field exists...
    const parameter = model.parameters.entities[action.parameter.name];
    if (parameter === undefined) {
      return state;
    }
    // select parameter based on name

    return adapter.updateOne({
      id: action.itemIndex,
      changes: {
        models: ModelAdapter.updateOne({
          id: action.modelIndex,
          changes: {
            parameters: ParameterAdapter.updateOne({
              id: parameter.name,
              changes: {
                value: action.parameter.value,
                vary: action.parameter.vary,
                min: action.parameter.min,
                max: action.parameter.max,
                error: action.parameter.error
              }
            }, model.parameters)
          }
        }, item.models)
      }
    }, state)
  }),
)


