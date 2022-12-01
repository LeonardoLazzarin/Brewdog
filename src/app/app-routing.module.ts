import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./views/dashboard/dashboard.component";
import {BeerDetailsComponent} from "./views/beer-details/beer-details.component";
import {FavoritesComponent} from "./views/favorites/favorites.component";

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'beer/:id', component: BeerDetailsComponent },
  { path: 'favorite', component: FavoritesComponent },
  // Redirect all to Dashboard component
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
