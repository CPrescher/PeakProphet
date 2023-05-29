import {createReducer, on} from '@ngrx/store';
import {ProjectActions as ActionTypes} from "./action-types";
import {adapter, initialProjectState, ModelAdapter, ParameterAdapter} from "./project.state";
import {GaussianModel} from "../../shared/models/peaks/gaussian.model";
import {LorentzianModel} from "../../shared/models/peaks/lorentzian.model";
import {PseudoVoigtModel} from "../../shared/models/peaks/pseudo-voigt.model";
import {LinearModel} from "../../shared/models/bkg/linear.model";

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
)


