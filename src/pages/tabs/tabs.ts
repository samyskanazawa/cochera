import { Component } from '@angular/core';
import { NavController , LoadingController, Loading, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MisReservasPage } from '../mis-reservas/mis-reservas';
import { CocherasPage } from '../cocheras/cocheras';
import { Reservas } from '../../providers/reservas';
import { Usuarios } from '../../providers/usuarios';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = MisReservasPage;
  tab3Root: any = CocherasPage;

  public tieneReserva:boolean;
  public estaOcupandoCochera:boolean;
  public mail: string = window.localStorage.getItem("email");
  public usuarioLogeado;
  public allUsuariosArray = [];
  public fechaRese = new Date().toISOString();
  reservas: any;
  loading: Loading;


  constructor(public nav: NavController, public alertCtrl: AlertController, public reservasService: Reservas, public platform: Platform, public loadingCtrl: LoadingController, public usuariosService: Usuarios) {
				this.estaOcupandoCochera = false;
				this.tieneReserva = false;
				this.getUsuarioLogeado();
  }
  
  getUsuarioLogeado(){
	  
	  var outerThis = this;
	  var q;
	  var index = -1;
	  this.buscarsUsuarios(function(){
			
		var searchTerm = outerThis.mail;
		
		for(q = 0; q < outerThis.allUsuariosArray[0].length; q++) {
			if (outerThis.allUsuariosArray[0][q].mail == searchTerm && index == -1) {
				index = q;
			}
		}
		
		outerThis.usuarioLogeado = outerThis.allUsuariosArray[0][index];
	});
  }
  
    buscarsUsuarios (callback) {
	  this.usuariosService.getUsuarios().then((data) => {
		this.allUsuariosArray.push(data);
		callback();
	});
  }
  
    alertaReserva(reserva) {
		if(reserva != null){
			var horaDesde = Number((reserva.horaDesde).replace(":",""));
			var horaActual = Number((this.getHoraActual()).replace(":",""));
			
			if(horaDesde <= horaActual){

			  let alert = this.alertCtrl.create({	  
				title: 'Reserva',
				message: 'Usted tiene reservada la cochera N° ' + reserva.espacioCochera + ' en ' + reserva.nombreCochera + ' ¿Desea realizar alguna acci\u00F3n? ' ,
				buttons: [
				  {
					text: 'Ocupar',
					handler: () => {
					  window.localStorage.setItem("alertAnterior", "true");
					  this.reservasService.ocupar(reserva, 'Inicio');
					  this.nav.setRoot(TabsPage);
					}
				  },
				  {
					text: 'Liberar',
					handler: () => {
					  window.localStorage.setItem("alertAnterior", "true");
					  this.deleteReserva(reserva , 'Liberar');
					  this.nav.setRoot(TabsPage);
					}
					
				  },
				  {
					text: 'Cerrar',
					role: 'cancel',
				  }
				]
			  });

			  alert.present();		
			}  else {
			
			 let alert = this.alertCtrl.create({	  
				title: 'Reserva',
				message: 'Usted tiene reservada la cochera N° ' + reserva.espacioCochera + ' en el horario desde las ' + reserva.horaDesde +  ' hs hasta las ' + reserva.horaHasta + ' hs en: ' + reserva.nombreCochera + ' ¿Desea liberarla? ' ,
				buttons: [
				  {
					text: 'Liberar',
					handler: () => {
					  window.localStorage.setItem("alertAnterior", "true");
					  this.deleteReserva(reserva , 'Liberar');
					  this.nav.setRoot(TabsPage);
					}
					
				  },
				  {
					text: 'Cerrar',
					role: 'cancel',
				  }
				]
			  });
			  alert.present();			
			}
		}
    }
 

	deleteReserva(reserva, texto: string){
 
		//Remover localmente
		let index = this.reservas.indexOf(reserva);
			 
		if(index > -1){
			this.reservas.splice(index, 1);
		}   
			 
		//Remover de la base
		this.reservasService.deleteReserva(reserva.id, texto);
	} 
	
    alertaCocheraOcupada(reserva) {
	  let alert = this.alertCtrl.create({
		title: 'Cochera',
		message: 'Actualmente est\u00E1 ocupando la cochera N° ' + reserva.espacioCochera  + ' en ' + reserva.nombreCochera + ' ¿Desea liberarla? ',
		buttons: [
		  {
			text: 'Liberar',
			handler: () => {
			  window.localStorage.setItem("alertAnterior", "true");
			  this.deleteReserva(reserva, 'Liberar');
			  this.nav.setRoot(TabsPage);
			}
		  },
		  {
			text: 'Cerrar',
			role: 'cancel',
		  }
		]
	  });
	  alert.present();
    }
	
	
	modificarCelularAlert(titulo: string, subtitulo: string) {
	let prompt = this.alertCtrl.create({
		  title: titulo,
		  inputs: [
			{
			  name: 'telefono',
			  placeholder: 'Ingrese su n\u00FAmero de tel\u00E9fono',
			  type: 'number',
			  value: this.usuarioLogeado.telefono
			},
		  ],
		  message: subtitulo,
		  buttons: [
			{
			  text: 'Guardar',
			  handler: data => {
				  window.localStorage.setItem("noCancel", 'true');
				  this.modificarCel(data, titulo, subtitulo);
			  }
			},
			 {
			  text: 'Cerrar',
			  role: 'cancel',
			},
		  ]
		});
		onkeypress = function(e) {
			var key = e.charCode || e.keyCode || 0;     
			if (key == 13) {
				window.localStorage.setItem("noCancel", 'true');
			}
		}
		prompt.onDidDismiss((data) => {
			this.modificarCel(data, titulo, subtitulo);
		});
		prompt.present();
	}
	
	modificarCel(data, titulo, subtitulo){
		if(window.localStorage.getItem("noCancel") == 'true'){
			window.localStorage.removeItem("noCancel");
			if((data.telefono).length >= 10){
				var mensaje;
				var outerThis = this;
				this.usuariosService.habilitarUsuario(this.usuarioLogeado, mensaje, (data.telefono).toString(), function(mensajeADevolver: string){
					if (mensajeADevolver == "Datos actualizados"){
						var tituloCorrecto = "Datos Actualizados";
						var subtituloCorrecto = "Los datos fueron actualizados correctamente";
						outerThis.getUsuarioLogeado();
						outerThis.alertGenerico(tituloCorrecto, subtituloCorrecto);
					} else {
						subtitulo = "<center><b>Error. No se pudo actualizar la informaci\u00F3n.</b></center><br>Ingrese su n\u00FAmero de celular";
						outerThis.modificarCelularAlert(titulo, subtitulo);
					}
				});
			} else {
				subtitulo = "<center><b>Formato de n\u00FAmero telef\u00F3nico inv\u00E1lido.</b></center><br>Ingrese su n\u00FAmero de celular"; 
				this.modificarCelularAlert(titulo, subtitulo);
			}
		}			
	}
	
  
   salirAlert() {
	let alert = this.alertCtrl.create({
    title: "Salir",
    subTitle: "Desea salir de la aplicaci\u00F3n",
    buttons: [
      {
        text: 'Si',
        handler: () => { this.exitApp() },
      },
	  {
        text: 'No',
        role: 'cancel',
      },
    ]
  });
  alert.present();
}

 exitApp(){
    this.platform.exitApp();
  }

   alertGenerico(titulo: string, subtitulo: string) {
	let alert = this.alertCtrl.create({
    title: titulo,
    subTitle: subtitulo,
    buttons: [
      {
        text: 'OK',
        role: 'cancel',
      },
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
	  this.reservas = data;
	  var item;
	  var reserva;
	  var enHorario: boolean;
	  var horarioActual = Number((this.getHoraActual()).replace(":",""));
	  var diaActual = new Date();

		  if (this.reservas != null){
			var alertAnterior = window.localStorage.getItem("alertAnterior");

			if(alertAnterior != "true"){
				if(this.reservas.length > 0 ){
					this.tieneReserva = true;
				}	 

				for(item in this.reservas){	  
					enHorario = Number((this.reservas[item].horaHasta).replace(":","")) > horarioActual;
					if ((diaActual.toISOString().substr(0, 10) == this.reservas[item].fechaRese.substr(0,10)) && enHorario){
						if(this.reservas[item].estado == "Ocupado"){			
							reserva = this.reservas[item];
							this.estaOcupandoCochera = true;
							break;		
						} else {
							if(reserva == null || this.reservas[item].horaDesde < reserva.horaDesde){
								reserva = this.reservas[item];
							}
						}
					}				
				}

				if(this.tieneReserva  === true && this.estaOcupandoCochera === false){
					  this.alertaReserva(reserva);			  
					   
				} else if (this.estaOcupandoCochera === true){
					   this.alertaCocheraOcupada(reserva);
				}
			} else {
			  window.localStorage.removeItem("alertAnterior");
			}
		  }	  			  
	  });	

    }

}