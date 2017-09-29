import { Component, ViewChild } from '@angular/core';
import { App } from 'ionic-angular';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login-page/login-page';
import { MisReservasPage } from '../pages/mis-reservas/mis-reservas';
import { CocherasPage } from '../pages/cocheras/cocheras';
import { ReservaRecurrentePage } from '../pages/reserva-recurrente/reserva-recurrente';
import { ABMCocherasPage } from '../pages/abm-cocheras/abm-cocheras';
import { CambiarUsuarioReservaPage } from '../pages/cambiar-usuario-reserva/cambiar-usuario-reserva';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string}>;

  public shouldHide:boolean;

  constructor(platform: Platform) {

    this.shouldHide = false;

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    // used for an example of ngFor and navigation

    var esAdmin = window.localStorage.getItem("esAdmin");

    if ( esAdmin == 'S' ) {
      this.pages = [
        { title: 'Home', component: HomePage, icon: "home" },
        { title: 'Mis Reservas', component: MisReservasPage, icon: "information-circle" },
        { title: 'Cocheras', component: CocherasPage, icon: "car" },
        { title: 'Reserva Recurrente', component: ReservaRecurrentePage, icon: "calendar" },
        { title: 'ABM Cocheras', component: ABMCocherasPage, icon: "clipboard" },
        { title: 'Cambiar Usuario', component: CambiarUsuarioReservaPage, icon: "contacts" }
      ];
    } else {
        this.pages = [
        { title: 'Home', component: HomePage, icon: "home" },
        { title: 'Mis Reservas', component: MisReservasPage, icon: "information-circle" },
        { title: 'Cocheras', component: CocherasPage, icon: "car" },
        { title: 'Reserva Recurrente', component: ReservaRecurrentePage, icon: "calendar" }
      ];
    }

  }

 openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}






