import {Component} from '@angular/core';
import * as QRCode from 'qrcode'

@Component({
  selector: 'qr-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  qrUrl?: string;
  async generate(el: HTMLTextAreaElement){
    const url = await QRCode.toDataURL(el.value, {width: 600});
    this.qrUrl = url;
    el.value = '';
  }
}
