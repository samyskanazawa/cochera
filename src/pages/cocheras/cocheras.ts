import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the Cocheras page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cocheras',
  templateUrl: 'cocheras.html'
})
export class CocherasPage {
	private today: string;
	private horaDesde: string;
	private horaHasta: string;
	private mostrarResultados: boolean;
	
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
	this.mostrarResultados = true;
    //console.log(this.today);
  }

  setHoraDesde(){
	  this.horaDesde = new Date().toISOString();
  }
  
  setHoraHasta(){
	  this.horaHasta = new Date().toISOString();
  }
  
  setDia(){
	  this.today  = new Date().toISOString();
  }
  
  buscar(){
	  this.mostrarResultados = false;
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
		{
			name: 'Todo el día:',
			label: 'Todo el día',
			type: "checkbox",
			value: "Todo el día:"
		}
      ],
	
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    prompt.present();
  }
  
  ionViewDidLoad() {
    console.log('Hello CocherasPage Page');
  }

}
