import {Pattern} from "./pattern";
import {ClickModel, GuessModel} from "../models/model.interface";

export class FitModel {
  constructor(
    public name: string,
    public pattern: Pattern,
    public peaks: ClickModel[],
    public background: GuessModel
  ){}
}
