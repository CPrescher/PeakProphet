import {Model} from "../models/model.interface";
import {Pattern} from "./pattern";
import {createRandomGaussian} from "./peak-generation";

/**
 * Create a random pattern with a given number of peaks and noise level
 * @param name - name of the pattern
 * @param numPeaks - number of peaks
 * @param xRange - range of x values
 * @param numPoints - number of points in the pattern
 * @param noise - noise level around the y values (standard deviation of the gaussian noise)
 */
export function createRandomPattern(
  name: string,
  numPeaks: number,
  xRange: [number, number] = [0, 30],
  numPoints: number = 500,
  noise: number = 0.2
) {
  const peaks: Model[] = []
  for (let i = 0; i < numPeaks; i++) {
    peaks.push(createRandomGaussian(xRange));
  }
  const xData = new Array(numPoints).fill(0).map((v, i) => xRange[0] + i * (xRange[1] - xRange[0]) / numPoints);
  let yData = xData.map(x => peaks.map(p => p.evaluate([x])[0]).reduce((a, b) => a + b, 0));
  yData = yData.map(y => y + gaussianRandom(0, noise))
  return new Pattern(name, xData, yData);
}

/**
 * Creates random gaussian values around a given mean and standard deviation
 * @param mean - mean of the gaussian distribution
 * @param std - standard deviation of the gaussian distribution
 */
function gaussianRandom(mean=0, std=1) {
  let u = 1 - Math.random(); // Converting [0,1) to (0,1]
  let v = Math.random();
  let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  // Transform to the desired mean and standard deviation:
  return z * std + mean;
}
