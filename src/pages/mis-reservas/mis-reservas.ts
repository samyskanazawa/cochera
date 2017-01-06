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
  reservas: any;
  radios: any;
  
  
  ionViewDidLoad() {
    
	this.reservasService.getReservasByMailAndFechaRese(this.mail, this.fechaRese).then((data) => {
	  console.log(data);
	  this.reservas = data;
	  this.reservas[0].checked = true;
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
  
  deleteReserva(reserva){
 
    //Remove locally
      let index = this.reservas.indexOf(reserva);
 
      if(index > -1){
        this.reservas.splice(index, 1);
      }   
 
    //Remove from database
	this.reservasService.deleteReserva(reserva.id);
	this.indice = null;
  }
  
   marcarRadioButton(i){
   
    this.indiceOcupado = null;
    this.indice = i;
	var index = this.reservas.indexOf(i);
	var fecha = this.reservasService.formatearFecha(new Date().toISOString());
	var fechaReserva = this.reservasService.formatearFecha(this.reservas[index].fechaRese);

	if(this.reservas[index].estado != "Ocupado" && fechaReserva == fecha ){
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
  
  
  setMensaje(index){
	this.mensaje = "";
	this.tieneReserva = false;
	
	if (index === 0){
		this.tieneReserva = true;
	}
	if (this.tieneReserva == true){
		this.mensaje = "";
	}
  }
  
  showPrompt() {
	var index = this.reservas.indexOf(this.indice);
	this.setMensaje(index);
    let prompt = this.alertCtrl.create({
      title: 'Día: ' + this.reservasService.formatearFecha(this.reservas[index].fechaRese),
	  cssClass: 'alertcss',
      inputs: [
        {
          name: 'desde',
		  placeholder: 'Desde',
		  type: 'time',
		  value: this.reservas[index].horaDesde
        },
		{
		  name: 'hasta',
		  placeholder: 'Hasta',
		  type: 'time',
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
      ]
    });
    prompt.present();
  }

  
  eliminarReserva() {
	var index = this.reservas.indexOf(this.indice);
		if (this.reservas[index].estado == "Reservado"){
			var titulo = 'Eliminar Reserva';
			var subtitulo = '¿Desea eliminar esta reserva?';
			var textoBoton = 'Eliminar';
		} else {
			var titulo = 'Liberar Cochera';
			var subtitulo = '¿Desea liberar la cochera seleccionada?';
			var textoBoton = 'Liberar';
		}
	let alert = this.alertCtrl.create({
    title: titulo,
    subTitle: subtitulo,
    buttons: [
      {
        text: 'Volver',
        role: 'cancel',
      },
      {
        text: textoBoton,
        handler: () => {
			this.deleteReserva(this.reservas[index]);
		}
      }
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
        text: 'Volver',
        role: 'cancel',
      },
      {
        text: 'Ocupar',
        handler: () => {
			this.reservasService.ocupar(this.reservas[index]);
			this.marcarRadioButton(this.indice);
		}
      }
    ]
  });
  alert.present();
}

  
}
