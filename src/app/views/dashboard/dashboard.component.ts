import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConsoleLoggerService} from "../../services/console-logger.service";
import {Subscription} from "rxjs";
import {Beer} from "../../modules/beer";
import {FilterBeer} from "../../shared/search-beer/search-beer.component";
import {PunkService} from "../../services/punk.service";

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
    this.filter = { nameCombination: "", alcohol: {from: null, to: null}};
  }


  ngOnInit(): void {
    this.page = 1;
    this.filter = { nameCombination: "", alcohol: {from: null, to: null}};
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
    const request = this.punk.getBeersWithFilter(
      this.page,
      this.filter.nameCombination,
      this.filter.alcohol.from,
      this.filter.alcohol.to
    );
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
    this.filter.nameCombination = this.filter.nameCombination.replace(' ', '_');

    this.page = 1;
    this.getBeersByPage();
  }

}
