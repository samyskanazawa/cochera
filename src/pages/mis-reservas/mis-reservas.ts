import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Reservas } from '../../providers/reservas';

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
  
  reservas: any;
  
  ionViewDidLoad() {
    this.reservasService.getReservas().then((data) => {
      console.log(data);
      this.reservas = data;
    });

    
  }
  
  constructor(public navCtrl: NavController, public reservasService: Reservas, public alertCtrl: AlertController) {
	this.tieneReserva = false;
	if (this.tieneReserva){
		this.mensaje = "*Esta cochera tiene una reserva a partir de las 14:00 por otro usuario";
	} else {
		this.mensaje = "";
	}
  }

  deleteReserva(reserva){
 
    //Remove locally
      let index = this.reservas.indexOf(reserva);
 
      if(index > -1){
        this.reservas.splice(index, 1);
      }   
 
    //Remove from database
	this.reservasService.deleteReserva((reserva._links.self.href).substr(30));
  }
  
  showPrompt(i) {
	let index = this.reservas.indexOf(i);
    let prompt = this.alertCtrl.create({
      title: 'Día: ' + this.reservas[index].fechaRese,
	  cssClass: 'alertcss',
      inputs: [
        {
          name: 'desde',
		  placeholder: 'Desde',
		  value: this.reservas[index].horaDesde
        },
		{
		  name: 'hasta',
		  placeholder: 'Hasta',
		  value: this.reservas[index].horaHasta
		},
      ],
	  message: this.mensaje,
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            this.reservasService.editReserva(this.reservas[index], data.desde, data.hasta);
          }
        },
        {
          text: 'Ocupar',
          handler: data => {
            this.reservasService.ocupar(this.reservas[index]);
          }
        }
      ]
    });
    prompt.present();
  }
  
  eliminarReserva(reserva) {
	let alert = this.alertCtrl.create({
    title: 'Eliminar Reserva ' + reserva.ObjectId,
    message: '¿Desea eliminar esta reserva?',
    buttons: [
      {
        text: 'Volver',
        role: 'cancel',
      },
      {
        text: 'Eliminar',
        handler: () => {
			this.deleteReserva(reserva);
		}
      }
    ]
  });
  alert.present();
}

  
}
