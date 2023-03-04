import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MousePositionService {

  private patternMousePosition = new Subject<{ x: number, y: number }>();
  private patternClickPosition = new Subject<{ x: number, y: number }>();

  public patternMousePosition$ = this.patternMousePosition.asObservable();
  public patternClickPosition$ = this.patternClickPosition.asObservable();

  updatePatternMousePosition(x, y): void {
    this.patternMousePosition.next({x, y});
  }

  updatePatternClickPosition(x, y): void {
    this.patternClickPosition.next({x, y});
  }
}
