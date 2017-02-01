import { Component } from '@angular/core';
import { NavController , LoadingController, Loading } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MisReservasPage } from '../mis-reservas/mis-reservas';
import { CocherasPage } from '../cocheras/cocheras';
import { Reservas } from '../../providers/reservas';
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
  private mail: string = "hernan.ruiz@softtek.com";
  private fechaRese = new Date().toISOString();
  private actualiza = false;
  reservas: any;
  loading: Loading;


  constructor(private nav: NavController, public alertCtrl: AlertController, public reservasService: Reservas, private loadingCtrl: LoadingController ) {
				this.estaOcupandoCochera = false;
				this.tieneReserva = false;
  }
  
  alertaReserva(reserva) {
  
	  let alert = this.alertCtrl.create({
		title: 'Reserva',
		message: 'Usted tiene reservada la cochera N° ' + reserva.espacioCochera + ' en ' + reserva.nombreCochera + ' ¿ Desea realizar alguna acción ? ' ,
		buttons: [
		  {
			text: 'Ocupar',
			handler: () => {
			  console.log('Cancel clicked');
			  this.reservasService.ocupar(reserva, 'Inicio');
			  this.nav.setRoot(TabsPage)
			  alert.dismiss();
			  
			}
		  },
		  {
			text: 'Liberar',
			handler: () => {
			  console.log('Cancel clicked');
			  this.deleteReserva(reserva , 'Liberar');
              this.nav.setRoot(TabsPage)
			  alert.dismiss();

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
 

	deleteReserva(reserva, texto: string){
 
		//Remove locally
		let index = this.reservas.indexOf(reserva);
			 
		if(index > -1){
		this.reservas.splice(index, 1);
		}   
			 
		//Remove from database
		this.reservasService.deleteReserva(reserva.id, texto);

	} 
	
    alertaCocheraOcupada(reserva) {
	  let alert = this.alertCtrl.create({
		title: 'Cochera',
		message: 'Actualmente está ocupando la cochera N° ' + reserva.espacioCochera  + ' en ' + reserva.nombreCochera + ' ¿ Desea liberarla ? ',
		buttons: [
		  {
			text: 'Liberar',
			handler: () => {
			  console.log('Cancel clicked');
			  this.deleteReserva(reserva, 'Liberar');
			  this.nav.setRoot(TabsPage)
			  alert.dismiss();
			  
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
  
  
    getHoraActual(){
	
		var diaActual = new Date();
		var hora = diaActual.getHours();
		var minutos = diaActual.getMinutes();			
		var horaActual;
		var horas;
		var min;
				
		if (minutos < 10){
			min = "0" + minutos.toString();
		}else{
			min = minutos.toString();
		}
		
		if (hora < 10){
			horas = "0" + hora.toString();
		}else{
			horas = hora.toString();
		}	
		
		horaActual = horas.toString() + ":" + min;		
		return(horaActual);
			
	}
	
	
    ionViewDidLoad() {
      
	  this.reservasService.getReservasByMailAndFechaRese(this.mail, this.fechaRese).then((data) => {
	  console.log(data);
	  this.reservas = data;
	  var iterador;
	  var reserva;
	  var enHorario: boolean;
	  
		if(this.reservas.length > 0 ){
			this.tieneReserva = true;
		}	 

		for(iterador = 0; iterador < this.reservas.length ; iterador++){	  
			if(this.reservas[iterador].estado == "Ocupado"){			
				reserva = this.reservas[iterador];
				this.estaOcupandoCochera = true;
				break;		
			} else {			   
			    enHorario = this.reservas[iterador].horaDesde <= this.getHoraActual() && this.reservas[iterador].horaHasta >= this.getHoraActual();
			    if (enHorario){
					reserva = this.reservas[iterador];
					break;	
			   } 			
			}	  	  
		}
	  	  
		if(this.tieneReserva  === true && this.estaOcupandoCochera === false){
			  this.alertaReserva(reserva);			  
			   
		} else if (this.estaOcupandoCochera === true){
			   this.alertaCocheraOcupada(reserva);
		}
				
	  });	

    }

}