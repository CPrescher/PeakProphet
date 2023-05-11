import {Injectable} from '@angular/core';
import {Pattern} from "./data/pattern";
import {BehaviorSubject} from "rxjs";
import {setCurrentPattern} from "../plot/plot.actions";
import {Store} from "@ngrx/store";
import {PlotState} from "../plot/plot.reducers";


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

  constructor(public store: Store<PlotState>) {
  }

  setPattern(pattern: Pattern): void {
    this.patternSubject.next(pattern);
    this.store.dispatch(setCurrentPattern({pattern}))
  }

  clearPattern(): void {
    this.patternSubject.next(undefined);
    this.store.dispatch(setCurrentPattern({pattern: undefined}));
  }
}
