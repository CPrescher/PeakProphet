import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MousePositionService {

  private patternMousePosition = new BehaviorSubject<{ x: number, y: number }>({x: 0, y: 0});
  private patternClickPosition = new BehaviorSubject<{ x: number, y: number }>({x: 0, y: 0});

  public patternMousePosition$ = this.patternMousePosition.asObservable();
  public patternClickPosition$ = this.patternClickPosition.asObservable();

  updatePatternMousePosition(x, y): void {
    this.patternMousePosition.next({x, y});
  }

  updatePatternClickPosition(x, y): void {
    this.patternClickPosition.next({x, y});
  }
}
