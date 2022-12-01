import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ConsoleLoggerService} from "./console-logger.service";
import {of} from "rxjs";

export interface RestRequest {
  url: string,
  options: RestRequestOptions
}

export interface RestRequestOptions {
  headers: HttpHeaders,
  params: HttpParams
}

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(
    private restLogger: ConsoleLoggerService,
    private restServiceName: 'punkApi'
  ) { }

  /**
   * The number of item for page
   */
  get itemPerPage() {
    const items = environment.punkApi.paging.item;
    if (items == null) {
      console.error("Invalid item per page for %s", this.restServiceName);
    }
    return items;
  }

  /**
   * Configuration for make a request to a specific api service
   * @param serviceName Service in the api
   * @param urlSegment Additional url segment (optional)
   * @param params Query parameters (optional)
   * @return The configuration generated otherwise null
   */
  getRestRequest(
    serviceName: string,
    urlSegment?: string[] | number[] | null,
    params?: any,
  ): RestRequest | null {
    const serviceConf: any = environment[this.restServiceName];
    if (serviceConf == null) {
      this.restLogger.error('Rest service configuration not found for %s', this.restServiceName);
      return null;
    }

    let url = this.getRestUrl(serviceConf, serviceName);
    if (url === null) {
      return null;
    }

    if(urlSegment != null && urlSegment.length > 0) {
      for (const segment of urlSegment) {
        url += '/' + segment;
      }
    }

    // Add params
    let httpParams = new HttpParams();
    if (params != null) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }

    // Add headers
    let httpHeaders = new HttpHeaders();
    if (serviceConf.headers != null && serviceConf.headers.length > 0) {
      serviceConf.headers.forEach(function(header: {key: string, value: string}) {
        httpHeaders = httpHeaders.append(header.key, header.value);
      });
    }

    return {
      url,
      options: {
        headers: httpHeaders,
        params: httpParams
      }
    }
  }

  /**
   * Url for a specific api service
   * @param serviceConf Rest api configuration
   * @param serviceName Service in the rest service
   * @return The url created otherwise null
   */
  getRestUrl(
    serviceConf: any,
    serviceName: string,
  ): string | null {
    if (serviceConf == null) {
      return null;
    }

    // Check if the service name passed is valid
    if (serviceConf.services == null) {
      this.restLogger.error('No service found for %s', this.restServiceName);
      return null;
    }
    if (serviceConf.services[serviceName] == null) {
      this.restLogger.error('Service name invalid for %s', this.restServiceName);
      return null;
    }

    // Create url
    if (serviceConf.baseAddress == null) {
      this.restLogger.error('Base url not found for %s', this.restServiceName);
      return null;
    }

    return serviceConf.baseAddress + serviceConf.services[serviceName];
  }

  handleError(error: any) {
    this.restLogger.error("HTTP error: ", error);
    return of(error);
  }
}
