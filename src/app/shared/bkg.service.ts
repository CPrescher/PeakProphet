import {Injectable} from '@angular/core';
import {LinearModel} from "./models/bkg/linear.model";
import {QuadraticModel} from "./models/bkg/quadratic.model";
import {PolynomialModel} from "./models/bkg/polynomial.model";
import {Model} from "./models/model.interface";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BkgService {

  public bkgTypes = {
    "linear": LinearModel,
    "quadratic": QuadraticModel,
    "polynomial": PolynomialModel
  }
  private bkgModelSubject = new BehaviorSubject<Model | undefined>(undefined);
  public bkgModel$ = this.bkgModelSubject.asObservable();

  selectBkgType(bkgType: string): void {
    this.bkgModelSubject.next(new this.bkgTypes[bkgType]());
  }

  selectBkgModel(bkgModel: Model): void {
    this.bkgModelSubject.next(bkgModel);
  }
}
