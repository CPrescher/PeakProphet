import {Component, OnDestroy, OnInit} from '@angular/core';

import {FitModelService} from "../../../shared/fit-model.service";
import {convertToOutputRow} from "../../../shared/data/fit-model";

@Component({
  selector: 'app-output-table',
  templateUrl: './output-table.component.html',
  styleUrls: ['./output-table.component.css']
})
export class OutputTableComponent implements OnInit, OnDestroy {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = [...ELEMENT_DATA];

  displayedColumns: string[] = []
  dataSource: any[] = []

  sub: any;

  constructor(
    public fitModelService: FitModelService
  ) {

  }

  ngOnInit(): void {
    this.sub = this.fitModelService.fitModels$.subscribe((fitModels) => {
      let output: any[] = [];
      let peakNum = 0;
      for (let i = 0; i < fitModels.length; i++) {
        peakNum = fitModels[i].peaks.length > peakNum ? fitModels[i].peaks.length : peakNum;
        let row = convertToOutputRow(fitModels[i]);
        output.push(row);
      }

      let displayedColumns: string[] = [];
      displayedColumns.push('name');
      for (let i = 1; i < peakNum + 1; i++) {
        displayedColumns.push(`p${i}_type`);
        displayedColumns.push(`p${i}_center`);
        displayedColumns.push(`p${i}_center_error`);
        displayedColumns.push(`p${i}_fwhm`);
        displayedColumns.push(`p${i}_fwhm_error`);
        displayedColumns.push(`p${i}_amplitude`);
        displayedColumns.push(`p${i}_amplitude_error`);
        displayedColumns.push(`p${i}_fraction`);
        displayedColumns.push(`p${i}_fraction_error`);
      }


      displayedColumns.push('bkg_type');
      let bkgParamsNum = 0;
      fitModels.forEach((fitModel) => {
        bkgParamsNum = fitModel.background.parameters.length > bkgParamsNum ?
          fitModel.background.parameters.length : bkgParamsNum;
      })

      for (let i = 1; i < bkgParamsNum + 1; i++) {
        displayedColumns.push(`bkg_p${i}`);
        displayedColumns.push(`bkg_p${i}_error`);
      }

      this.displayedColumns = displayedColumns
      this.dataSource = output;
    });
  }

  convertColumnNameToLabel(columnName: string): string {
    //if contains error convert to sigma
    if (columnName.includes('error')) {
      return "\u03C3"; //sigma
    }
    if (columnName.includes('bkg_type')) {
      return "Background";
    }
    if (columnName.includes('bkg')) {
      return columnName.split('_')[1].replace("p", "p ")
    }

    if (columnName.includes('type')) {
      return columnName.split('_')[0].replace("p", "Peak ")
    }
    return columnName.split('_')[1]
      .replace("amplitude", "amp")
      .replace("fraction", "frac")
      .replace("center", "cen")
  }


  ngOnDestroy():
    void {
    this.sub.unsubscribe();
  }
}
