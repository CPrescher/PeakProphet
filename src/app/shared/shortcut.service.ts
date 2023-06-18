import {Injectable} from '@angular/core';
import {filter, fromEvent, withLatestFrom} from "rxjs";
import {ModelService} from "./model.service";
import {MousePositionService} from "./mouse-position.service";
import {BkgService} from "./bkg.service";


@Injectable({
  providedIn: 'root'
})
export class ShortcutService {


  autoSelectClosestPeakToggle = false;

  constructor(
    private modelService: ModelService,
    private mousePositionService: MousePositionService,
    private bkgService: BkgService,
  ) {
    this._initAutoSelectClosestPeak()

    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    ).subscribe((event,) => {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }
      switch (event.key) {
        case 'g':
          this.modelService.addPeak("Gaussian");
          this.modelService.clickDefineModel()
          break;
        case 'l':
          this.modelService.addPeak("Lorentzian");
          this.modelService.clickDefineModel()
          break;
        case 'p':
          this.modelService.addPeak("Pseudo-Voigt");
          this.modelService.clickDefineModel()
          break;
        case 'd':
          this.modelService.clickDefineModel();
          break;
        case 'r':
          this.modelService.removeModel()
          break;
        case 's':
          this.autoSelectClosestPeakToggle = !this.autoSelectClosestPeakToggle;
          break;
        default:
          break;
      }
    });
  }


  private _initAutoSelectClosestPeak() {
    this.mousePositionService.patternMousePosition$.pipe(
      withLatestFrom(this.bkgService.bkgModel$),
      filter((_) => this.autoSelectClosestPeakToggle)
    ).subscribe(([mousePosition, bkgModel]) => {
      const x = mousePosition.x;
      const y = mousePosition.y;
      const y_bkg = bkgModel ? bkgModel.evaluate([x])[0] : 0;
      this.modelService.selectClosestModel(x, y - y_bkg);
    });
  }
}
