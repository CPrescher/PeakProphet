import {Injectable} from '@angular/core';
import {Pattern} from "./pattern";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  public patterns: Pattern[] = [];
  public selectedPattern: Pattern;
  public selectedIndex: number;
  public selectedIndexSubject = new Subject<number>();
  public selectedSubject = new Subject<Pattern>();

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
    } else if(index < this.patterns.length) {
      this.selectPattern(index);
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
}

function isInt(value) {
  let x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}
