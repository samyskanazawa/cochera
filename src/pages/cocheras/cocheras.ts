import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Reservas } from '../../providers/reservas';
import { Cocheras } from '../../providers/cocheras';
import { Usuarios } from '../../providers/usuarios';
//import { TmpDispo } from '../../providers/tmpDispo';
//import { TmpNoDispo } from '../../providers/tmpNoDispo';

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
	private fechaElegida = new Date().toISOString();
	private horaDesde: string;
	private horaHasta: string;
	private ocultarResultados: boolean;
	private disponibles: any;
	private noDisponibles: any;
	private habilitarBoton: string = "habilitado";
	private tmpDispo;
	private tmpNoDispo;
	private allUsuariosArray = [];
	private hoy: string;
	private indiceCocheraDisponible: any
	private indiceCocheraNoDisponible: any
	private minDate = new Date().toISOString();
	private error: boolean;
	private errorMismaCochera: boolean;
	private errorLimiteHoras: boolean;
	private errorHorarios: boolean;
	private errorRangoHorarios: boolean;
	private extenderReserva: boolean;
	private flagColores: boolean;
	private ultimoColor;
	private nombresMesesAMostrar = this.getNombreMeses();//['Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	private numerosDiasAMostrar = this.setDias();
	private numerosMesesAMostrar = this.setMeses();
	private telefonoNoDisponible: Number;
	
	
	reservas: any;
	
  constructor(public navCtrl: NavController, public reservasService: Reservas, public usuariosService: Usuarios, 
					public cocherasService: Cocheras, /*public tmpDispoService: TmpDispo, public tmpNoDispoService: TmpNoDispo,*/
						public alertCtrl: AlertController) {
	
	this.ocultarResultados = true;
	//this.setDia();
	//this.nombresMesesAMostrar = this.getDayNames();
	//console.log(this.nombresMesesAMostrar);
  }

  
    getNombreMeses(): Array<string> {
	  return [
	          "Enero",
			  " Febrero",
	          " Marzo",
	          " Abril",
			  " Mayo",
	          " Junio",
			  " Julio",
	          " Agosto",
			  " Septiembre",
	          " Octubre",
	          " Noviembre",
			  " Diciembre"
	  ];
  }
  
  devolverColorFilaDisponible(i){
	 //[ngStyle]="{'background-color': devolverColorFila(i)}"
	 var indexDisponibles = this.disponibles.indexOf(i);
	
	 var hoy = new Date(this.fechaElegida).toISOString();
	 var fechaSeteada = hoy.substr(0,10);
	 var fechaHoy = new Date().toISOString();
	 var fechaHoyParse = fechaHoy.substr(0,10);
	 var colorDevuelto;

	 var diaActual = new Date();
	 var hora = diaActual.getHours();
	 var minutos = diaActual.getMinutes();	
	 var v_DispoFila = this.disponibles[indexDisponibles].v_Dispo;
	 var v_DispoActual;
	 var dispo;
	 var horaHasta = "20:00";
	 var horaActual;
	 var horaDesde;
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
	 
	 if (this.flagColores == true){
		 if (fechaHoyParse == fechaSeteada){
			
			horaActual = horas.toString() + ":" + min;			
			horaDesde = horaActual;
			v_DispoActual = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
			dispo  =   v_DispoActual - v_DispoFila;
				
			if (dispo > 0 ) {
					this.ultimoColor = "#FFFA93"; //amarillo 
			} else {
					this.ultimoColor = "#DAF291"; //verde 
			}
			
		 } else {
		
			if(this.disponibles[indexDisponibles].v_Dispo == 1200) {
					this.ultimoColor = "#DAF291";
			}else{
					this.ultimoColor = "#FFFA93";
			}
		 }
	 }
	 return this.ultimoColor;
  }
  
  marcarRadioCocheraDisponible(i){
	  this.indiceCocheraDisponible = i;
  }
  
  marcarRadioCocheraNoDisponible(i){
	this.indiceCocheraNoDisponible = i;
	var index = this.noDisponibles.indexOf(this.indiceCocheraNoDisponible);
	this.telefonoNoDisponible = this.noDisponibles[index].v_telefono;
  }
  
  llamar(){
	  window.open("tel:" + this.telefonoNoDisponible);
  }
  
  setHoraDesde(){
	  this.horaDesde = new Date().toISOString();
  }
  
  setHoraHasta(){
	  this.horaHasta = new Date().toISOString();
  }
  
  setDias() : Array<number>{
	   var fecha = new Date();
	   var diaActual = fecha.getDate();
	   var numerosADevolver = [];
	   var i;
	   
	   for(i = diaActual; i <= 31; i++){
		   numerosADevolver.push(i);
	   }
	   
	   return numerosADevolver;
  }

  setMeses() : Array<number>{
	   //this.minDate = new Date().toISOString();
	   
	   var fechaParametro = new Date(this.fechaElegida);
	   var cantidadMeses = 12 - (fechaParametro.getMonth()+1);
	   var numerosMeses = [];
	   var i = 0;
	   var m = 0;
	   
	   for (i = fechaParametro.getMonth(); i <= cantidadMeses+1; i++){
		   numerosMeses.push(i+1);
	   }
	   
	   //console.log(numerosMeses);
	   
	   return numerosMeses;
  }
  
  changeDate(fechaElegida) {
	  //debugger;
	  var iguales = this.validarFecha(new Date(fechaElegida).toISOString(), new Date(this.minDate).toISOString());
	  this.flagColores = false;
	  
	  if(iguales){
		  this.hoy = new Date(fechaElegida).toISOString();
		  var fechaHoy = this.hoy.substr(0,11);
		  fechaHoy = fechaHoy + "03:00:00.000+0000";
		  this.fechaElegida = fechaHoy;
		  this.hoy = fechaHoy;//this.reservasService.formatearFecha(fechaHoy);
		  console.log(this.hoy);
		  this.habilitarBoton = this.hoy;
	  } else {
		  var titulo = 'Fecha inválida';
		  var subtitulo = 'La fecha ingresada debe ser mayor o igual a la fecha actual';
		  fechaElegida = this.minDate;
		  this.changeDate(fechaElegida);
		  this.habilitarBoton = null;
		  this.disponibles = [];
		  this.noDisponibles = [];
		  this.alertGenerico(titulo, subtitulo);
	  }
  }
  
  firstToUpperCase( str: string ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}
  
    validarFecha(fecha1, fecha2) {
	
	  var fecha1 = fecha1.substr(0,11);
	  var fecha2 = fecha2.substr(0,11);
	  var date1 = new Date(fecha1 + "03:00:00.000+0000");
	  var date2 = new Date(fecha2 + "03:00:00.000+0000");
	  var iguales: boolean = false;
	  
	  var mm1 = date1.getMonth() + 1; // getMonth() inicia en 0
	  var dd1 = date1.getDate();
	  var yy1 = date1.getFullYear();
	  
	  var mm2 = date2.getMonth() + 1; // getMonth() inicia en 0
	  var dd2 = date2.getDate();
	  var yy2 = date2.getFullYear();
	  
	  if(yy1 > yy2){	  
		iguales = true;
	  } else {	  
		if(yy1 == yy2){  
			if (mm1 == mm2 ){			
					if (dd1 >= dd2 ){
				       iguales = true;				
					} 					
			}else if ( mm1 > mm2 ){
				iguales = true;
			}
		}
	  } 
	  
	  return iguales;
    };
  
  buscar(){
	  this.changeDate(this.fechaElegida);
	  var fecha = this.hoy;
	  this.obtenerCocherasSinRango(fecha);
	  this.ocultarResultados = false;
	  this.indiceCocheraDisponible = null;
	  this.indiceCocheraNoDisponible = null;
	  this.flagColores = true;
  }
  
  queryReservas(v_nombre,v_espacio, v_fecha, estado, v_mail, horaDesde, horaHasta, allreservasArray ){
	  this.reservasService.findByQuery(v_nombre, v_espacio, v_fecha, estado).then((data2) => {
				
		var z;
		var v_Dispo;
		var horadesde;
		var	v_telefono;
		var v_nombreCompleto;
		var temporal = [];
		var mailTemporal = [];
		var i = 0;
		var item;
		var diaActual = new Date();
		var hora = diaActual.getHours();
		var minutos = diaActual.getMinutes();
		var min;
		var horas;
		//var horaActual = Number(hora.toString() + minutos.toString());
		
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
		
		var horaActual = horas.toString() + ":" + min;
		allreservasArray = data2;
		
		//debugger;
		
		if(allreservasArray.length > 1){
			allreservasArray.sort(function(a, b){return a.horaDesdeSort - b.horaDesdeSort});
		}

		if (allreservasArray.length <= 0) {
			
			if(diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10)){
				horaDesde = horaActual;
			} else {
				horaDesde = "08:00";
			}
			horaHasta = "20:00";
			v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
			this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde , horaHasta, v_Dispo});
		}
		else {
			
			//Busca rango disponible
			z = 0;
			if(diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10)){
				horadesde = horaActual;
			} else {
				horadesde = "08:00";
			}
			
			while(z < allreservasArray.length) {
				
				temporal.push(allreservasArray[z].horaDesde);
				temporal.push(allreservasArray[z].horaHasta);
				temporal.sort();
					
				//Cochera con horario/s dsponible/s
				if(temporal.length == (allreservasArray.length)*2){
					
					var m: number = temporal.length;
					var gruposN = m/2;
					var n : number = 0;
					var iterador;
					
					for(iterador = 0; iterador<gruposN; iterador++){
						var horaDesde1 = temporal[n];
						var horaHasta1 = temporal [n+1];
						
						var minutosDesdeReserva = (horaDesde1).substr(3,2);
						var numeroHoraHastaReserva = (horaHasta1).replace(":","");
					
						//debugger;
					
						//Iteramos los horarios desde las 08:00 y entre reservas para colocarlos como disponibles
						if (Number(horadesde.replace(":","")) < horaDesde1.replace(":","")) {
							horaDesde = horadesde;
							horaHasta = horaDesde1;
							v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
							//Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""));
							if(horaDesde != horaHasta){
								this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
							}
							var desdeTemporal = horaHasta1;
							//debugger;
							if(diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10) && (Number(horaActual.replace(":","")) > Number(desdeTemporal.replace(":","")))){
								horadesde = horaActual;
							} else {
								horadesde = desdeTemporal;
							}
						} else {
							var desdeTemporal = horaHasta1;
							if(diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10) && (Number(horaActual.replace(":","")) > Number(desdeTemporal.replace(":","")))){
								horadesde = horaActual;
							} else {
								horadesde = desdeTemporal;
							}
						}
						
						n = n + 2;
					}
				}
				
				mailTemporal.push(allreservasArray[z].mail);
				z = z + 1;		
			}
				
			//Horario/s no disponible/s de la cochera - Busco los datos de quien ocupa la cochera
			var outerThis = this;
			var vectorHoras = i;
			var iteradorMails = 0;
			var q;
			var index = -1;
			
			//Itero las reservas para agregar los tramos que las conforman como no disponibles 
			for (item in mailTemporal){
				this.buscarsUsuarios(function (){
						//if (outerThis.allUsuariosArray.length >= 0 && i <= (mailTemporal.length)-1) {
							
							var searchTerm = mailTemporal[iteradorMails];
							//debugger;
							
							for(q = 0; q < outerThis.allUsuariosArray[0].length; q++) {
								if (outerThis.allUsuariosArray[0][q].mail == searchTerm && index == -1) {
									index = q;
								}
							}
								
							//debugger;
							
							var usuario = outerThis.allUsuariosArray[0][index];//[outerThis.allUsuariosArray.length-1];
							index = -1;
							v_nombreCompleto = usuario.nombre + " " + usuario.apellido;
							//outerThis.firstToUpperCase((mailTemporal[iteradorMails].substring(0, mailTemporal[iteradorMails].indexOf(".")))) + " " + outerThis.firstToUpperCase((mailTemporal[iteradorMails].substring(mailTemporal[iteradorMails].indexOf(".") + 1, mailTemporal[iteradorMails].indexOf("@")))); // usuario[0].nombre + " " + usuario[0].apellido;
							v_telefono = usuario.telefono;
							var horaDesde = temporal[vectorHoras];
							var horaHasta = temporal [vectorHoras+1];
							var v_mail = mailTemporal[iteradorMails];
							v_Dispo = outerThis.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);

							//Colocamos como no disponible a la cochera para el rango de horarios hallado
							outerThis.tmpNoDispo.push({v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo, v_telefono, v_nombreCompleto});
							
							vectorHoras = vectorHoras + 2;
							iteradorMails = iteradorMails + 1;
							i++;
						//}
					});
				}

			//debugger;	
			//Tramo final: si la última reserva termina antes de las 20:00, inserto como horario
			//disponible el tramo desde el final de la reserva hasta las 20:00			
			if (horadesde != "20:00"){
			
				//Coloca como disponible a la cochera para el rango hallado
				horaHasta = "20:00"
				horaDesde = horadesde;
				v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
				this.tmpDispo.push({v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
			}
		}
	});
  };
  
  
  buscarsUsuarios (callback) {
	  this.usuariosService.getUsuarios().then((data) => {
		this.allUsuariosArray.push(data);
		callback();
	});
  }
  
  
  obtenerCocherasSinRango(v_fecha: string){
	  
	var v_mail;
	var v_items;
	var v_item;
	var v_nombre;
	var v_espacio: string;
	var allreservasArray;
	var estado: String;
	var horaDesde:string;
	var horaHasta: string;
	
	v_mail = "hernan.ruiz@softtek.com";
	
	//Traigo de la base todas las cocheras
	this.cocherasService.getCocheras().then((data) => {
		
		v_items = data;
		this.tmpDispo = [];
		this.tmpNoDispo = [];
		this.disponibles =  [];
		this.noDisponibles = [];
		this.allUsuariosArray = [];
		//debugger;
		//var v_fechaFormateada = this.reservasService.formatearFecha(v_fecha);
		//var fecha = (new Date(this.reservasService.formatearFechaADate(v_fecha))).toISOString();
		//v_fecha = fecha;
		
		//Itero las cocheras encontradas para buscar reservas en el día seleccionado
		for (let item of v_items) {
			
			v_item = item;
			v_nombre = v_item.nombre;
			v_espacio = v_item.espacio;
			
			//Se buscará por estado diferente a "Libre"
			estado = "Libre";
			this.queryReservas(v_nombre, v_espacio, v_fecha, estado, v_mail, horaDesde, horaHasta, allreservasArray );
		}
		
		this.disponibles = this.tmpDispo;
		this.noDisponibles = this.tmpNoDispo;
	});
 }

 
  showPrompt(subtitulo: string) {
	var index = this.disponibles.indexOf(this.indiceCocheraDisponible);
    let prompt = this.alertCtrl.create({
      title: 'Día: ' + this.reservasService.formatearFecha(this.disponibles[index].v_fecha) + ' - Cochera: ' + this.disponibles[index].v_espacio,
      inputs: [
	  
        {
          name: 'desde',
		  placeholder: 'Desde',
		  type: 'time',
		  value: this.disponibles[index].horaDesde
        },
		{
		  name: 'hasta',
		  placeholder: 'Hasta',
		  type: 'time',
		  value: this.disponibles[index].horaHasta
		},
		/*{	
			type: "checkbox",
			name: 'Todo el día:',
			label: 'Todo el día',
			value: 'Todo el día:'
		},*/
		
      ],
	  message: "<br/><center><b>" + subtitulo + "</center></b>",
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
			//({v_mail , v_nombre, v_espacio, v_fecha, horaDesde , horaHasta, v_Dispo});
				//mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, estado, horaDesdeSort
			var reserva = [];
			var mail = this.disponibles[index].v_mail;
			var nombreCochera = this.disponibles[index].v_nombre;
			var espacioCochera: String;
			espacioCochera = (this.disponibles[index].v_espacio).toString();
			var fechaRese = this.disponibles[index].v_fecha;
			var horaDesde = data.desde;
			var horaHasta = data.hasta;
			var horaDesdeSort = Number(horaDesde.replace(":",""));
			var estado = "Reservado";
			var fechaAlta = "";
			var fechaOcupa = "";
			var fechaLibre = "";
			var contadorReservas = 0;
			var item;
			var resultado: boolean;
			var error: boolean;
			var outerThis = this;
			var w;
		
			this.obtenerCocheras(horaDesde, horaHasta, fechaRese, mail, nombreCochera, this.disponibles[index].v_espacio, function(){
				//debugger;
				if(!outerThis.errorHorarios){
					if(!outerThis.errorRangoHorarios){
						if(!outerThis.errorLimiteHoras){
							if(!outerThis.errorMismaCochera){
								if(!outerThis.extenderReserva){
									if(!outerThis.error){
										if(data.desde >= outerThis.disponibles[index].horaDesde && data.hasta <= outerThis.disponibles[index].horaHasta){
											reserva.push({mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, fechaAlta, estado, fechaOcupa, fechaLibre, horaDesdeSort});
											outerThis.reservasService.createReserva(reserva[0], function(resultado: boolean){
													outerThis.buscar();
											});
										} else {
											//var titulo = 'Horario Inválido';
											var subtitulo = 'No es posible guardar el horario deseado, esta cochera ya posee una reserva';
											outerThis.errorHorarios = false;
											outerThis.showPrompt(subtitulo);
										}
									}else {
										//var titulo = 'Horario Inválido';
										var subtitulo = 'El horario seleccionado se superpone con el de otra reserva';
										outerThis.errorHorarios = false;
										outerThis.showPrompt(subtitulo);
									}
								} else {
									//var titulo = 'Extender Reserva';
									var subtitulo = 'Ya cuenta con una reserva para esta cochera en el día seleccionado, puede extenderla desde la pestaña Mis Reservas';
									outerThis.extenderReserva = false;
									outerThis.showPrompt(subtitulo);
								}
							} else {
								//var titulo = 'Cochera Inválida';
								var subtitulo = 'Ya tiene reservada esta cochera en el día seleccionado';
								outerThis.errorMismaCochera = false;
								outerThis.showPrompt(subtitulo);
							}
						} else {
							//var titulo = 'Horario Inválido';
							var subtitulo = 'El lapso de tiempo mínimo para una reserva es de una hora';
							outerThis.errorLimiteHoras = false;
							outerThis.showPrompt(subtitulo);
						}
					} else {
						//var titulo = 'Horario Inválido';
						var subtitulo = 'El horario permitido es entre las 08:00 hs y las 20:00 hs';
						outerThis.errorRangoHorarios = false;
						outerThis.showPrompt(subtitulo);
					}
				} else {
					//var titulo = 'Horario Inválido';
					var subtitulo = 'El horario inicial debe ser anterior al horario final';
					outerThis.errorHorarios = false;
					outerThis.showPrompt(subtitulo);
				}
			});
			
			
			//outerThis.buscar();
          }
        },
		{
          text: 'Cerrar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    prompt.present();
  }
  
  
  	
	obtenerCocheras(horaDesde: string, horaHasta: string, v_fecha: string, v_mail: string, nombre: string, espacio: number, callback){
		
		var allreservasArray;
		var outerThis = this;
		var mismaCochera: boolean = false;
		//debugger;
		
		this.reservasService.getReservasByFechaRese(v_fecha).then((data) => {
			allreservasArray = data;
			var z = 0;
			var temporal = [];
			var temporalReservasOtrosUsuarios = [];
			var cocherasResevadasOtrosUsuarios: Array<string> = [];
			var temporalMailOtrosUsuarios: Array<string> = [];
			var horariosDisponibles = [];
			var horaDesdeCampoHora: number = Number((horaDesde).substr(0,2));
			var horaHastaCampoHora: number = Number((horaHasta).substr(0,2));
			var p;
			
			//debugger;
			
			if(horaDesdeCampoHora <= horaHastaCampoHora){
				
				if(Number(horaDesde.replace(":","")) >= 800 && Number(horaHasta.replace(":","")) <= 2000){
					//debugger;
					if((horaHastaCampoHora - horaDesdeCampoHora) >= 1 && (Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""))) >= 100){
				
						while(z < allreservasArray.length) {
							
							//Busco reservas del mismo usuario sobre otras cocheras, para el día en el que quiere reservar una.
							if (allreservasArray[z].fechaRese.substr(0, 10) == v_fecha.substr(0, 10)){
								if(allreservasArray[z].mail == v_mail){
									temporal.push(allreservasArray[z].horaDesde);
									temporal.push(allreservasArray[z].horaHasta);
									temporal.sort();
								} else {
									temporalReservasOtrosUsuarios.push(allreservasArray[z].horaDesde);
									temporalReservasOtrosUsuarios.push(allreservasArray[z].horaHasta);
									temporalReservasOtrosUsuarios.sort();
									cocherasResevadasOtrosUsuarios.push(allreservasArray[z].espacioCochera);
									temporalMailOtrosUsuarios.push(allreservasArray[z].mail);
								}
								
							}
							
						z = z + 1;
						}

						//debugger;
						
						//if (!mismaCochera){
							
							var numeroHoraDesde = Number(horaDesde.replace(":",""));
							var numeroHoraHasta = Number(horaHasta.replace(":",""));
						
							//Itero los los resultados de la búsqueda y comparo horarios.
							//if(temporal.length == (allreservasArray.length)*2){
							
								var n : number = 0;
								var j : number = 0;
								var iterador;
								var c;
								var r;
								var mismaCochera = false;
								var horaDesde1Numero = 2000;
								var horaHasta1Numero = 0;
								var horaInicial = 800;
								var horaFinal = 2000;
								var temporalJoin = [];
								
								for(r = 0; r < cocherasResevadasOtrosUsuarios.length; r++){
									if (Number(cocherasResevadasOtrosUsuarios[r]) == espacio && mismaCochera == false){
										mismaCochera = true;
									}
								}
								
								if (temporal.length > 0){
									if(mismaCochera == true){
										temporalJoin = temporal.concat(temporalReservasOtrosUsuarios);
									} else {
										temporalJoin = temporal;
									}
								} else {
									if(mismaCochera == true){
										temporalJoin = temporalReservasOtrosUsuarios;
									}
								}
								
								temporalJoin.sort();
								
								if(temporalJoin.length > 0){
										
									var m: number = temporalJoin.length;
									var gruposN = m/2;
									
									//if(temporalJoin.length > 0){
										var horaDesdeInicial = Number(temporalJoin[j].replace(":",""));
										var horaHastaInicial = Number(temporalJoin[j+1].replace(":",""));
										
										if (horaInicial < horaDesdeInicial){
												horariosDisponibles.push(horaInicial);
												horariosDisponibles.push(horaDesdeInicial);
										}
										
										for(iterador = 1; iterador < gruposN; iterador++){
											
											j = j + 2;
											
											var horaDesdeActual = Number(temporalJoin[j].replace(":",""));
											var horaHastaActual = Number(temporalJoin[j+1].replace(":",""));

											if (horaHastaInicial < horaDesdeActual){
												horariosDisponibles.push(horaHastaInicial);
												horariosDisponibles.push(horaDesdeActual);
											}
											
											horaDesdeInicial = horaDesdeActual;
											horaHastaInicial = horaHastaActual;
										}
										
										if (horaHastaInicial < horaFinal){
												horariosDisponibles.push(horaHastaInicial);
												horariosDisponibles.push(horaFinal);
										}
									//debugger;
									//Si no tengo horarios disponibles entre las reservas existentes
									if (horariosDisponibles.length == 0){
										
										for(iterador = 0;  iterador < m; iterador++){
											
											var minimo = Number(temporalJoin[n].replace(":",""));
											
											if(horaDesde1Numero > minimo){
												horaDesde1Numero = minimo;
											}
											
											var maximo = Number(temporalJoin[n].replace(":",""));
											
											if(horaHasta1Numero < maximo){
												horaHasta1Numero = maximo;
											}
											
											n = n + 1;
										}
									
										outerThis.error = false;
										//var horaDesde1Numero = Number(horaDesde1.replace(":",""));
										//var horaHasta1Numero = Number(horaHasta1.replace(":",""));
										
											//Si extiendo hora Hasta y se me superpone con otra reserva existente.
											if ((numeroHoraDesde < horaDesde1Numero) && (numeroHoraHasta >= horaDesde1Numero) && (numeroHoraHasta < horaHasta1Numero)){
												outerThis.error = true;
											}
											
											//Si atraso hora Desde y se me superpone con otra reserva existente.
											if ((numeroHoraDesde >= horaDesde1Numero) && (numeroHoraDesde < horaHasta1Numero) && (numeroHoraHasta > horaHasta1Numero)){
												outerThis.error = true;
											}
											
											//Si hora Desde y hora Hasta me quedan dentro de otra reserva existente.
											if ((numeroHoraDesde >= horaDesde1Numero) && (numeroHoraDesde < horaHasta1Numero) && (numeroHoraHasta > horaDesde1Numero) && (numeroHoraHasta <= horaHasta1Numero)){
												outerThis.error = true;
											}
											
											//Si hora Desde y hora Hasta engloban otra reserva existente.
											if ((numeroHoraDesde <= horaDesde1Numero) && (numeroHoraHasta >= horaHasta1Numero)){
												outerThis.error = true;
											}
											
										} else {
											
											var h: number = horariosDisponibles.length;
											var gruposH = h/2;
											var iteradorDisponibles;
											var l = 0;
											
											outerThis.error = true;
											
											for(iteradorDisponibles = 0; iteradorDisponibles < gruposH; iteradorDisponibles++){
												
												var horaDesdeDisponible = horariosDisponibles[l];
												var horaHastaDisponible = horariosDisponibles[l+1];
													
												//Si los horarios que quiero reservar coinciden con algún horario disponible.
												if ((numeroHoraDesde >= horaDesdeDisponible) && (numeroHoraHasta <= horaHastaDisponible)){
													
													if(temporalMailOtrosUsuarios[iteradorDisponibles] == v_mail){
														if(((numeroHoraDesde > 800 && horaHastaDisponible > 800) && ((numeroHoraDesde - horaDesdeDisponible) < 100)) 
															|| (((horaHastaDisponible - numeroHoraHasta) < 100) && (numeroHoraDesde < 2000 && horaHastaDisponible < 2000))){
															outerThis.extenderReserva = true;
														} else {
															outerThis.error = false;
														}
													} else {
															outerThis.error = false;
													}
												}

												l = l + 2;
											}
								
										}
										/*} else {
											outerThis.error = false;
										}*/
								} else {
									outerThis.error = false;
								}
									/*} else {
											outerThis.errorMismaCochera = true;
									}*/
								} else {
									outerThis.errorLimiteHoras = true;
								}
					
				} else {
					outerThis.errorRangoHorarios = true;
				}
					
					
			} else {
				outerThis.errorHorarios = true;
			}
			
			callback();
		});	
	}
	
	/*	var outerThis = this;
		
		this.cocherasService.getCocheras().then((data) => {
			var v_items = data;
			var v_item;
			var item;
			var v_espacio;
			var estado;
			var v_nombre;
			this.disponibles =  [];
			this.noDisponibles = [];
			var allreservasArray;
			debugger;
			//var v_fechaFormateada = this.reservasService.formatearFecha(v_fecha);
			//var fecha = (new Date(this.reservasService.formatearFechaADate(v_fecha))).toISOString();
			//v_fecha = fecha;
			
			//Itero las cocheras encontradas para buscar reservas en el día seleccionado
			for (let item of v_items) {
				
				v_item = item;
				v_nombre = v_item.nombre;
				v_espacio = v_item.espacio;
				
				//Se buscará por estado diferente a "Libre"
				estado = "Libre";
				this.buscarOtrasReservasDelUsuario(v_nombre, v_espacio, v_fecha, estado, v_mail, horaDesde, horaHasta, allreservasArray);
			}
			
		});
		callback();
	}*/
  
  
  /*buscarOtrasReservasDelUsuario(nombre: string, espacio: number, v_fecha: string, v_mail: string, estado: string, horaDesde: string, horaHasta: string, allreservasArray){
	  
	  var outerThis = this;
	  
	  this.reservasService.findByQuery(nombre, espacio, v_fecha, estado).then((data) => {
		  allreservasArray = data;
		  	  
		var z = 0;
		var temporal = [];
	
	  while(z < allreservasArray.length) {
			
		
			
			//Busco reservas del mismo usuario sobre otras cocheras, para el día en el que quiere reservar una.
			if ((allreservasArray[z].mail == v_mail) && (allreservasArray[z].nombreCochera == nombre) && (allreservasArray[z].espacioCochera != espacio)){
				temporal.push(allreservasArray[z].horaDesde);
				temporal.push(allreservasArray[z].horaHasta);
				temporal.sort();
			}
			
			  var z = 0;
			  var numeroHoraDesde = Number(horaDesde.replace(":",""));
			  var numeroHoraHasta = Number(horaHasta.replace(":",""));
			  var temporal = [];
			
			//Itero los los resultados de la búsqueda y comparo horarios.
			if(temporal.length == (allreservasArray.length)*2){
				
				var m: number = temporal.length;
				var gruposN = m/2;
				var n : number = 0;
				var iterador;
				
				for(iterador = 0; iterador<gruposN; iterador++){
					
					var horaDesde1 = temporal[n];
					var horaHasta1 = temporal [n+1];
					
					var horaDesde1Numero = Number(horaDesde1.replace(":",""));
					var horaHasta1Numero = Number(horaHasta1.replace(":",""));
				
					//Si extiendo hora Hasta y se me superpone con otra reserva existente.
					if ((numeroHoraDesde < horaDesde1Numero) && (numeroHoraHasta > horaDesde1Numero) && (numeroHoraHasta < horaHasta1Numero)){
						outerThis.error = true;
					}
					
					//Si atraso hora Desde y se me superpone con otra reserva existente.
					if ((numeroHoraDesde > horaDesde1Numero) && (numeroHoraDesde < horaHasta1Numero) && (numeroHoraHasta > horaHasta1Numero)){
						outerThis.error = true;
					}
					
					//Si hora Desde y hora Hasta me quedan dentro de otra reserva existente.
					if ((numeroHoraDesde > horaDesde1Numero) && (numeroHoraDesde < horaHasta1Numero) && (numeroHoraHasta > horaDesde1Numero) && (numeroHoraHasta < horaHasta1Numero)){
						outerThis.error = true;
					}
					
					//Si hora Desde y hora Hasta engloban otra reserva existente.
					if ((numeroHoraDesde < horaDesde1Numero) && (numeroHoraHasta > horaHasta1Numero)){
						outerThis.error = true;
					}
				
					n = n + 2;
				}
			} else {
				outerThis.error = false;
			}
		}
					
	  });
	  
  }*/
  
  
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
  
  
  ionViewDidLoad() {
    console.log('Página Cocheras');
  }

}
