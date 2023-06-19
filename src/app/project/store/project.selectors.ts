import {createSelector} from "@ngrx/store";
import {adapter, ModelAdapter} from "./project.state";
import {convertModel} from "../../shared/models/peaks";

const fitItemSelectors = adapter.getSelectors();
const modelSelectors = ModelAdapter.getSelectors();


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
  project => {
    if (project.currentIndex === undefined) {
      return undefined;
    }
    return project.entities[project.currentIndex].currentModelIndex
  }
);

export const models = createSelector(
  projectState,
  currentFitItemIndex,
  (project, index) => project.entities[index].models
);

export const currentModel = createSelector(
  models,
  currentModelIndex,
  (models, index) => {
    if (index === undefined) {
      return undefined;
    }
    const id = models.ids[index];
    return convertModel(models.entities[id]);
  }
);

export const modelCount = createSelector(
  models,
  modelSelectors.selectTotal
);


