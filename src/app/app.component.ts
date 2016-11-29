import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login-page/login-page';



@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}

/*@Component({
   template: `<ion-nav *ngIf="showRoot" [root]="rootPage"></ion-nav>`
})
export class MyApp {

  rootPage:any = LoginPage;

  showRoot = false;

  constructor(platform: Platform, storage: Storage) {

    this.storage.get('isLogged').then(logged => {
        if (logged) {
           this.rootPage = HomePage;
        }
        this.showRoot = true;
    });
  }
}*/
