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

@NgModule({
  declarations: [
    AppComponent,
    PlugTripletVisualiserComponent,
    PlugCombinationVisualiserComponent,
    VarDirectiveDirective
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    FormsModule, MatRadioModule, MatCheckboxModule,
    MatTooltipModule, MatCardModule, MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
