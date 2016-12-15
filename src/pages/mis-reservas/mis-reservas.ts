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

  private tieneReserva:boolean;
  private mensaje: string;
  private horarioDesde:string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
	this.tieneReserva = false;
	if (this.tieneReserva){
		this.mensaje = "*Esta cochera tiene una reserva a partir de las 14:00 por otro usuario";
	} else {
		this.mensaje = "";
	}
  }

  
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
	  message: this.mensaje,
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
  
  eliminarReserva() {
  let alert = this.alertCtrl.create({
    title: 'Eliminar Reserva',
    message: '¿Desea eliminar esta reserva?',
    buttons: [
      {
        text: 'Volver',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Eliminar',
        handler: () => {
          console.log('Buy clicked');
        }
      }
    ]
  });
  alert.present();
}

  ionViewDidLoad() {
    console.log('Hello MisReservasPage Page');
  }
}
