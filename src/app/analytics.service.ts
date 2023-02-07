import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  sendEvent(key: string, value: string | number | boolean){
    console.log('Analytics Event:', key, value);
  }
}
