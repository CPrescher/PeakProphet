import {createAction, props} from "@ngrx/store";
import {FitModel as FitItem}  from "../../shared/data/fit-model";
import {ClickModel} from "../../shared/models/model.interface";

export const addFitItem = createAction(
  "[FIT API] Add Fit Item",
  props<{ item: FitItem }>()
)

export const removeFitItem = createAction(
  "[FIT API] Remove Fit Item",
  props<{ index: number }>()
)

export const selectFitItem = createAction(
  "[FIT API] Select Fit Item",
  props<{ index: number | undefined }>()
)

export const moveFitItem = createAction(
  "[FIT API] Move Fit Item",
  props<{ index: number, delta: number }>()
)

export const clearFitItems = createAction(
  "[FIT API] Clear Fit Items"
)

export const setName = createAction(
  "[FIT API] Set Name",
  props<{ name: string }>()
)

export const addPeak = createAction(
  "[FIT API] Add Peak",
  props<{ peak: ClickModel }>()
)

export const addPeakType = createAction(
  "[FIT API] Add Peak Type",
  props<{ peakType: string }>()
)

export const setPeaks = createAction(
  "[FIT API] Set Peaks",
  props<{ itemIndex: number, peaks: ClickModel[] }>()
)
