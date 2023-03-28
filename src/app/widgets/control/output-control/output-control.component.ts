import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {OutputTableComponent} from "../../dialog/output-table/output-table.component";
import {FitModelService} from "../../../shared/fit-model.service";
import {convertToOutputRow, FitModel} from "../../../shared/data/fit-model";

@Component({
  selector: 'app-output-control',
  templateUrl: './output-control.component.html',
  styleUrls: ['./output-control.component.css']
})
export class OutputControlComponent {

  public output: string;

  constructor(
    public dialog: MatDialog,
    private fitModelService: FitModelService) {
  }

  public openTableDialog(): void {
    this.dialog.open(OutputTableComponent, {width: '90%', hasBackdrop: true});
  }

  public saveCSV(): void {
    this.output = convertToCSV(this.fitModelService.fitModels);
    download(this.output, "output.csv", "text/csv");
  };
}


// Function to download data to a file
function download(data, filename, type) {
  let file = new Blob([data], {type: type});
  if ((window.navigator as any).msSaveOrOpenBlob) // IE10+
    (window.navigator as any).msSaveOrOpenBlob(file, filename);
  else { // Others
    let a = document.createElement("a");
    let url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function convertToCSV(fitModels: FitModel[]): string {
  let tableRows: string[] = [];
  let peakNum = 0;

  for (let i = 0; i < fitModels.length; i++) {
    peakNum = fitModels[i].peaks.length > peakNum ? fitModels[i].peaks.length : peakNum;
    tableRows.push(convertToOutputRow(fitModels[i]));
  }

  let headerRow: string[] = [];
  headerRow.push('name');
  for (let i = 1; i < peakNum + 1; i++) {
    headerRow.push(`p${i}_type`);
    headerRow.push(`p${i}_center`);
    headerRow.push(`p${i}_center_error`);
    headerRow.push(`p${i}_fwhm`);
    headerRow.push(`p${i}_fwhm_error`);
    headerRow.push(`p${i}_amplitude`);
    headerRow.push(`p${i}_amplitude_error`);
    headerRow.push(`p${i}_fraction`);
    headerRow.push(`p${i}_fraction_error`);
  }

  let str = '';
  str += headerRow.join(',') + '\r\n';

  tableRows.forEach((row) => {
    let line = '';
    headerRow.forEach((index) => {
      if (line != '') line += ','
      line += row[index] ? row[index] : '';
    })
    str += line + '\r\n';
  });
  return str;
}
