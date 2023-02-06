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
  private pwaServiceSubscriber?: Subscription;

  constructor(private pwaService: PwaService) {
  }

  async generate(el: HTMLTextAreaElement){
    const url = await QRCode.toDataURL(el.value, {width: 600});
    this.qrUrl = url;
    el.value = '';

    this.pwaServiceSubscriber = this.pwaService.prompt.subscribe();
  }

  ngOnDestroy(): void {
    this.pwaServiceSubscriber?.unsubscribe();
  }
}
