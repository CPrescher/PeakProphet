import {Component, OnDestroy, OnInit} from '@angular/core';
import {BkgService} from "../../../shared/bkg.service";

@Component({
    selector: 'app-bkg-control',
    templateUrl: './bkg-control.component.html',
    styleUrls: ['./bkg-control.component.css'],
    standalone: false
})
export class BkgControlComponent implements OnInit, OnDestroy {

  public selectedBkgType: string = 'linear';
  public bkgTypes;
  private _bkgSubscription;

  constructor(private bkgService: BkgService) {
    this.bkgTypes = Object.keys(this.bkgService.bkgTypes);
  }

  ngOnInit() {
    this._bkgSubscription = this.bkgService.bkgModel$.subscribe((bkgModel) => {
      if (bkgModel) {
        this.selectedBkgType = bkgModel.type;
      }
    });
  }

  ngOnDestroy() {
    this._bkgSubscription.unsubscribe();
  }

  bkgSelected(bkgType: string): void {
    this.bkgService.selectBkgType(bkgType);
  }
}
