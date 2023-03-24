import {Injectable} from '@angular/core';
import {fromEvent} from "rxjs";
import {PeakService} from "./peak.service";


@Injectable({
  providedIn: 'root'
})
export class ShortcutService {

  constructor(
    private peakService: PeakService,
  ) {
    fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) => {
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
          break;
        default:
          break;
      }
    });
  }
}
