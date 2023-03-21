import {averageAroundIndex, indexOfSmallest} from "./util";

describe('indexOfSmallest', () => {
  it('finds the smallest index in array', () => {
    expect(indexOfSmallest([2, 3, 1, 4, 5])).toBe(2);
    expect(indexOfSmallest([1, 3, 3, 1, -5])).toBe(4);
    expect(indexOfSmallest([1, 1, 2, 2, 5])).toBe(0);
  })
})

describe('averageAroundIndex', () =>{
  it('finds the correct average', ()=> {
    expect(averageAroundIndex([2, 2, 3, 4, 5, 6], 3, 1)).toBe(4)
    expect(averageAroundIndex([2, 2, 3, 4, 5, 6], 3, 2)).toBe(4)
    expect(averageAroundIndex([2, 2, 3, 4, 5, 6], 0, 2)).toBe(7/3)
    expect(averageAroundIndex([1, 1, 3, 4, 5, 6], 5, 1)).toBe(11/2)
    expect(averageAroundIndex([1, 1, 3, 4, 5, 6], 5, 2)).toBe(15/3)
    expect(averageAroundIndex([1, 1, 3, 4, 5, 6], 4, 1)).toBe(15/3)
    expect(averageAroundIndex([1, 1, 3, 4, 5, 6], 4, 2)).toBe(18/4)
  })
})
