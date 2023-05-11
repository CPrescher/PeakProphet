import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromPlot from './plot.reducers';
import {plotReducer} from "./plot.reducers";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromPlot.plotFeatureKey, plotReducer)
  ]
})
export class PlotModule {
}
