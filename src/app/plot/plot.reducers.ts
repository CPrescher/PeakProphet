import {createReducer} from '@ngrx/store';
import {immerOn} from "ngrx-immer/store";
import {PlotActions as ActionTypes} from "./action-types";
import {Pattern} from "../shared/data/pattern";

export const plotFeatureKey = 'plot';

export interface PlotState {
  currentPattern: Pattern | undefined;
  backgroundPattern: Pattern | undefined;
  peakPatterns: Pattern[]
}

export const initialState: PlotState = {
  currentPattern: undefined,
  backgroundPattern: undefined,
  peakPatterns: []
}


export const plotReducer = createReducer(
  initialState,

  immerOn(ActionTypes.setCurrentPattern, (state, action) => {
    state.currentPattern = action.pattern;
  }),

  immerOn(ActionTypes.clearCurrentPattern, (state, action) => {
    state.currentPattern = undefined;
  }),

  immerOn(ActionTypes.setBackgroundPattern, (state, action) => {
    state.backgroundPattern = action.pattern
  }),

  immerOn(ActionTypes.addPeakPattern, (state, action) => {
    state.peakPatterns.push(action.pattern);
  }),

  immerOn(ActionTypes.updatePeakPattern, (state, action) => {
    if (state.peakPatterns.length < action.ind) {
      return state;
    }
    state.peakPatterns[action.ind] = action.pattern;
    return state;
  }),

  immerOn(ActionTypes.removePeakPattern, (state, action) => {
    if (state.peakPatterns.length < action.ind) {
      return state;
    }
    state.peakPatterns.splice(action.ind, 1);
    return state;
  }),

  immerOn(ActionTypes.clearPeakPatterns, (state, action) => {
    state.peakPatterns = [];
  })
);
