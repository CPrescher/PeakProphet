import {createSelector} from "@ngrx/store";
import {adapter} from "./project.state";

const fitItemSelectors = adapter.getSelectors();


export const projectState = state => state.project;
export const currentFitItemIndex = createSelector(
  projectState,
  project => project.currentIndex
);

export const currentFitItem = createSelector(
  projectState,
  project => project.entities[project.currentIndex]
);

export const fitItems =  createSelector(
  projectState,
  fitItemSelectors.selectAll
);

export const currentModelIndex = createSelector(
  projectState,
  project => project.entities[project.currentIndex].currentModelIndex
);

export const currentModel = createSelector(
  projectState,
  currentModelIndex,
  (project, index) => project.entities[project.currentIndex].models[index]
);

export const models = createSelector(
  projectState,
  currentFitItemIndex,
  (project, index) => project.entities[index].models
);

