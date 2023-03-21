import {Pattern} from "./pattern";
import {ClickModel, GuessModel} from "../models/model.interface";

/**
 * A FitModel is a Pattern with a list of peaks and a background model.
 */
export class FitModel {
  constructor(
    public name: string,
    public pattern: Pattern,
    public peaks: ClickModel[],
    public background: GuessModel
  ){}
}
