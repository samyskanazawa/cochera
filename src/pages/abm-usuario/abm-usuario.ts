import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the AbmUsuario page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-abm-usuario',
  templateUrl: 'abm-usuario.html'
})
export class AbmUsuarioPage {	

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello AbmUsuarioPage Page');
  }

}
