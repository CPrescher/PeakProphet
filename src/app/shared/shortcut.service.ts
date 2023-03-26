import {Injectable} from '@angular/core';
import {filter, fromEvent, withLatestFrom} from "rxjs";
import {PeakService} from "./peak.service";
import {MousePositionService} from "./mouse-position.service";
import {BkgService} from "./bkg.service";


@Injectable({
  providedIn: 'root'
})
export class ShortcutService {


  autoSelectClosestPeakToggle = false;

  constructor(
    private peakService: PeakService,
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
          this.peakService.addPeak("Gaussian");
          this.peakService.clickDefinePeak()
          break;
        case 'l':
          this.peakService.addPeak("Lorentzian");
          this.peakService.clickDefinePeak()
          break;
        case 'p':
          this.peakService.addPeak("Pseudo-Voigt");
          this.peakService.clickDefinePeak()
          break;
        case 'd':
          this.peakService.clickDefinePeak();
          break;
        case 'r':
          this.peakService.removePeak()
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
      this.peakService.selectClosestPeak(x, y - y_bkg);
    });
  }
}
