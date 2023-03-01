import {Injectable} from '@angular/core';
import {Pattern} from "./data/pattern";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  public patterns: Pattern[] = [];
  public selectedPattern: Pattern;
  public selectedIndex: number;
  private selectedIndexSubject = new BehaviorSubject<number | undefined>(undefined);
  public selectedIndex$ = this.selectedIndexSubject.asObservable();
  private selectedSubject = new BehaviorSubject<Pattern | undefined>(undefined);
  public selected$ = this.selectedSubject.asObservable();
  private clearSubject = new Subject<void>();
  public clear$ = this.clearSubject.asObservable();

  constructor() {
  }

  addPattern(name: string, x: number[], y: number[]): void {
    this.patterns.push(new Pattern(name, x, y));
    this.selectPattern(this.patterns.length - 1);
  }

  removePattern(index: number): void {
    this.patterns.splice(index, 1);
    if (index === this.patterns.length && index > 0) {
      this.selectPattern(index - 1);
    } else if (index < this.patterns.length) {
      this.selectPattern(index);
    }
    if (this.patterns.length === 0) {
      this.clearSubject.next();
    }
  }

  selectPattern(index: number): void {
    if (index < this.patterns.length && index >= 0 && isInt(index)) {
      this.selectedIndex = index;
      this.selectedPattern = this.patterns[index];
      this.selectedSubject.next(this.selectedPattern);
      this.selectedIndexSubject.next(this.selectedIndex);
    } else {
      throw new Error(`Cannot select pattern at index ${index}, it does not exist`);
    }
  }

  clearPatterns(): void {
    this.patterns = [];
    this.clearSubject.next();
  }
}

function isInt(value) {
  let x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}
