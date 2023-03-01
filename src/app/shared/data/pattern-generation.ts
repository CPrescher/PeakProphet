import {Model} from "../peak-types/model.interface";
import {Pattern} from "./pattern";
import {createRandomGaussian} from "./peak-generation";

export function createRandomPattern(
  name: string,
  nPeaks: number,
  xRange: [number, number] = [0, 30],
  xNum: number = 500,
  noise: number = 2
) {
  const peaks: Model[] = []
  for (let i = 0; i < nPeaks; i++) {
    peaks.push(createRandomGaussian(xRange));
  }
  const xData = new Array(xNum).fill(0).map((v, i) => xRange[0] + i * (xRange[1] - xRange[0]) / xNum);
  let yData = xData.map(x => peaks.map(p => p.evaluate([x])[0]).reduce((a, b) => a + b, 0));
  yData = yData.map(y => y + noise * (Math.random() - 0.5));
  return new Pattern(name, xData, yData);
}
