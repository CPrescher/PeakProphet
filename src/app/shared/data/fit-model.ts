import {Pattern} from "./pattern";
import {ClickModel, GuessModel} from "../models/model.interface";
import {FitRequest} from "./fit-request";
import {Observable, Subject, Subscription} from "rxjs";
import {updateFitModelParameters} from "../models/updating";

/**
 * A FitModel is a Pattern with a list of peaks and a background model.
 */
export class FitModel {

  public fitRequest: FitRequest;

  public fitting: Boolean = false;
  public fitSuccess: Boolean = false;
  public fitMessage: string = ""

  private resultSubscription = new Subscription();
  private progressSubscription = new Subscription();
  private stopperSubscription = new Subscription();

  constructor(
    public name: string,
    public pattern: Pattern,
    public peaks: ClickModel[],
    public background: GuessModel,
  ) {
    this.fitRequest = new FitRequest(this);
  }

  public fit(): [Observable<any>, Observable<any>, Subject<void>] {
    this.resetSubscriptions();

    this.fitting = true;
    let [result$, progress$, stopper$] = this.fitRequest.fit()

    this.progressSubscription = progress$.subscribe((payload) => {
      updateFitModelParameters(this, payload.result);
    });

    this.resultSubscription = result$.subscribe((payload) => {
      updateFitModelParameters(this, payload.result);
      this.fitting = false;
      this.fitMessage = payload.message;
      this.fitSuccess = payload.success;
      this.resetSubscriptions();
    })

    this.stopperSubscription = stopper$.subscribe(() => {
      this.fitting = false;
      this.fitMessage = "Fit stopped by user";
      this.fitSuccess = false;
      this.resetSubscriptions();
    })

    return [result$, progress$, stopper$]
  }

  private resetSubscriptions() {
    this.resultSubscription.unsubscribe();
    this.progressSubscription.unsubscribe();
    this.stopperSubscription.unsubscribe();
  }
}

export function convertToOutputRow(fitModel: FitModel): any {
  let outputRow = {
    name: fitModel.name,
  };
  outputRow["bkg_type"] = fitModel.background.type;
  for (let i = 0; i < fitModel.background.parameters.length; i++) {
    outputRow[`bkg_p${i + 1}`] = fitModel.background.parameters[i].value;
    outputRow[`bkg_p${i + 1}_error`] = fitModel.background.parameters[i].error;
  }

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
