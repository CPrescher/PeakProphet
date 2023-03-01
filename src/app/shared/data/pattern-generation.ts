import {GaussianModel} from "../peak-types/gaussian.model";
import {Model} from "../peak-types/model.interface";
import {Pattern} from "./pattern";

function createRandomGaussian(positionRange: [number, number] = [10, 20],
                              fwhmRange: [number, number] = [0.5, 2],
                              intensityRange: [number, number] = [1, 20]) {
  const position = positionRange[0] + Math.random() * (positionRange[1] - positionRange[0]);
  const fwhm = fwhmRange[0] + Math.random() * (fwhmRange[1] - fwhmRange[0]);
  const intensity = intensityRange[0] + Math.random() * (intensityRange[1] - intensityRange[0]);
  return new GaussianModel(position, fwhm, intensity);
}

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
