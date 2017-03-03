import { Component } from '@angular/core';
import { NavController , LoadingController, Loading } from 'ionic-angular';
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
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MisReservasPage;
  tab3Root: any = CocherasPage;

  private tieneReserva:boolean;
  private estaOcupandoCochera:boolean;
  private mail: string = window.localStorage.getItem("email");
  private usuarioLogeado;
  private allUsuariosArray = [];
  private fechaRese = new Date().toISOString();
  reservas: any;
  loading: Loading;


  constructor(private nav: NavController, public alertCtrl: AlertController, public reservasService: Reservas, private loadingCtrl: LoadingController, private usuariosService: Usuarios) {
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
	
		var horaDesde = Number((reserva.horaDesde).replace(":",""));
		var horaActual = Number((this.getHoraActual()).replace(":",""));
		
		if(horaDesde <= horaActual){

		  let alert = this.alertCtrl.create({	  
			title: 'Reserva',
			message: 'Usted tiene reservada la cochera N° ' + reserva.espacioCochera + ' en ' + reserva.nombreCochera + ' ¿ Desea realizar alguna acción ? ' ,
			buttons: [
			  {
				text: 'Ocupar',
				handler: () => {
				  console.log('Cancel clicked');
				  window.localStorage.setItem("alertAnterior", "true");
				  this.reservasService.ocupar(reserva, 'Inicio');
				  this.nav.setRoot(TabsPage)
				  //alert.dismiss();
				  
				}
			  },
			  {
				text: 'Liberar',
				handler: () => {
				  console.log('Cancel clicked');
				  window.localStorage.setItem("alertAnterior", "true");
				  this.deleteReserva(reserva , 'Liberar');
				  this.nav.setRoot(TabsPage)
				  //alert.dismiss();

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
		}  else {
		
		 let alert = this.alertCtrl.create({	  
			title: 'Reserva',
			message: 'Usted tiene reservada la cochera N° ' + reserva.espacioCochera + ' en el horario desde las: ' + reserva.horaDesde +  ' en: ' + reserva.nombreCochera + ' ¿ Desea liberarla ? ' ,
			buttons: [
			  {
				text: 'Liberar',
				handler: () => {
				  console.log('Cancel clicked');
				  window.localStorage.setItem("alertAnterior", "true");
				  this.deleteReserva(reserva , 'Liberar');
				  this.nav.setRoot(TabsPage)
				  //alert.dismiss();

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
			  window.localStorage.setItem("alertAnterior", "true");
			  this.deleteReserva(reserva, 'Liberar');
			  this.nav.setRoot(TabsPage);
			  //alert.dismiss();
			  
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
	
	
	modificarCelularAlert(titulo: string, subtitulo: string) {
	let prompt = this.alertCtrl.create({
		  title: titulo,
		  inputs: [
			{
			  name: 'telefono',
			  placeholder: 'Ingrese su número de teléfono',
			  type: 'number',
			  value: this.usuarioLogeado.telefono
			},
		  ],
		  message: subtitulo,
		  buttons: [
			{
			  text: 'Guardar',
			  handler: data => {
				  //debugger;
				  if((data.telefono).length >= 10){
					var mensaje;
					var outerThis = this;
					debugger;
					this.usuariosService.habilitarUsuario(this.usuarioLogeado, mensaje, (data.telefono).toString(), function(mensajeADevolver: string){
						if (mensajeADevolver == "Datos actualizados"){
							var tituloCorrecto = "Datos Actualizados";
							var subtituloCorrecto = "Los datos fueron actualizados correctamente";
							outerThis.getUsuarioLogeado();
							outerThis.alertGenerico(tituloCorrecto, subtituloCorrecto);
						} else {
							subtitulo = "Ingrese su número de celular<br><br><center><b>Error. No se pudo actualizar la informacion.</b></center><br><br>";
							outerThis.modificarCelularAlert(titulo, subtitulo);
						}
					});
				  } else {
					  subtitulo = "Ingrese su número de celular<br><br><center><b>Formato de número telefónico inválido.</b></center><br><br>"; 
					  this.modificarCelularAlert(titulo, subtitulo);
				  }
			  }
			},
			 {
			  text: 'Cerrar',
			  role: 'cancel',
			},
		  ]
		});
		prompt.present();
	}
	
  
   salirAlert() {
	let alert = this.alertCtrl.create({
    title: "Salir",
    subTitle: "Desea salir de la aplicación",
    buttons: [
      {
        text: 'Si',
        role: 'cancel',
      },
	  {
        text: 'No',
        role: 'cancel',
      },
    ]
  });
  alert.present();
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
	  console.log(data);
	  this.reservas = data;
	  var iterador;
	  var reserva;
	  var enHorario: boolean;
	  var horarioActual = Number((this.getHoraActual()).replace(":",""));
	  var diaActual = new Date();

	  var alertAnterior = window.localStorage.getItem("alertAnterior");
	  
		  if(alertAnterior != "true"){
			if(this.reservas.length > 0 ){
				this.tieneReserva = true;
			}	 

			for(iterador = 0; iterador < this.reservas.length ; iterador++){	  
				enHorario = Number((this.reservas[iterador].horaHasta).replace(":","")) > horarioActual;
				if ((diaActual.toISOString().substr(0, 10) == this.reservas[iterador].fechaRese.substr(0,10)) && enHorario){
					if(this.reservas[iterador].estado == "Ocupado"){			
						reserva = this.reservas[iterador];
						this.estaOcupandoCochera = true;
						break;		
					} else {
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
		  } else {
			  window.localStorage.removeItem("alertAnterior");
		  }		
	  });	

    }

}