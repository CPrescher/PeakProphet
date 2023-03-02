import {Pattern} from "./pattern";
import {Model} from "../models/model.interface";

export class FitModel {
  constructor(
    public name: string,
    public pattern: Pattern,
    public peaks: Model[],
    public background: Model
  ){}
}
