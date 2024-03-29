import {Injectable} from '@angular/core';
import {LinearModel} from "./models/bkg/linear.model";
import {QuadraticModel} from "./models/bkg/quadratic.model";
import {PolynomialModel} from "./models/bkg/polynomial.model";
import {GuessModel} from "./models/model.interface";
import {BehaviorSubject} from "rxjs";

/**
 * A BkgService is a service that manages the background model.
 * It enables changing background type and setting the background model, and updates the current background model.
 */
@Injectable({
  providedIn: 'root'
})
export class BkgService {

  public bkgTypes = {
    "linear": LinearModel,
    "quadratic": QuadraticModel,
    "polynomial": PolynomialModel
  }
  private bkgModelSubject = new BehaviorSubject<GuessModel | undefined>(undefined);
  public bkgModel$ = this.bkgModelSubject.asObservable();

  private bkgTypeChangedSubject = new BehaviorSubject<GuessModel | undefined>(undefined);
  public bkgTypeChanged$ = this.bkgTypeChangedSubject.asObservable();


  constructor() {}

  selectBkgType(bkgType: string): void {
    const newBkgModel = new this.bkgTypes[bkgType]();
    this.bkgTypeChangedSubject.next(newBkgModel);
  }

  setBkgModel(bkgModel: GuessModel): void {
    this.bkgModelSubject.next(bkgModel);
  }

  clearBkgModel(): void {
    this.bkgModelSubject.next(undefined);
  }
}
