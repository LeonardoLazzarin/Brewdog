import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {RouterLink} from "@angular/router";
import { SearchBeerComponent } from './search-beer/search-beer.component';
import {FormsModule} from "@angular/forms";
import { BeerCardComponent } from './beer-card/beer-card.component';



@NgModule({
  declarations: [
    NavbarComponent,
    SearchBeerComponent,
    BeerCardComponent
  ],
    exports: [
        NavbarComponent,
        SearchBeerComponent,
        BeerCardComponent
    ],
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ]
})
export class SharedModule { }
