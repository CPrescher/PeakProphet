import {TestBed} from '@angular/core/testing';

import {PatternService} from './pattern.service';

describe('PatternService', () => {
  let service: PatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternService);
  });

  it('should add a new pattern', () => {
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
    expect(service.patterns.length).toBe(1);
  });

  it("should add a new pattern with the correct name", () => {
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
    expect(service.patterns[0].name).toBe('test');
  });

  it("should add a new pattern with the correct x values", () => {
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
    expect(service.patterns[0].x).toEqual([1, 2, 3]);
  });

  it("should add a new pattern with the correct y values", () => {
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
    expect(service.patterns[0].y).toEqual([4, 5, 6]);
  });

  it("removes a pattern", () => {
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
    service.removePattern(0);
    expect(service.patterns.length).toBe(0);
  });

  function populatePatternService(service: PatternService) {
    service.addPattern('test1', [1, 2, 3], [4, 5, 6]);
    service.addPattern('test2', [1, 2, 3], [4, 5, 6]);
    service.addPattern('test3', [1, 2, 3], [4, 5, 6]);
  }

  it("removes the correct pattern", () => {
    populatePatternService(service);
    service.removePattern(1);
    expect(service.patterns.length).toBe(2);
    expect(service.patterns[0].name).toBe('test1');
    expect(service.patterns[1].name).toBe('test3');
  });

  it("selects a pattern", () => {
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
    service.selectPattern(0);
    expect(service.selectedPattern.name).toBe('test');
  });

  it("selects the correct pattern", () => {
    populatePatternService(service);
    service.selectPattern(1);
    expect(service.selectedPattern.name).toBe('test2');
  });

  it("throws an error when selecting a pattern that does not exist", () => {
    populatePatternService(service);
    expect(() => service.selectPattern(3)).toThrowError("Cannot select pattern at index 3, it does not exist");
  });

  it("throws an error when selecting a pattern with a negative index", () => {
    populatePatternService(service);
    expect(() => service.selectPattern(-1)).toThrowError("Cannot select pattern at index -1, it does not exist");
  });

  it("throws an error when selecting a pattern with a non-integer index", () => {
    populatePatternService(service);
    expect(() => service.selectPattern(1.5)).toThrowError("Cannot select pattern at index 1.5, it does not exist");
  });

  it("pattern subject is updated when pattern is selected", (done: DoneFn) => {
    populatePatternService(service);
    service.selectedSubject.subscribe(pattern => {
      expect(pattern.name).toBe('test2');
      done();
    });
    service.selectPattern(1);
  });

  it("index subject is updated when pattern is added", (done: DoneFn) => {
    populatePatternService(service);
    service.selectedIndexSubject.subscribe(index => {
      expect(index).toBe(1);
      expect(service.patterns[index].name).toBe('test2');
      done();
    });
    service.selectPattern(1);
  });

  it("index subject is updated when pattern is removed", (done: DoneFn) => {
    populatePatternService(service);
    service.selectPattern(2);
    service.selectedIndexSubject.subscribe(index => {
      expect(index).toBe(1);
      expect(service.patterns[index].name).toBe('test2');
      done();
    });
    service.removePattern(2);
  });

  it("updates selected subject when pattern is added", (done: DoneFn) => {
    service.selectedSubject.subscribe(pattern => {
      expect(pattern.name).toBe('test');
      done();
    });
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
  });

  it("updates selected Index subject when pattern is added", (done: DoneFn) => {
    service.selectedIndexSubject.subscribe(index => {
      expect(index).toBe(0);
      done();
    });
    service.addPattern('test', [1, 2, 3], [4, 5, 6]);
  });
});
