import {Injectable} from '@angular/core';
import {fromEvent, withLatestFrom} from "rxjs";
import {PeakService} from "./peak.service";
import {MousePositionService} from "./mouse-position.service";


@Injectable({
  providedIn: 'root'
})
export class ShortcutService {

  constructor(
    private peakService: PeakService,
    private mousePositionService: MousePositionService,
  ) {
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      withLatestFrom(this.mousePositionService.patternMousePosition$)
    ).subscribe(([event, pos]) => {
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
          this.peakService.selectClosestPeak(pos.x, pos.y);
          break;
        default:
          break;
      }
    });
  }
}
