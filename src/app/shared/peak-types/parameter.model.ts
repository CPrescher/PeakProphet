export class Parameter {
  constructor(
    public name: string,
    public value: number = 0,
    public description: string = "",
    public fit: boolean = true,
    public min: number = -Infinity,
    public max: number = Infinity,
    public error: number = 0
  ) {
  }
}
