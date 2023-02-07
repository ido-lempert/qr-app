import { Injectable } from '@angular/core';
import {fromEvent, ReplaySubject, take, mergeMap, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

interface BeforeInstallPrompt extends Event{
  prompt : () => Promise<any>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private beforeInstallPrompt = new ReplaySubject<BeforeInstallPrompt>(1);

  init(){
    fromEvent<BeforeInstallPrompt>(window, 'beforeinstallprompt')
        .pipe(take(1))
        .subscribe(beforeInstallPrompt => {
          beforeInstallPrompt.preventDefault();
          this.beforeInstallPrompt.next(beforeInstallPrompt);
        });
  }

  get prompt(): Observable<any> {
    return this.beforeInstallPrompt
        .pipe(
            mergeMap(
                (installer) => fromPromise(installer.prompt())
            )
        );
  }
}
