import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { MisReservasPage } from '../mis-reservas/mis-reservas';
import { CocherasPage } from '../cocheras/cocheras';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MisReservasPage;
  tab3Root: any = CocherasPage;

  private tieneReserva:boolean;
  private estaOcupandoCochera:boolean;
  
  constructor(public alertCtrl: AlertController) {
		this.tieneReserva = false;
		this.estaOcupandoCochera = false;
  }
  
  alertaReserva() {
	  let alert = this.alertCtrl.create({
		title: 'Reserva',
		message: 'Usted tiene reservada la cochera 2 en La Plata',
		buttons: [
		  {
			text: 'Ocupar',
			role: 'cancel',
			handler: () => {
			  console.log('Cancel clicked');
			}
		  },
		  {
			text: 'Liberar',
			handler: () => {
			  console.log('Buy clicked');
			}
		  },
		  {
			text: 'Cerrar',
			role: 'cancel',
			handler: () => {
			  console.log('Cancel clicked');
			}
		  }
		]
	  });
	  alert.present();
  }
  
  alertaCocheraOcupada() {
	  let alert = this.alertCtrl.create({
		title: 'Cochera',
		message: 'Actualmente está ocupando la cochera 2 en Maipú, ¿desea liberarla?',
		buttons: [
		  {
			text: 'Liberar',
			role: 'cancel',
			handler: () => {
			  console.log('Cancel clicked');
			}
		  },
		  {
			text: 'Cerrar',
			handler: () => {
			  console.log('Buy clicked');
			}
		  }
		]
	  });
	  alert.present();
  }
  
   ionViewDidLoad() {
	   if(this.tieneReserva === true && this.estaOcupandoCochera === false){
		   this.alertaReserva();
	   } else if (this.estaOcupandoCochera === true){
		   this.alertaCocheraOcupada();
	   }
  }
}