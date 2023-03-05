import {readXY} from "./input";

describe('readXY', () => {
  it('should return x and y', () => {
    const data = `# comment
    1.0 2.0
    2.0 3.0
    3.0 4.0`;
    const result = readXY(data);
    expect(result.x).toEqual([1.0, 2.0, 3.0]);
    expect(result.y).toEqual([2.0, 3.0, 4.0]);
  });

  it('should handle missing y values', () => {
    const data = `# comment
    1.0 2.0
    2.0 3.0
    3.0`;
    const result = readXY(data);
    expect(result.x).toEqual([1.0, 2.0]);
    expect(result.y).toEqual([2.0, 3.0]);
  });

  it('should handle NaN values', () => {
    const data = `# comment
    1.0 NaN
    2.0 3.0
    3.0 4.0`;
    const result = readXY(data);
    expect(result.x).toEqual([2.0, 3.0]);
    expect(result.y).toEqual([3.0, 4.0]);
  });


  it('should throw error for empty data', () => {
    const data = `# comment`;
    expect(() => readXY(data)).toThrowError();
  });

  it("should skip comments", () => {
    const data = `# comment
    @ comment
    1.0 2.0
    # comment
    2.0 3.0
    @ comment
    3.0 4.0`;
    const result = readXY(data);
    expect(result.x).toEqual([1.0, 2.0, 3.0]);
    expect(result.y).toEqual([2.0, 3.0, 4.0]);
  });
});
