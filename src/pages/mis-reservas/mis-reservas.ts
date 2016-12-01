import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the MisReservas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mis-reservas',
  templateUrl: 'mis-reservas.html'
})
export class MisReservasPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello MisReservasPage Page');
  }

}
