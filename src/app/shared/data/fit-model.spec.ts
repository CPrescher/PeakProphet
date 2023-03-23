import {convertToOutputRow, FitModel} from "./fit-model";
import {Pattern} from "./pattern";
import {GaussianModel} from "../models/peaks/gaussian.model";
import {LinearModel} from "../models/bkg/linear.model";
import {LorentzianModel} from "../models/peaks/lorentzian.model";
import {PseudoVoigtModel} from "../models/peaks/pseudo-voigt.model";

describe('convert To Output row', () => {
  it('should convert to output row',
    () => {
      let fitModel = new FitModel(
        'test',
        new Pattern("", [1, 2, 3], [1, 2, 3]),
        [
          new GaussianModel(0, 1, 10),
          new LorentzianModel(2, 4, 20),
          new PseudoVoigtModel(3, 5, 30, 0.5),
        ],
        new LinearModel());

      let outputRow = convertToOutputRow(fitModel);
      expect(outputRow).toEqual({
        name: 'test',
        p1_type: 'Gaussian',
        p1_center: 0,
        p1_center_error: 0,
        p1_fwhm: 1,
        p1_fwhm_error: 0,
        p1_amplitude: 10,
        p1_amplitude_error: 0,
        p2_type: 'Lorentzian',
        p2_center: 2,
        p2_center_error: 0,
        p2_fwhm: 4,
        p2_fwhm_error: 0,
        p2_amplitude: 20,
        p2_amplitude_error: 0,
        p3_type: 'PseudoVoigt',
        p3_center: 3,
        p3_center_error: 0,
        p3_fwhm: 5,
        p3_fwhm_error: 0,
        p3_amplitude: 30,
        p3_amplitude_error: 0,
        p3_fraction: 0.5,
        p3_fraction_error: 0
      })
    })
})
