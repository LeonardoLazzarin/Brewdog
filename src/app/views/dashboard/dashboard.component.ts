import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConsoleLoggerService} from "../../services/console-logger.service";
import {Subject, takeUntil} from "rxjs";
import {Beer} from "../../modules/beer";
import {PunkService} from "../../services/punk.service";
import {defaultFilterBeer, FilterBeer} from "../../modules/beerFilter";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscribe: Subject<void>;

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
    this.subscribe = new Subject<void>();
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
    this.subscribe.unsubscribe();
  }

  /**
   * Visibility of button previous page
   */
  get prevButtonVisible(): boolean {
    return this.page > 1;
  }

  /**
   * Visibility of button next page
   */
  get nextButtonVisible(): boolean {
    return this.beers.length == this.punk.itemPerPage;
  }

  /**
   * Request for get all beers from api
   */
  getBeersByPage() {
    this.isLoading = true;
    this.error = null;

    // Submit request
    const request = this.punk.getBeersWithFilter(this.page, this.filter);
    if (request == null) {
      return;
    }

    request
      .pipe(takeUntil(this.subscribe))
      .subscribe({
        next: (res) => {
          if (Array.isArray(res)){
            this.beers = res;
          }
        },
        error: (err) => this.showError(err),
        complete: () => this.isLoading = false
      });
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
   * Action for get information of previous page
   */
  prevPage(){
    if (!this.prevButtonVisible) {
      return;
    }

    this.page -= 1;
    this.getBeersByPage();
  }

  /**
   * Action for get information of next page
   */
  nextPage() {
    if (!this.nextButtonVisible) {
      return;
    }

    this.page += 1;
    this.getBeersByPage();
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
