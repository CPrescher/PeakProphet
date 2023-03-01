import {Pattern} from "./pattern";
import {Model} from "../peak-types/model.interface";

export class FitModel {
  constructor(
    public name: string,
    public pattern: Pattern,
    public peaks: Model[]
  ){}
}
