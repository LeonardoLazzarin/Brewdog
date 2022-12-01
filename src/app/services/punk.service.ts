import { Injectable } from '@angular/core';
import {RestService} from "./rest.service";
import {HttpClient} from "@angular/common/http";
import {ConsoleLoggerService} from "./console-logger.service";
import {catchError, Observable} from "rxjs";
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

  getBeerPerPage(page: number): Observable<Beer[]> | null {
    if(super.itemPerPage == null) {
      return null;
    }

    // Create request data
    const params = {per_page: super.itemPerPage, page: page};
    const request = super.getRestRequest('beers', null, params);
    if (request == null) {
      return null;
    }

    return this.http
      .get<Beer[]>(request.url, request.options)
      .pipe(catchError((error) => super.handleError(error)));
  }

}
