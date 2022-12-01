import { Injectable } from '@angular/core';
import {RestService} from "./rest.service";
import {HttpClient} from "@angular/common/http";
import {ConsoleLoggerService} from "./console-logger.service";
import {Observable} from "rxjs";
import {catchError} from 'rxjs/operators';
import {Beer} from "../modules/beer";

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
   * @param nameCombination The name and combination filed
   * @param abvFrom From alcohol component
   * @param abvTo To alcohol component
   */
  getBeersWithFilter(page: number, nameCombination: string, abvFrom: number | null, abvTo: number | null){
    if(super.itemPerPage == null) {
      return null;
    }

    // Create params
    let params: any = {
      per_page: super.itemPerPage,
      page: page,
    };
    if (nameCombination) {
      params['food'] = nameCombination;
      params['beer_name'] = nameCombination;
    }
    if (abvFrom !== null) {
      params['abv_gt'] = abvFrom;
    }
    if (abvTo !== null) {
      params['abv_lt'] = abvTo;
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
