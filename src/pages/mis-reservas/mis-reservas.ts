import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {}

  
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Día:',
      inputs: [
        {
          name: 'Desde',
		  placeholder: 'Desde'
        },
		{
		  name: 'Hasta',
		  placeholder: 'Hasta'
		},
      ],
	  message: "*Esta cochera tiene una reserva a partir de las 14:00 por otro usuario",
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ocupar',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  ionViewDidLoad() {
    console.log('Hello MisReservasPage Page');
  }
}
