import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {PwaService} from "./pwa.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
      BrowserModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      })
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private pwaService: PwaService) {
    pwaService.init();
  }
}
