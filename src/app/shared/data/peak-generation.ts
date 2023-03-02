import {GaussianModel} from "../models/peaks/gaussian.model";

export function createRandomGaussian(positionRange: [number, number] = [0, 100],
                                     fwhmRange: [number, number] = [0.5, 2],
                                     intensityRange: [number, number] = [1, 20]) {
  const position = positionRange[0] + Math.random() * (positionRange[1] - positionRange[0]);
  const fwhm = fwhmRange[0] + Math.random() * (fwhmRange[1] - fwhmRange[0]);
  const intensity = intensityRange[0] + Math.random() * (intensityRange[1] - intensityRange[0]);
  return new GaussianModel(position, fwhm, intensity);
}
