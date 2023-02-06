import {Component, OnDestroy} from '@angular/core';
import * as QRCode from 'qrcode'
import {PwaService} from "./pwa.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'qr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy{
  qrUrl?: string;
  qrDownloadUrl?: string;

  private pwaServiceSubscriber?: Subscription;

  constructor(private pwaService: PwaService) {
  }

  async generate(el: HTMLTextAreaElement){
    this.qrUrl = await QRCode.toDataURL(el.value, {width: 600, margin:0});
    el.value = '';

    this.pwaServiceSubscriber = this.pwaService.prompt.subscribe();
  }

  ngOnDestroy(): void {
    this.pwaServiceSubscriber?.unsubscribe();
  }
}
