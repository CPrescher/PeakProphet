import {Pattern} from "../../shared/data/pattern";
import {ClickModel} from "../../shared/models/model.interface";

export interface ProjectState {
  name: string,
  fitItems: FitItem[],
  currentIndex: number | undefined,
}

export const initialProjectState: ProjectState = {
  name: '',
  fitItems: [],
  currentIndex: undefined,
}


export interface FitItem {
  name: string,
  pattern: Pattern,
  peaks: ClickModel[],
}
