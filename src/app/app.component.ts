import {Component, OnDestroy, OnInit} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {Subscription} from "rxjs";
import * as QRCode from 'qrcode'

import {PwaService} from "./pwa.service";
import {AnalyticsService} from "./analytics.service";


const qrOptions = {width: 600, margin:0};

@Component({
  selector: 'qr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  qrUrl?: string;

  private pwaServiceSubscriber?: Subscription;

  constructor(
      private pwaService: PwaService,
      private analyticsService: AnalyticsService,
      private swUpdate: SwUpdate) {

    swUpdate.versionUpdates.subscribe(evt => {
      switch (evt.type) {
        case 'VERSION_DETECTED': // Downloading new app version
          analyticsService.sendEvent('SW:VERSION_DETECTED', evt.version.hash);
          break;
        case 'VERSION_READY': // Current app version & New app version ready for use
          analyticsService.sendEvent('SW:VERSION_READY', `${evt.currentVersion.hash}:${evt.latestVersion.hash}`);
          break;
        case 'VERSION_INSTALLATION_FAILED': // Failed to install app version
          analyticsService.sendEvent('SW:VERSION_INSTALLATION_FAILED', `${evt.version.hash}:${evt.error}`);
          break;
      }
    });
  }

  async generate(el: HTMLTextAreaElement){
    this.qrUrl = await QRCode.toDataURL(el.value, qrOptions);
    el.value = '';

    this.pwaServiceSubscriber = this.pwaService.prompt.subscribe(res => {
      // outcome returns 'accepted' or 'dismissed'
      this.analyticsService.sendEvent('prompt installer', res.outcome);
    });
  }

  ngOnInit(): void {
    // If your project used Angular Router - You should use RouterActivated instead of thw following code
    const parsedUrl = new URL(window.location.toString());
    const url = parsedUrl.searchParams.get('link') || parsedUrl.searchParams.get('description') || parsedUrl.searchParams.get('text');

    if (url) {
      QRCode.toDataURL(url, qrOptions).then(qrUrl => this.qrUrl = qrUrl);
    }
  }

  ngOnDestroy(): void {
    this.pwaServiceSubscriber?.unsubscribe();
  }
}
