import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, Loading } from 'ionic-angular';
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

  public tieneReserva:boolean;
  public mensaje: string;
  public indice: number;
  public indiceOcupado;
  public indiceLiberar;
  public indiceAlert;
  public loading: Loading;
  public mail: string = window.localStorage.getItem("email");//"hernan.ruiz@softtek.com";
  public fechaRese = new Date().toISOString();
  public reservasArray: any;
  reservas: any;
  radios: any;
  
  
  ionViewDidEnter() {

  	var esAdmin = window.localStorage.getItem("esAdmin");
	var mailCambioUsuario = window.sessionStorage.getItem("mailCambioUsuario");

  	if ( esAdmin == 'S' && mailCambioUsuario) {

  		this.mail = mailCambioUsuario;
  	}
    
	this.reservasService.getReservasByMailAndFechaRese(this.mail, this.fechaRese).then((data) => {
	  this.reservas = data;
	  this.indiceOcupado = null;
	  this.indice = null;
	  this.indiceLiberar = null;
	});
  }
  
  constructor(public navCtrl: NavController, public reservasService: Reservas, public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
	this.tieneReserva = false;
	
  }
  
  deleteReserva(reserva, texto: string){
 
    //Remover localmente
      let index = this.reservas.indexOf(reserva);
 
      if(index > -1){
        this.reservas.splice(index, 1);
      }   
 
    //Remover de la base
	this.reservasService.deleteReserva(reserva.id, texto);
	this.indice = null;
  }
  
   marcarRadioButton(i){
    this.indiceOcupado = null;
    this.indice = i;
	this.indiceAlert = i;
	this.indiceLiberar = i;
	var index = this.reservas.indexOf(i);
	var fecha = this.reservasService.formatearFecha(new Date().toISOString());
	var fechaReserva = this.reservasService.formatearFecha(this.reservas[index].fechaRese);
	var d = new Date();
	var hora = d.getHours();
	var minutos = d.getMinutes();
	var horas;
	var min;
	
	var horaDesdeReserva = (this.reservas[index].horaDesde).substr(0,2);
	var horaHastaReserva = (this.reservas[index].horaHasta).substr(0,2);
	
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
	
	var horaActual = Number(horas.toString() + min.toString());
	var numeroHoraHastaReserva = Number((this.reservas[index].horaHasta).replace(":",""));
	var numeroHoraDesdeReserva = Number((this.reservas[index].horaDesde).replace(":",""));
	
	if ((d.toISOString().substr(0, 10) == this.reservas[index].fechaRese.substr(0,10)) && (horaActual > numeroHoraHastaReserva)){
		this.indice = null;
	}
		
	//Valido para ocupar una cochera reservada: estado no Ocupado, fecha = hoy, hoario al hacer click en ocupar entre los horarios de reserva
	if((this.reservas[index].estado != "Ocupado") && (fechaReserva == fecha) && (hora >= Number(horaDesdeReserva)) && (hora <= Number(horaHastaReserva)) && 
		(horaActual >= numeroHoraDesdeReserva) && (horaActual <= numeroHoraHastaReserva)){
			
	   this.indiceOcupado = i;
	}
  }
  
  devolverColorFila(i){
	var index = this.reservas.indexOf(i);
	var diaActual = new Date();
	
	if (diaActual.toISOString().substr(0, 10) == this.reservas[index].fechaRese.substr(0,10)){
		return "#E1DEDE";
	}
  }
  
  
  setMensaje(index, callback){
	var reserva = this.reservas[index];
	var outerThis = this;
	
	this.reservasService.findByQuery(reserva.nombreCochera, reserva.espacioCochera, reserva.fechaRese, reserva.estado).then((data2) => {
		
		outerThis.reservasArray = data2;
		
		callback();
	});
	
  }
  
  showPrompt(subtitulo: string) {
    
	var index = this.reservas.indexOf(this.indice);
	var outerThis = this;
	this.mensaje = "";
	var texto = "";
	
	if (this.reservas[index].estado == "Ocupado"){
		texto = "<br>Horario Desde: <b>" + outerThis.reservas[index].horaDesde + " hs</b>";
		if (outerThis.mensaje != ""){
			texto = "<br>" + texto;
		}
	}
	
	if (subtitulo == null || subtitulo == "undefined"){subtitulo == ""};
	
	if (subtitulo != ""){
		texto = "<br><center><b>" + subtitulo + "</b></center>" + texto;
	}

	this.setMensaje(index, function(){
		if(outerThis.reservasArray.length > 1){
			outerThis.mensaje = "<center>Esta cochera tiene una o m\u00E1s reservas además de la actual</center>";
			texto = outerThis.mensaje + texto;
		}
	
	  if (outerThis.reservas[index].estado == "Ocupado"){
		let prompt = outerThis.alertCtrl.create({
		  title: 'Día: ' + outerThis.reservasService.formatearFecha(outerThis.reservas[index].fechaRese),
		  enableBackdropDismiss: false,
		  cssClass: 'alertcss',
		  inputs: [
			{
			  name: 'hasta',
			  placeholder: 'Hasta',
			  type: 'time',
			  value: outerThis.reservas[index].horaHasta,
			},
		  ],
		  message: texto,
		  buttons: [
			{
			  text: 'Guardar',
			  handler: data => {
				outerThis.reservasService.editReserva(outerThis.reservas[index], outerThis.reservas[index].horaDesde, data.hasta, function(subtitulo){
					if (subtitulo == ""){
						outerThis.marcarRadioButton(outerThis.indice);
					} else if (subtitulo != "No se pudo ocupar la cochera" || subtitulo != "Los horarios fueron modificados exitosamente"){
						outerThis.showPrompt(subtitulo);
					}
				});
			  }
			},
			 {
			  text: 'Cerrar',
			  role: 'cancel',
			},
		  ]
		});
		prompt.onDidDismiss((data) => outerThis.reservasService.editReserva(outerThis.reservas[index], outerThis.reservas[index].horaDesde, data.hasta, function(subtitulo){
						if (subtitulo == ""){
							outerThis.marcarRadioButton(outerThis.indice);
						} else if (subtitulo != "No se pudo ocupar la cochera" || subtitulo != "Los horarios fueron modificados exitosamente"){
							outerThis.showPrompt(subtitulo);
						}
					})
				);
		prompt.present();
	   
	  } else {
		  let prompt = outerThis.alertCtrl.create({
		  title: 'Día: ' + outerThis.reservasService.formatearFecha(outerThis.reservas[index].fechaRese),
		  enableBackdropDismiss: false,
		  cssClass: 'alertcss',
		  inputs: [
			{
			  name: 'desde',
			  placeholder: 'Desde',
			  type: 'time',
			  value: outerThis.reservas[index].horaDesde,
			},
			{
			  name: 'hasta',
			  placeholder: 'Hasta',
			  type: 'time',
			  value: outerThis.reservas[index].horaHasta
			},
		  ],
		  message: texto,
		  buttons: [
			{
			  text: 'Guardar',
			  handler: data => {
				outerThis.reservasService.editReserva(outerThis.reservas[index], data.desde, data.hasta, function(subtitulo){
					if (subtitulo == ""){
						outerThis.marcarRadioButton(outerThis.indice);
					} else if (subtitulo != "No se pudo ocupar la cochera" || subtitulo != "Los horarios fueron modificados exitosamente"){
						outerThis.showPrompt(subtitulo);
					}
				});
			  }
			},
			{
			  text: 'Cerrar',
			  role: 'cancel',
			},
		  ]
		});
		prompt.onDidDismiss((data) => {
				if(window.localStorage.getItem("noCancel") !== null){
					outerThis.reservasService.editReserva(outerThis.reservas[index], data.desde, data.hasta, 
					function(subtitulo){
						if (subtitulo == ""){
							outerThis.marcarRadioButton(outerThis.indice);
						} else if (subtitulo != "No se pudo ocupar la cochera" || subtitulo != "Los horarios fueron modificados exitosamente"){
							outerThis.showPrompt(subtitulo);
						}
						window.localStorage.removeItem("noCancel");
					});
				} else {
					outerThis.marcarRadioButton(outerThis.indice);
					window.localStorage.removeItem("noCancel");
				}
			}
		);
		prompt.present();
	  }
  });
	
  }
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Por favor aguarde...'
    });
    this.loading.present();
  }

  eliminarReserva() {
	var textoBoton;
	var index = this.reservas.indexOf(this.indiceAlert);
		if (this.reservas[index].estado == "Reservado"){
			var titulo = 'Eliminar Reserva';
			var subtitulo = '¿Desea eliminar esta reserva?';
			textoBoton = 'Eliminar';
		} else {
			var titulo = 'Liberar Cochera';
			var subtitulo = '¿Desea liberar la cochera seleccionada?';
			textoBoton = 'Liberar';
		}
	let alert = this.alertCtrl.create({
    title: titulo,
	enableBackdropDismiss: false,
    subTitle: subtitulo,
    buttons: [
      {
        text: textoBoton,
        handler: () => {
			this.deleteReserva(this.reservas[index], textoBoton);
			this.indiceOcupado = null;
			this.indiceLiberar = null;
		}
      },
	   {
        text: 'Cerrar',
        role: 'cancel',
      },
    ]
  });
  alert.present();
}

 ocuparReserva() {
	var index = this.reservas.indexOf(this.indice);
	let alert = this.alertCtrl.create({
    title: 'Ocupar Reserva ',
	enableBackdropDismiss: false,
    subTitle: '¿Desea ocupar la cochera en el horario de reserva seleccionado?',
    buttons: [
      {
        text: 'Ocupar',
        handler: () => {
		
			this.reservasService.ocupar(this.reservas[index],'Ocupar');
			this.marcarRadioButton(this.indice);
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

  alertGenerico(titulo: string, subtitulo: string) {
	let alert = this.alertCtrl.create({
    title: titulo,
	enableBackdropDismiss: false,
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
  
}
