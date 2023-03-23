import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {OutputTableComponent} from "../../dialog/output-table/output-table.component";

@Component({
  selector: 'app-output-control',
  templateUrl: './output-control.component.html',
  styleUrls: ['./output-control.component.css']
})
export class OutputControlComponent {

  public output: string;

  constructor(public dialog: MatDialog) {
  }

  public openDialog(): void {
    this.dialog.open(OutputTableComponent, {width: '90%', hasBackdrop: true});
  }
}
