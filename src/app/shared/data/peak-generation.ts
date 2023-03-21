import {GaussianModel} from "../models/peaks/gaussian.model";


/**
 * Create a random Gaussian peak, with parameters inside the given ranges.
 * @param positionRange - range of the position
 * @param fwhmRange - range of the FWHM
 * @param intensityRange - range of the intensity
 */
export function createRandomGaussian(positionRange: [number, number] = [0, 100],
                                     fwhmRange: [number, number] = [0.5, 2],
                                     intensityRange: [number, number] = [1, 20]) {
  const position = positionRange[0] + Math.random() * (positionRange[1] - positionRange[0]);
  const fwhm = fwhmRange[0] + Math.random() * (fwhmRange[1] - fwhmRange[0]);
  const intensity = intensityRange[0] + Math.random() * (intensityRange[1] - intensityRange[0]);
  return new GaussianModel(position, fwhm, intensity);
}
