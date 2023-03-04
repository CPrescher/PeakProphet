import {Pattern} from "./pattern";
import {ClickModel, Model} from "../models/model.interface";

export class FitModel {
  constructor(
    public name: string,
    public pattern: Pattern,
    public peaks: ClickModel[],
    public background: Model
  ){}
}
