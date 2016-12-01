import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MisReservasPage } from '../mis-reservas/mis-reservas';
import { CocherasPage } from '../cocheras/cocheras';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MisReservasPage;
  tab3Root: any = CocherasPage;

  constructor() {

  }
}