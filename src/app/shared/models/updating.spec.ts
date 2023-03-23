import {GaussianModel} from "./peaks/gaussian.model";
import {updateFitModel, updateModel} from "./updating";
import {LorentzianModel} from "./peaks/lorentzian.model";
import {PseudoVoigtModel} from "./peaks/pseudo-voigt.model";
import {LinearModel} from "./bkg/linear.model";
import {QuadraticModel} from "./bkg/quadratic.model";
import {PolynomialModel} from "./bkg/polynomial.model";
import {FitModel} from "../data/fit-model";
import {Pattern} from "../data/pattern";

describe("Updating Models from backend JSON responses", () => {
  it("should update a gaussian model", () => {
    let peak = new GaussianModel();
    const peak_update_json = {
      "type": "Gaussian",
      "parameters": [
        {
          "name": "center",
          "value": 36,
        },
        {
          "name": "fwhm",
          "value": 1.3,
        },
        {
          "name": "amplitude",
          "value": 7.0,
        }
      ]
    }

    updateModel(peak, peak_update_json);
    expect(peak.getParameter("center").value).toEqual(36);
    expect(peak.getParameter("fwhm").value).toEqual(1.3);
    expect(peak.getParameter("amplitude").value).toEqual(7.0);
  });
  it("should throw an error if a parameter is missing", () => {
    let peak = new GaussianModel();
    const peak_update_json = {
      "type": "Gaussian",
      "parameters": [
        {
          "name": "center",
          "value": 36,
        },
        {
          "name": "fwhm",
          "value": 1.3,
        }
      ]
    }
    expect(() => updateModel(peak, peak_update_json)).toThrowError();
  });

  it("should throw an error if a parameter is not found", () => {
    let peak = new GaussianModel();
    const peak_update_json = {
      "type": "Gaussian",
      "parameters": [
        {
          "name": "center",
          "value": 36,
        },
        {
          "name": "fwhm",
          "value": 1.3,
        },
        {
          "name": "amplitude",
          "value": 7.0,
        },
        {
          "name": "Not a parameter",
          "value": 7.0,
        }
      ]
    }
    expect(() => updateModel(peak, peak_update_json)).toThrowError();
  });

  it("should throw an error if the number of parameters does not match", () => {
    let peak = new GaussianModel();
    const peak_update_json = {
      "type": "Gaussian",
      "parameters": [
        {
          "name": "center",
          "value": 36,
        },
        {
          "name": "fwhm",
          "value": 1.3,
        },
        {
          "name": "amplitude",
          "value": 7.0,
        },
        {
          "name": "Not a parameter",
          "value": 7.0,
        }
      ]
    }
    expect(() => updateModel(peak, peak_update_json)).toThrowError();
  });

  it("should throw an error if the type of the model does not match", () => {
    let peak = new GaussianModel();
    const peak_update_json = {
      "type": "Lorentzian",
      "parameters": [
        {
          "name": "center",
          "value": 36,
        },
        {
          "name": "fwhm",
          "value": 1.3,
        },
        {
          "name": "amplitude",
          "value": 7.0,
        }
      ]
    }
    expect(() => updateModel(peak, peak_update_json)).toThrowError();
  });

  it("should update a lorentzian model", () => {
    let peak = new LorentzianModel();
    const peak_update_json = {
      "type": "Lorentzian",
      "parameters": [
        {
          "name": "center",
          "value": 36,
        },
        {
          "name": "fwhm",
          "value": 1.3,
        },
        {
          "name": "amplitude",
          "value": 7.0,
        }
      ]
    }

    updateModel(peak, peak_update_json);
    expect(peak.getParameter("center").value).toEqual(36);
    expect(peak.getParameter("fwhm").value).toEqual(1.3);
    expect(peak.getParameter("amplitude").value).toEqual(7.0);
  });

  it("should update a pseudo voigt model", () => {
    let peak = new PseudoVoigtModel();
    const peak_update_json = {
      "type": "PseudoVoigt",
      "parameters": [
        {
          "name": "center",
          "value": 36,
        },
        {
          "name": "fwhm",
          "value": 1.3,
        },
        {
          "name": "amplitude",
          "value": 7.0,
        },
        {
          "name": "fraction",
          "value": 0.8,
        }
      ]
    }

    updateModel(peak, peak_update_json);
    expect(peak.getParameter("center").value).toEqual(36);
    expect(peak.getParameter("fwhm").value).toEqual(1.3);
    expect(peak.getParameter("amplitude").value).toEqual(7.0);
    expect(peak.getParameter("fraction").value).toEqual(0.8);
  });

  it("should update a linear background model", () => {
    let peak = new LinearModel();
    const peak_update_json = {
      "type": "linear",
      "parameters": [
        {
          "name": "intercept",
          "value": 36,
        },
        {
          "name": "slope",
          "value": 1.3,
        }
      ]
    }

    updateModel(peak, peak_update_json);
    expect(peak.getParameter("intercept").value).toEqual(36);
    expect(peak.getParameter("slope").value).toEqual(1.3);
  });

  it("should update a quadratic background model", () => {
    let peak = new QuadraticModel();
    const peak_update_json = {
      "type": "quadratic",
      "parameters": [
        {
          "name": "a",
          "value": 36,
        },
        {
          "name": "b",
          "value": 1.3,
        },
        {
          "name": "c",
          "value": 14,
        }
      ]
    }

    updateModel(peak, peak_update_json);
    expect(peak.getParameter("a").value).toEqual(36);
    expect(peak.getParameter("b").value).toEqual(1.3);
    expect(peak.getParameter("c").value).toEqual(14);
  });

  it("should update a polynomial background model", () => {
    let peak = new PolynomialModel(3);
    const peak_update_json = {
      "type": "polynomial",
      "parameters": [
        {
          "name": "c0",
          "value": 36,
        },
        {
          "name": "c1",
          "value": 1.3,
        },
        {
          "name": "c2",
          "value": 14,
        },
        {
          "name": "c3",
          "value": 12,
        }
      ]
    }

    updateModel(peak, peak_update_json);
    expect(peak.getParameter("c0").value).toEqual(36);
    expect(peak.getParameter("c1").value).toEqual(1.3);
    expect(peak.getParameter("c2").value).toEqual(14);
    expect(peak.getParameter("c3").value).toEqual(12);
  });

  it("throws an error if polynomial degree is different", () => {
    let peak = new PolynomialModel(4);
    const peak_update_json = {
      "type": "polynomial",
      "parameters": [
        {
          "name": "c0",
          "value": 36,
        },
        {
          "name": "c1",
          "value": 1.3,
        },
        {
          "name": "c2",
          "value": 14,
        },
        {
          "name": "c3",
          "value": 12,
        }
      ]
    }
    expect(() => updateModel(peak, peak_update_json)).toThrowError();
  });
});


describe("update a FitModel from backend JSON response", () => {
  it("should update a fit model", () => {
    const updateJson =
      {
        "background": {
          "type": "linear",
          "parameters": [
            {
              "name": "intercept",
              "value": 6.2,
            },
            {
              "name": "slope",
              "value": -0.12,
            }
          ]
        },
        "peaks": [
          {
            "type": "Gaussian",
            "parameters": [
              {
                "name": "center",
                "value": 36.2,
              },
              {
                "name": "fwhm",
                "value": 1.6,
              },
              {
                "name": "amplitude",
                "value": 7,
              }
            ]
          },
          {
            "type": "Gaussian",
            "parameters": [
              {
                "name": "center",
                "value": 46.6,
              },
              {
                "name": "fwhm",
                "value": 1.9,
              },
              {
                "name": "amplitude",
                "value": 7,
              }
            ]
          }
        ],
      }
    let fitModel = new FitModel(
      "lala",
      new Pattern("lala", [1, 2, 3], [1, 2, 3]),
      [new GaussianModel(), new GaussianModel()],
      new LinearModel(),
    );

    updateFitModel(fitModel, updateJson);
    expect(fitModel.background.getParameter("intercept").value).toEqual(6.2);
    expect(fitModel.background.getParameter("slope").value).toEqual(-0.12);
    expect(fitModel.peaks[0].getParameter("center").value).toEqual(36.2);
    expect(fitModel.peaks[0].getParameter("fwhm").value).toEqual(1.6);
    expect(fitModel.peaks[0].getParameter("amplitude").value).toEqual(7);
    expect(fitModel.peaks[1].getParameter("center").value).toEqual(46.6);
    expect(fitModel.peaks[1].getParameter("fwhm").value).toEqual(1.9);
    expect(fitModel.peaks[1].getParameter("amplitude").value).toEqual(7);
  });

  it(" should throw an error if the number of peaks is different", () => {
    const updateJson =
      {
        "background": {
          "type": "linear",
          "parameters": [
            {
              "name": "intercept",
              "value": 6.2,
            },
            {
              "name": "slope",
              "value": -0.12,
            }
          ]
        },
        "peaks": [
          {
            "type": "Gaussian",
            "parameters": [
              {
                "name": "center",
                "value": 36.2,
              },
              {
                "name": "fwhm",
                "value": 1.6,
              },
              {
                "name": "amplitude",
                "value": 7,
              }
            ]
          },
          {
            "type": "Gaussian",
            "parameters": [
              {
                "name": "center",
                "value": 46.6,
              },
              {
                "name": "fwhm",
                "value": 1.9,
              },
              {
                "name": "amplitude",
                "value": 7,
              }
            ]
          }
        ],
      }
    let fitModel = new FitModel(
      "lala",
      new Pattern("lala", [1, 2, 3], [1, 2, 3]),
      [new GaussianModel(), new GaussianModel(), new GaussianModel()],
      new LinearModel(),
    );
    expect(() => updateFitModel(fitModel, updateJson)).toThrowError("Number of peaks does not match");
    expect(fitModel.background.getParameter("intercept").value).not.toBe(6.2); // check that the model was not updated
  });

  fit("should update error values", () => {
    const updateJson =
      {
        "background": {
          "type": "linear",
          "parameters": [
            {
              "name": "intercept",
              "value": 6.2,
              "error": 0.1
            },
            {
              "name": "slope",
              "value": -0.12,
              "error": 0.2
            }
          ]
        },
        "peaks": [
          {
            "type": "Gaussian",
            "parameters": [
              {
                "name": "center",
                "value": 36.2,
                "error": 0.3
              },
              {
                "name": "fwhm",
                "value": 1.6,
                "error": 0.4
              },
              {
                "name": "amplitude",
                "value": 7,
                "error": 0.5
              }
            ]
          },
          {
            "type": "Gaussian",
            "parameters": [
              {
                "name": "center",
                "value": 46.6,
                "error": 0.6
              },
              {
                "name": "fwhm",
                "value": 1.9,
                "error": 0.7
              },
              {
                "name": "amplitude",
                "value": 7,
                "error": 0.8
              }
            ]
          }
        ],
      }
    let fitModel = new FitModel(
      "lala",
      new Pattern("lala", [1, 2, 3], [1, 2, 3]),
      [new GaussianModel(), new GaussianModel()],
      new LinearModel(),
    );
    updateFitModel(fitModel, updateJson);
    expect(fitModel.background.getParameter("intercept").error).toEqual(0.1);
    expect(fitModel.background.getParameter("slope").error).toEqual(0.2);
    expect(fitModel.peaks[0].getParameter("center").error).toEqual(0.3);
    expect(fitModel.peaks[0].getParameter("fwhm").error).toEqual(0.4);
    expect(fitModel.peaks[0].getParameter("amplitude").error).toEqual(0.5);
    expect(fitModel.peaks[1].getParameter("center").error).toEqual(0.6);
    expect(fitModel.peaks[1].getParameter("fwhm").error).toEqual(0.7);
    expect(fitModel.peaks[1].getParameter("amplitude").error).toEqual(0.8);

  });


});

