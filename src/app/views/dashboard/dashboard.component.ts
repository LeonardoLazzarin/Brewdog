import {Component, OnDestroy, OnInit} from '@angular/core';
import {FilterBeer} from "../../shared/search-beer/search-beer.component";
import {ConsoleLoggerService} from "../../services/console-logger.service";
import {Subscription} from "rxjs";
import {Beer} from "../../modules/beer";
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

  constructor(
    private logger: ConsoleLoggerService,
    private punk: PunkService
  ) {
    this.isLoading = true;
    this.subscription = new Subscription();
    this.beers = [];
    this.error = null;
    this.page = 1;
  }


  ngOnInit(): void {
    this.page = 1;
    this.getBeersByPage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBeersByPage() {
    const request = this.punk.getBeerPerPage(this.page);
    if (request == null) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.subscription = request.subscribe({
      next: (res) => {
        this.logger.log(res);
        this.beers = res;
      },
      error: (err) => this.error = err,
      complete: () => this.isLoading = false
    })
  }

  onFilter(filter: FilterBeer) {
    this.logger.log(filter);
  }

}
