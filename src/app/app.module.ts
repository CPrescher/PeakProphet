import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {MaterialsModule} from "./shared/gui/materials.module";

import {AppComponent} from './app.component';
import {ParameterItemSimpleComponent} from './widgets/parameters/parameter-item-simple/parameter-item-simple.component';
import {MainViewComponent} from './views/main/main-view.component';
import {NumbersOnlyDirective} from './shared/directives/numbers-only.directive';
import {PeakItemComponent} from './widgets/peak-item/peak-item.component';
import {PeakService} from "./shared/peak.service";
import {PeakControlComponent} from './widgets/peak-control/peak-control.component';
import {PlotComponent} from './widgets/plot/plot.component';
import { DataControlComponent } from './widgets/data-control/data-control.component';
import { BrowseIndexComponent } from './widgets/browse-index/browse-index.component';
import { BkgControlComponent } from './widgets/bkg-control/bkg-control.component';
import { MousePositionComponent } from './widgets/mouse-position/mouse-position.component';

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
    MousePositionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialsModule
  ],
  providers: [PeakService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
