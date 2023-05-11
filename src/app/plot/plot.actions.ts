import {createAction, props} from '@ngrx/store';
import {Pattern} from "../shared/data/pattern";

export const setCurrentPattern = createAction(
  "[PLOT API] Set Current Pattern",
  props<{ pattern: Pattern | undefined }>()
)

export const clearCurrentPattern = createAction(
  "[PLOT API] Clear Current Pattern"
)

export const setBackgroundPattern = createAction(
  "[PLOT API] Set Background Pattern",
  props<{ pattern: Pattern }>()
)

export const addPeakPattern = createAction(
  "[PLOT API] Set Peak Pattern",
  props<{ pattern: Pattern }>()
)

export const updatePeakPattern = createAction(
  "[PLOT API] Update Peak Pattern",
  props<{ ind: number, pattern: Pattern }>()
)

export const removePeakPattern = createAction(
  "[PLOT API] Remove Peak Pattern",
  props<{ ind: number }>()
)

export const clearPeakPatterns = createAction(
  "[PLOT API] Clear Peak Patterns"
);

