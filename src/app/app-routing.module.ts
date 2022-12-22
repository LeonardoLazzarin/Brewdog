import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./views/dashboard/dashboard.component";
import {BeerInfoComponent} from "./views/beer-info/beer-info.component";
import {FavoritesComponent} from "./views/favorites/favorites.component";

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'beer/:id', component: BeerInfoComponent },
  { path: 'favorites', component: FavoritesComponent },

  // Redirect all to Dashboard component
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
