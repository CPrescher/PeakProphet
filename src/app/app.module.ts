import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {MaterialsModule} from "./shared/gui/materials.module";

import {AppComponent} from './app.component';
import {ParameterItemSimpleComponent} from './widgets/inline/parameter-item-simple/parameter-item-simple.component';
import {MainViewComponent} from './views/main/main-view.component';
import {NumbersOnlyDirective} from './shared/directives/numbers-only.directive';
import {PeakItemComponent} from './widgets/control/peak-item/peak-item.component';
import {PeakService} from "./shared/peak.service";
import {PeakControlComponent} from './widgets/control/peak-control/peak-control.component';
import {PlotComponent} from './widgets/display/plot/plot.component';
import {DataControlComponent} from './widgets/control/data-control/data-control.component';
import {BrowseIndexComponent} from './widgets/inline/browse-index/browse-index.component';
import {BkgControlComponent} from './widgets/control/bkg-control/bkg-control.component';
import {MousePositionComponent} from './widgets/display/mouse-position/mouse-position.component';
import {FitControlComponent} from './widgets/control/fit-control/fit-control.component';
import {ProgressCircleComponent} from './widgets/inline/progress-circle/progress-circle.component';
import {OutputControlComponent} from './widgets/control/output-control/output-control.component';
import {OutputTableComponent} from './widgets/dialog/output-table/output-table.component';

@NgModule({
  declarations: [
    AppComponent,
    ParameterItemSimpleComponent,
    MainViewComponent,
    NumbersOnlyDirective,
    PeakItemComponent,
    PeakControlComponent,
    PlotComponent,
    DataControlComponent,
    BrowseIndexComponent,
    BkgControlComponent,
    MousePositionComponent,
    FitControlComponent,
    ProgressCircleComponent,
    OutputControlComponent,
    OutputTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialsModule
  ],
  providers: [
    PeakService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
