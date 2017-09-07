import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the EstadoCocheras page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-estado-cocheras',
  templateUrl: 'estado-cocheras.html'
})
export class EstadoCocherasPage {

  constructor(public navCtrl: NavController) {}
  public ReporteFechaDesde = new Date().toISOString();
  public ReporteFechaHasta = new Date().toISOString();

  ionViewDidLoad() {
    console.log('Hello EstadoCocherasPage Page');
  }

}
