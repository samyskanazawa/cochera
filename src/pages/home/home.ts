import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    
  }
  
  showPrompt() {
	  let alert = this.alertCtrl.create({
		title: 'Cochera 5',
		buttons: [
		  {
			text: 'Ocupar',
			role: 'cancel',
			handler: () => {
			  console.log('Cancel clicked');
			}
		  },
		  {
			text: 'Reservar',
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
  
  

}
