import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConsoleLoggerService} from "../../services/console-logger.service";
import {Subscription} from "rxjs";
import {Beer} from "../../modules/beer";
import {PunkService} from "../../services/punk.service";
import {defaultFilterBeer, FilterBeer} from "../../modules/beerFilter";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  isLoading: boolean;

  error: string | null;

  beers: Beer[];
  page: number;
  filter: FilterBeer;

  constructor(
    private logger: ConsoleLoggerService,
    private punk: PunkService
  ) {
    this.isLoading = true;
    this.subscription = new Subscription();
    this.beers = [];
    this.error = null;
    this.page = 1;
    this.filter = defaultFilterBeer();
  }


  ngOnInit(): void {
    this.page = 1;
    this.filter = defaultFilterBeer();
    this.getBeersByPage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Request for get all beers from api
   */
  getBeersByPage() {
    // Get the request
    const request = this.punk.getBeersWithFilter(this.page, this.filter);
    if (request == null) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.subscription = request.subscribe({
      next: (res) => {
        if (Array.isArray(res)){
          this.beers = res;
        }
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

  onFilter(filter: FilterBeer) {
    this.filter = filter;

    // Replace space with underscore
    this.filter.beerName = this.filter.beerName.replace(' ', '_');
    this.filter.foodCombination = this.filter.foodCombination.replace(' ', '_');

    this.page = 1;
    this.getBeersByPage();
  }

}
