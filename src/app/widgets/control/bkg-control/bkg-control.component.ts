import {Component, OnInit} from '@angular/core';
import {BkgService} from "../../../shared/bkg.service";

@Component({
  selector: 'app-bkg-control',
  templateUrl: './bkg-control.component.html',
  styleUrls: ['./bkg-control.component.css']
})
export class BkgControlComponent implements OnInit {

  public selectedBkgType: string = 'linear';
  public bkgTypes;

  constructor(private bkgService: BkgService) {
    this.bkgTypes =Object.keys(this.bkgService.bkgTypes);
  }

  ngOnInit() {
    this.bkgService.bkgModel$.subscribe((bkgModel) => {
      if (bkgModel) {
        this.selectedBkgType = bkgModel.name;
      }
    });
  }

  bkgSelected(bkgType: string): void {
    this.bkgService.selectBkgType(bkgType);
  }
}
