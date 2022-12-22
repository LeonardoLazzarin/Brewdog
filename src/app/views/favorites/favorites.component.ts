import {Component, OnInit} from '@angular/core';
import {Beer} from "../../modules/beer";
import {PunkService} from "../../services/punk.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  public favorites: Beer[];

  constructor(
    private punk: PunkService
  ) {
    this.favorites = [];
  }

  ngOnInit(): void {
    this.favorites = this.punk.allFavoriteBeers;
  }

  /**
   * Remove beer from favorite view
   * @param beer The beer to remove
   */
  onRemoveFavorite(beer: Beer) {
    const index = this.favorites.findIndex(f => f.id === beer.id);
    if (index > -1) {
      // Remove it from array
      this.favorites.splice(index, 1);
    }
  }

}
