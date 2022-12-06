import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Beer} from "../../modules/beer";
import {PunkService} from "../../services/punk.service";
import {Router} from "@angular/router";
import {ConsoleLoggerService} from "../../services/console-logger.service";

@Component({
  selector: 'app-beer-card',
  templateUrl: './beer-card.component.html',
  styleUrls: ['./beer-card.component.css']
})
export class BeerCardComponent implements OnInit {

  @Input()
  beer: Beer | null;

  @Output()
  onRemoveFavorite = new EventEmitter<Beer>();

  @Output()
  onAddFavorite = new EventEmitter<Beer>();

  constructor(
    private router: Router,
    private punk: PunkService,
    private logger: ConsoleLoggerService
  ) {
    this.beer = null;
  }

  ngOnInit() {

  }

  /**
   * Get favorite condition
   */
  get isFavorite(): boolean {
    if (this.beer == null) {
      return false;
    }
    return this.punk.isFavorite(this.beer);
  }

  /**
   * Set favorite for beer passed
   */
  setFavorite() {
    if (this.beer == null){
      return;
    }

    if (this.isFavorite) {
      this.punk.removeFavorite(this.beer);
      this.onRemoveFavorite.emit(this.beer);
    } else {
      this.punk.addFavorite(this.beer);
      this.onAddFavorite.emit(this.beer);
    }
  }

  /**
   * Open beer info
   */
  navigateToBeerDetail() {
    this.router.navigateByUrl('/beer/' + this.beer?.id).then(r => {
      if (!r.valueOf()) {
        // Invalid url
        this.logger.error('Invalid url');
      }
    });
  }

}
