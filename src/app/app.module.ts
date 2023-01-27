import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParameterItemSimpleComponent } from './parameters/parameter-item-simple/parameter-item-simple.component';

@NgModule({
  declarations: [
    AppComponent,
    ParameterItemSimpleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
