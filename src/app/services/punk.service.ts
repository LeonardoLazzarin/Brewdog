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
    private httpClient: HttpClient,
    private logger: ConsoleLoggerService
  ) {
    super(logger);
  }

  get allFavoriteBeers(): Beer[] {
    const allBeers = Object.keys(sessionStorage).map(key => {
      const item = sessionStorage.getItem(key);
      return {
        id: Number(key),
        name: item
      }
    });
    return allBeers.sort((a, b) => a.id - b.id);
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

    // Send request
    this.logger.info(request.url);
    return this.httpClient
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

    // Send request
    this.logger.log(request.url);
    return this.httpClient
      .get<Beer[]>(request.url, request.options)
      .pipe(catchError((error) => super.handleError(error)));
  }

  /**
   * Request for get beer info by id
   * @param id Id of beer
   */
  getBeerInfo(id: number): Observable<Beer[]> | null {
    // Create request data
    const request = this.getRestRequest('beers', [id.toString()]);
    if (request == null) {
      return null;
    }

    // Send request
    this.logger.log(request.url);
    return this.httpClient
      .get<Beer[]>(request.url, request.options)
      .pipe(catchError((error) => super.handleError(error)));
  }

  /**
   * Request for get a random beer info
   */
  getRandomBeerInfo(): Observable<Beer[]> | null {
    // Create request data
    const request = this.getRestRequest('beerRandom');
    if (request == null) {
      return null;
    }

    // Send request
    this.logger.log(request.url);
    return this.httpClient
      .get<Beer[]>(request.url, request.options)
      .pipe(catchError((error) => super.handleError(error)));
  }

  /**
   * Check if the beer is added to the favorites
   * @param beer The beer
   * @return The result of check
   */
  isFavorite(beer: Beer): boolean {
    return sessionStorage.getItem(beer.id.toString()) != null;
  }

  /**
   * Add beers to favorite
   * @param beers Beers to add
   */
  addFavorite(...beers: Beer[]) {
    beers.forEach(b => sessionStorage.setItem(b.id.toString(), b.name ?? 'No name found'));
  }

  /**
   * Remove beers to favorite
   * @param beers Beers to remove
   */
  removeFavorite(...beers: Beer[]) {
    beers.forEach(b => sessionStorage.removeItem(b.id.toString()));
  }

}
