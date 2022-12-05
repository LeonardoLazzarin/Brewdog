import { Injectable } from '@angular/core';
import {RestService} from "./rest.service";
import {HttpClient} from "@angular/common/http";
import {ConsoleLoggerService} from "./console-logger.service";
import {Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {Beer} from "../modules/beer";
import {FilterBeer} from "../modules/beerFilter";

@Injectable({
  providedIn: 'root'
})
export class PunkService extends RestService {

  constructor(
    private http: HttpClient,
    private logger: ConsoleLoggerService
  ) {
    super(logger);
  }

  /**
   * Request for get beers by page
   * @param page Page
   */
  getBeers(page: number): Observable<Beer[]> | null {
    if(super.itemPerPage == null) {
      return null;
    }

    // Create request data
    const params = {
      per_page: super.itemPerPage,
      page: page
    };
    const request = super.getRestRequest('beers', null, params);
    if (request == null) {
      return null;
    }

    return this.http
      .get<Beer[]>(request.url, request.options)
      .pipe(catchError((error) => super.handleError(error)));
  }

  /**
   * Request for get beers by page with filter
   * @param page Page
   * @param filter Filter for the request
   */
  getBeersWithFilter(page: number, filter: FilterBeer): Observable<Beer[]> | null {
    if(super.itemPerPage == null) {
      return null;
    }

    // Create params
    let params: any = {
      per_page: super.itemPerPage,
      page: page,
    };
    if (filter.beerName) {
      params['beer_name'] = filter.beerName;
    }
    if (filter.foodCombination) {
      params['food'] = filter.foodCombination;
    }
    if (filter.alcohol.from !== null && filter.alcohol.from > 0) {
      params['abv_gt'] = filter.alcohol.from;
    }
    if (filter.alcohol.to !== null && filter.alcohol.to > 0) {
      params['abv_lt'] = filter.alcohol.to;
    }

    // Create request data
    const request = super.getRestRequest('beers', null, params);
    if (request == null) {
      return null;
    }

    this.logger.log(request);
    return this.http
      .get<Beer[]>(request.url, request.options)
      .pipe(catchError((error) => super.handleError(error)));
  }

}
