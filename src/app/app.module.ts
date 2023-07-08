import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlugTripletVisualiserComponent } from './components/plug-triplet-visualiser/plug-triplet-visualiser.component';
import { PlugCombinationVisualiserComponent } from './components/plug-combination-visualiser/plug-combination-visualiser.component';
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCardModule} from "@angular/material/card";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {VarDirectiveDirective} from "./directive/var-directive.directive";
import {MatSliderModule} from "@angular/material/slider";
import { PlugStatisticsOverviewComponent } from './components/plug-statistics-overview/plug-statistics-overview.component';
import {NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    PlugTripletVisualiserComponent,
    PlugCombinationVisualiserComponent,
    VarDirectiveDirective,
    PlugStatisticsOverviewComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    FormsModule, MatRadioModule, MatCheckboxModule,
    MatTooltipModule, MatCardModule, MatButtonToggleModule, MatSliderModule, NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
