import {TestBed} from '@angular/core/testing';

import {PatternService} from './pattern.service';
import {Pattern} from "./data/pattern";

describe('PatternService', () => {
  let service: PatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternService);

  });

  it("sends signal when pattern is loaded", () => {
    const pattern = new Pattern("test", [1, 2, 3], [2, 3.0, 4.0]);
    service.setPattern(pattern);
    service.pattern$.subscribe(pattern => {
      expect(pattern).toEqual(new Pattern("test", [1, 2, 3], [2, 3.0, 4.0]));
    });

  });
  it ("sends undefined signal when pattern is cleared", () => {
    const pattern = new Pattern("test", [1, 2, 3], [2, 3.0, 4.0]);
    service.setPattern(pattern);
    service.clearPattern();
    service.pattern$.subscribe(pattern => {
      expect(pattern).toEqual(undefined);
    });
  });
});
