import {Component, OnDestroy, OnInit} from '@angular/core';
import {PunkService} from "../../services/punk.service";
import {ConsoleLoggerService} from "../../services/console-logger.service";
import {Subject, takeUntil} from "rxjs";
import {Beer} from "../../modules/beer";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-beer-info',
  templateUrl: './beer-info.component.html',
  styleUrls: ['./beer-info.component.css']
})
export class BeerInfoComponent implements OnInit, OnDestroy {

  subscribe: Subject<void>;

  isLoading: boolean;
  error: string | null;

  id: number;
  random: boolean;
  beer: Beer | null;

  readonly notDefinedValue: string = 'N.D';

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private punk: PunkService,
    private logger: ConsoleLoggerService
  ) {
    this.subscribe = new Subject<void>();
    this.isLoading = true;
    this.error = null;
    this.id = -1;
    this.random = false;
    this.beer = null;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;
    this.beer = null;

    this.getBeerIdFromRoute();
    this.getBeerInfo();
  }

  /**
   * Save the beer id find on route
   */
  getBeerIdFromRoute() {
    // Reset values
    this.id = -1;
    this.random = false;

    // Check if is required a random beer
    if (this.router.url === '/random') {
      this.random = true;
      return;
    }

    // Convert id in number
    const beerIdString = this.activeRoute.snapshot.params['id'];
    this.id = Number(beerIdString);
    if (isNaN(this.id)) {
      this.logger.error('Wrong id found on route: ' + beerIdString);
      this.id = -1;
    }
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  /**
   * Get beer info from api by id
   */
  getBeerInfo() {
    this.isLoading = true;
    this.error = null;

    // Check if input is valid
    if (this.id < 0 && !this.random) {
      this.showError('Invalid beer id');
      this.isLoading = false;
      return;
    }

    // Submit request
    const request = this.random ? this.punk.getRandomBeerInfo() : this.punk.getBeerInfo(this.id);
    if (request == null) {
      return;
    }

    request
      .pipe(takeUntil(this.subscribe))
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.beer = res[0];
          }
          this.logger.info(this.beer);
        },
        error: (err) => this.showError(err),
        complete: () => this.isLoading = false
      })
  }

  /**
   * Show error on view
   * @param error Error to show
   */
  showError(error: string) {
    this.error = error;
    const interval = setInterval(() => {
      this.error = null;
      clearInterval(interval);
    }, 5000);
  }

  /**
   * Return on previous page
   */
  back() {
    this.location.back();
  }

  /**
   * Check if the beer is on favorites list
   */
  isFavorite(): boolean {
    if (this.beer == null) {
      return false;
    }
    return this.punk.isFavorite(this.beer);
  }

  /**
   * Action called when favorite star is clicked
   */
  onFavoriteClick() {
    if (this.beer == null) {
      return;
    }
    if (this.isFavorite()) {
      // Remove favorite
      this.punk.removeFavorite(this.beer);
    } else {
      // Add favorite
      this.punk.addFavorite(this.beer);
    }
  }

  /**
   * Action called when new random button is clicked
   */
  onNewRandomClick() {
    this.getBeerInfo();
  }

  /**
   * Check if the food pairing value is valid
   */
  validFoodPairing(): boolean {
    if (this.beer == null) {
      return false;
    }

    return this.beer.food_pairing != null && this.beer.food_pairing.length > 0;
  }

}
