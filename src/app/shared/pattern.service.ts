import {Injectable} from '@angular/core';
import {Pattern} from "./data/pattern";
import {BehaviorSubject} from "rxjs";


/**
 * A PatternService is a service that manages the pattern.
 * It enables changing the pattern, and updates the current pattern.
 */
@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private patternSubject = new BehaviorSubject<Pattern | undefined>(undefined);
  public pattern$ = this.patternSubject.asObservable();

  constructor() {
  }

  setPattern(pattern: Pattern): void {
    this.patternSubject.next(pattern);
  }

  clearPattern(): void {
    this.patternSubject.next(undefined);
  }
}
