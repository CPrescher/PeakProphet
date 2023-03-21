import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

/**
 * A MousePositionService is a service that distributes the mouse position within the pattern plots.
 */
@Injectable({
  providedIn: 'root'
})
export class MousePositionService {

  private patternMousePosition = new Subject<{ x: number, y: number }>();
  private patternClickPosition = new Subject<{ x: number, y: number }>();

  public patternMousePosition$ = this.patternMousePosition.asObservable();
  public patternClickPosition$ = this.patternClickPosition.asObservable();

  /**
   * Updates the current mouse position.
   * @param x - x position
   * @param y - y position
   */
  updatePatternMousePosition(x: number, y: number): void {
    this.patternMousePosition.next({x, y});
  }

  /**
   * Updates the current click position.
   * @param x - x position
   * @param y - y position
   */
  updatePatternClickPosition(x: number, y: number): void {
    this.patternClickPosition.next({x, y});
  }
}
