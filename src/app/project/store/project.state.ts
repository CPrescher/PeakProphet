import {Pattern} from "../../shared/data/pattern";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Parameter} from "../../shared/models/parameter.model";


export interface ProjectState extends EntityState<FitItem> {
  name: string,
  currentIndex: number | undefined,
}


export interface FitItem {
  name: string,
  pattern: Pattern,
  models: EntityState<Model>
  currentModelIndex: number | undefined,
}


export interface Model {
  type: string,
  parameters: EntityState<Parameter>,
  clickSteps: number,
  currentStep: number,
}

export const adapter = createEntityAdapter<FitItem>();
export const ModelAdapter = createEntityAdapter<Model>();
export const ParameterAdapter = createEntityAdapter<Parameter>(
  {selectId: (param: Parameter) => param.name}
);


export const initialProjectState: ProjectState = adapter.getInitialState({name: '', currentIndex: undefined});

