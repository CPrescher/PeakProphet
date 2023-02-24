import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {MaterialsModule} from "./shared/gui/materials.module";

import {AppComponent} from './app.component';
import {ParameterItemSimpleComponent} from './widgets/parameters/parameter-item-simple/parameter-item-simple.component';
import {MainViewComponent} from './views/main/main-view.component';
import {NumbersOnlyDirective} from './shared/directives/numbers-only.directive';
import {PeakItemComponent} from './widgets/peak-item/peak-item.component';
import {ModelService} from "./shared/model.service";
import {PeakControlComponent} from './widgets/peak-control/peak-control.component';
import {PlotComponent} from './widgets/plot/plot.component';

@NgModule({
  declarations: [
    AppComponent,
    ParameterItemSimpleComponent,
    MainViewComponent,
    NumbersOnlyDirective,
    PeakItemComponent,
    PeakControlComponent,
    PlotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialsModule
  ],
  providers: [ModelService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
