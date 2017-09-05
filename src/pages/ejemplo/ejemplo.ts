import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Ejemplo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ejemplo',
  templateUrl: 'ejemplo.html'
})
export class EjemploPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello EjemploPage Page');
  }

}
