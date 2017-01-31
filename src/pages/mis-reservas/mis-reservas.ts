import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Reservas } from '../../providers/reservas';
import { OrderBy } from '../../pipes/sort';

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
  private indice: number;
  private indiceOcupado;
  private mail: string = "hernan.ruiz@softtek.com";
  private fechaRese = new Date().toISOString();
  private reservasArray: any;
  reservas: any;
  radios: any;
  
  
  ionViewDidEnter() {
    
	this.reservasService.getReservasByMailAndFechaRese(this.mail, this.fechaRese).then((data) => {
	  console.log(data);
	  this.reservas = data;
	  this.reservas[0].checked = true;
	  this.indiceOcupado = null;
	  this.indice = null;
	});
  }
  
  /*getReservas(){
	  var fecha = new Date().toISOString();
	  debugger;
	  var fechaTransformada = this.formatearFecha(fecha);
	  this.reservasService.getReservasByFecha(fechaTransformada).then((data) => {
      console.log(data);
      this.reservas = data;
	  this.reservas[0].checked = true;
    });
  }*/
  
  constructor(public navCtrl: NavController, public reservasService: Reservas, private viewCtrl: ViewController, public alertCtrl: AlertController) {
	this.tieneReserva = false;
	
  }
  
  deleteReserva(reserva, texto: string){
 
    //Remove locally
      let index = this.reservas.indexOf(reserva);
 
      if(index > -1){
        this.reservas.splice(index, 1);
      }   
 
    //Remove from database
	this.reservasService.deleteReserva(reserva.id, texto);
	this.indice = null;
  }
  
   marcarRadioButton(i){
   //debugger;
    this.indiceOcupado = null;
    this.indice = i;
	var index = this.reservas.indexOf(i);
	var fecha = this.reservasService.formatearFecha(new Date().toISOString());
	var fechaReserva = this.reservasService.formatearFecha(this.reservas[index].fechaRese);
	var d = new Date();
	var hora = d.getHours();
	var minutos = d.getMinutes();
	var horas;
	var min;
	
	var horaDesdeReserva = (this.reservas[index].horaDesde).substr(0,2);
	var minutosDesdeReserva = (this.reservas[index].horaDesde).substr(3,2);
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
			
	//Valido para ocupar una cochera reservada: estado no Ocupado, fecha = hoy, hoario al hacer click en ocupar entre los horarios de reserva
	if((this.reservas[index].estado != "Ocupado") && (fechaReserva == fecha) && (hora >= Number(horaDesdeReserva)) && (hora <= Number(horaHastaReserva)) && 
		(horaActual >= numeroHoraDesdeReserva) && (horaActual <= numeroHoraHastaReserva)){
			
	   this.indiceOcupado = i;
	}
  }
  
  devolverColorFila(i){
	//[ngStyle]="{'background-color': devolverColorFila(i)}"
	var index = this.reservas.indexOf(i);
	switch (this.reservas[index].estado) {
            case 'Libre':
                return "green";
            case 'Reservado':
                return "yellow";
            default:
				 "red";
        }
  }
  
  
  setMensaje(index, callback){
	var reserva = this.reservas[index];
	var outerThis = this;
	var array;
	var texto = "";
	
	this.reservasService.findByQuery(reserva.nombreCochera, reserva.espacioCochera, reserva.fechaRese, reserva.estado).then((data2) => {
		
		outerThis.reservasArray = data2;
		
		callback();
	});
	
  }
  
  showPrompt() {
	var index = this.reservas.indexOf(this.indice);
	//debugger;
	var outerThis = this;
	this.mensaje = "";

	this.setMensaje(index, function(){
		if(outerThis.reservasArray.length > 1){
			outerThis.mensaje = "Esta cochera tiene una o más reservas además de la actual";
		}

  if (outerThis.reservas[index].estado == "Ocupado"){ 
	let prompt = outerThis.alertCtrl.create({
      title: 'Día: ' + outerThis.reservasService.formatearFecha(outerThis.reservas[index].fechaRese),
	  cssClass: 'alertcss',
      inputs: [
		{
		  name: 'hasta',
		  placeholder: 'Hasta',
		  type: 'time',
		  value: outerThis.reservas[index].horaHasta
		},
      ],
	  message: "Hora Desde: " + outerThis.reservas[index].horaDesde + ". " + outerThis.mensaje,
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            outerThis.reservasService.editReserva(outerThis.reservas[index], outerThis.reservas[index].horaDesde, data.hasta, function(){
				outerThis.marcarRadioButton(outerThis.indice);
			});
          }
        },
		 {
          text: 'Cerrar',
          role: 'cancel',
        },
      ]
    });
	prompt.present();
   
  } else {
	  let prompt = outerThis.alertCtrl.create({
      title: 'Día: ' + outerThis.reservasService.formatearFecha(outerThis.reservas[index].fechaRese),
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
	  message: outerThis.mensaje,
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            outerThis.reservasService.editReserva(outerThis.reservas[index], data.desde, data.hasta, function(){
				outerThis.marcarRadioButton(outerThis.indice);
			});
			
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
  
  });
	
  }

  
  eliminarReserva() {
	var textoBoton;
	var index = this.reservas.indexOf(this.indice);
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
    subTitle: subtitulo,
    buttons: [
      {
        text: textoBoton,
        handler: () => {
			this.deleteReserva(this.reservas[index], textoBoton);
			this.indiceOcupado = null;
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

  
}
