import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParameterItemSimpleComponent } from './widgets/parameters/parameter-item-simple/parameter-item-simple.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import { MainViewComponent } from './views/main/main-view.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import { NumbersOnlyDirective } from './shared/directives/numbers-only.directive';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import { PeakItemComponent } from './widgets/peak-item/peak-item.component';
import {ModelService} from "./shared/model.service";
import { PeakControlComponent } from './widgets/peak-control/peak-control.component';
import { PlotComponent } from './widgets/plot/plot.component';
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";

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
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatInputModule,
        MatCardModule,
        MatCheckboxModule,
        MatSelectModule,
        FormsModule,
        MatTooltipModule
    ],
  providers: [ModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
