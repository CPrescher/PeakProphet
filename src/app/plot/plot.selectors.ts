import {createFeatureSelector, createSelector} from "@ngrx/store";
import {PlotState} from "./plot.reducers";


export const selectPlotState = createFeatureSelector<PlotState>('plot');

export const currentPattern = createSelector(
  selectPlotState,
  plot => plot.currentPattern
)

export const backgroundPattern = createSelector(
  selectPlotState,
  plot => plot.backgroundPattern
)

export const peakPatterns = createSelector(
  selectPlotState,
  plot => plot.peakPatterns
)

export const peakPattern = createSelector(
  peakPatterns,
  (patterns, props) => patterns[props.ind]
)
