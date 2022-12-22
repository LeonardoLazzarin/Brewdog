import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {PunkService} from "./services/punk.service";
import {HttpClientModule} from "@angular/common/http";
import { DashboardComponent } from './views/dashboard/dashboard.component';
import {SharedModule} from "./shared/shared.module";
import { BeerInfoComponent } from './views/beer-info/beer-info.component';
import { FavoritesComponent } from './views/favorites/favorites.component';
import {RestService} from "./services/rest.service";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BeerInfoComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    RestService,
    PunkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
