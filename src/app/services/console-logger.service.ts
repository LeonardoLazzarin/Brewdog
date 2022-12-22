import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

export interface ILoggerService {
  info(message: any): void;
  log(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements ILoggerService {

  info(message: any): void {
    if (!environment.production) {
      console.info(message);
    }
  }

  log(message: any): void {
    if (!environment.production) {
      console.log(message);
    }
  }

  warn(message: any): void {
    console.warn(message);
  }

  error(message: any): void {
    console.error(message);
  }
}

