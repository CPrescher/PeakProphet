import {Pattern} from "./pattern";
import {ClickModel, GuessModel} from "../models/model.interface";
import {FitRequest} from "./fit-request";
import {Observable, Subject} from "rxjs";
import {updateFitModel} from "../models/updating";

/**
 * A FitModel is a Pattern with a list of peaks and a background model.
 */
export class FitModel {

  public fitRequest: FitRequest;

  public fitting: Boolean = false;
  public fitSuccess: Boolean = false;
  public fitMessage: string = ""

  constructor(
    public name: string,
    public pattern: Pattern,
    public peaks: ClickModel[],
    public background: GuessModel,
  ) {
    this.fitRequest = new FitRequest(this);
  }

  public fit(): [Observable<any>, Observable<any>, Subject<void>] {

    this.fitting = true;
    let [result$, progress$, stopper$] = this.fitRequest.fit()

    progress$.subscribe((payload) => {
      updateFitModel(this, payload.result);
    });

    result$.subscribe((payload) => {
      updateFitModel(this, payload.result);
      this.fitting = false;
      this.fitMessage = payload.message;
      this.fitSuccess = payload.success;
    })

    stopper$.subscribe(() => {
      this.fitMessage = "Fit stopped by user";
    })

    return [result$, progress$, stopper$]
  }
}

export function convertToOutputRow(fitModel: FitModel): any {
  let outputRow = {
    name: fitModel.name,
  };
  fitModel.peaks.forEach((peak: ClickModel, index) => {
    outputRow[`p${index + 1}_type`] = peak.type;
    outputRow[`p${index + 1}_center`] = peak.getParameter("center").value;
    outputRow[`p${index + 1}_center_error`] = peak.getParameter("center").error;
    outputRow[`p${index + 1}_fwhm`] = peak.getParameter("fwhm").value;
    outputRow[`p${index + 1}_fwhm_error`] = peak.getParameter("fwhm").error;
    outputRow[`p${index + 1}_amplitude`] = peak.getParameter("amplitude").value;
    outputRow[`p${index + 1}_amplitude_error`] = peak.getParameter("amplitude").error;
    try {
      outputRow[`p${index + 1}_fraction`] = peak.getParameter("fraction").value;
      outputRow[`p${index + 1}_fraction_error`] = peak.getParameter("fraction").error;
    } catch (e) {
    }
  });
  return outputRow;

}
