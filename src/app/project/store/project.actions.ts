import {createAction, props} from "@ngrx/store";
import {ClickModel} from "../../shared/models/model.interface";
import {Pattern} from "../../shared/data/pattern";

export const addFitItem = createAction(
  "[FIT API] Add Fit Item",
  props<{ name: string, pattern: Pattern}>()
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

export const addModel = createAction(
  "[FIT API] Add Model",
  props<{ itemIndex: number, model: ClickModel }>()
)

export const removeModel = createAction(
  "[FIT API] Remove Model",
  props<{ itemIndex: number, modelIndex: number }>()
)

export const addModelType = createAction(
  "[FIT API] Add Peak Type",
  props<{ peakType: string }>()
)

export const setModels = createAction(
  "[FIT API] Set Peaks",
  props<{ itemIndex: number, peaks: ClickModel[] }>()
)
