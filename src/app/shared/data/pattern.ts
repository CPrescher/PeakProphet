export class Pattern {
  constructor(
    public name: string = "",
    public x: number[],
    public y: number[],
  ) {
  }

  setData(x: number[], y: number[]): void {
    this.x = x;
    this.y = y;
  }

}
