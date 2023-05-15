import {combineReducers, createReducer, on} from '@ngrx/store';
import {immerOn} from "ngrx-immer/store";
import {ProjectActions as ActionTypes} from "./action-types";
import {initialProjectState} from "./project.state";
import {GaussianModel} from "../../shared/models/peaks/gaussian.model";
import {LorentzianModel} from "../../shared/models/peaks/lorentzian.model";
import {PseudoVoigtModel} from "../../shared/models/peaks/pseudo-voigt.model";

export const projectFeatureKey = 'project';


const peakTypes: { [key: string]: any } = {
  "Gaussian": GaussianModel,
  "Lorentzian": LorentzianModel,
  "Pseudo-Voigt": PseudoVoigtModel,
}

export const projectReducer = createReducer(
  initialProjectState,

  immerOn(ActionTypes.addFitItem, (state, action) => {
    state.fitItems.push({
      name: action.item.name,
      pattern: action.item.pattern,
      peaks: action.item.peaks,
    });
    return state;
  }),

  immerOn(ActionTypes.removeFitItem, (state, action) => {
    if (state.fitItems.length < action.index) {
      return state;
    }
    state.fitItems.splice(action.index, 1);
    return state;
  }),

  immerOn(ActionTypes.selectFitItem, (state, action) => {
    state.currentIndex = action.index;
  }),

  immerOn(ActionTypes.moveFitItem, (state, action) => {
    if (state.fitItems.length < action.index) {
      return state;
    }
    const item = state.fitItems[action.index];
    state.fitItems.splice(action.index, 1);
    state.fitItems.splice(action.index + action.delta, 0, item);
    return state;
  }),

  immerOn(ActionTypes.clearFitItems, (state, action) => {
    state.fitItems = [];
  }),

  immerOn(ActionTypes.setName, (state, action) => {
    state.name = action.name;
  }),

  // #######################
  // Peak reducers
  immerOn(ActionTypes.addPeakType, (state, action) => {
    if (state.currentIndex === undefined) {
      return state;
    }
    console.log("Adding peak type: ", action.peakType);


    const peakType = peakTypes[action.peakType];
    const peak = new peakType();

    // const fitItems = [...state.fitItems];
    const fitItems = JSON.parse(JSON.stringify(state.fitItems));

    return {
      ...state,
      fitItems: fitItems.map((item, index) => {
        if (index === state.currentIndex) {
          const peaks = [...item.peaks];
          item.peaks = [...peaks, peak];
        }
        return item;
      })
    }
  }),

  immerOn(ActionTypes.setPeaks, (state, action) => {
    state.fitItems[action.itemIndex].peaks = action.peaks;
  }),
);
