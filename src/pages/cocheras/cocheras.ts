import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Reservas } from '../../providers/reservas';
import { Cocheras } from '../../providers/cocheras';
import { Usuarios } from '../../providers/usuarios';

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
	public fechaElegida = new Date().toISOString();
	public horaDesde: string;
	public horaHasta: string;
	public ocultarResultados: boolean;
	public disponibles: any;
	public disponiblesParcial: any;
	public noDisponibles: any;
	public habilitarBoton: string = "habilitado";
	public tmpDispo;
	public tmpDispoParcial;
	public tmpNoDispo;
	public allUsuariosArray = [];
	public hoy: string;
	public indiceCocheraDisponible: any;
	public indiceCocheraDisponibleParcial: any;
	public indiceCocheraNoDisponible: any;
	public indiceRadio: any;
	public minDate = new Date().toISOString();
	public error: boolean;
	public errorMismaCochera: boolean;
	public errorLimiteHoras: boolean;
	public errorHorarios: boolean;
	public errorRangoHorarios: boolean;
	public extenderReserva: boolean;
	public flagColores: boolean;
	public flagDisponibleParcial;
	public ultimoColor;
	public telefonoNoDisponible: Number;
	public mail = window.localStorage.getItem("email");
	reservas: any;
	
  constructor(public navCtrl: NavController, public reservasService: Reservas, public usuariosService: Usuarios, 
					public cocherasService: Cocheras, public alertCtrl: AlertController) {
	
	this.ocultarResultados = true;
  }

  obtenerHoraActual(){
	var diaActual = new Date();
	var hora = diaActual.getHours();
	var minutos = diaActual.getMinutes();
	var min;
	var horas;

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
	return horaActual;
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
	 var indexDisponibles = this.disponibles.indexOf(i);
	
	 var hoy = new Date(this.fechaElegida).toISOString();
	 var fechaSeteada = hoy.substr(0,10);
	 var fechaHoy = new Date().toISOString();
	 var fechaHoyParse = fechaHoy.substr(0,10);

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

	 var numeroHoraActual = Number(horas.toString() + min);
	 
	 if (this.flagColores == true){
		 if (fechaHoyParse == fechaSeteada && numeroHoraActual >= 800){
			
			horaActual = horas.toString() + ":" + min;			
			horaDesde = horaActual;
			v_DispoActual = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
			dispo  =   v_DispoActual - v_DispoFila;
				
			if (dispo <= 0 ) {
				this.ultimoColor = "#DAF291"; //verde
			}
			
		 } else {
			if(this.disponibles[indexDisponibles].v_Dispo == 1200) {
					this.ultimoColor = "#DAF291"; //verde
			}
		 }
	 }
	 return this.ultimoColor;
  }
  
  devolverColorFilaDisponibleParcial(i){
		return "#FFFA93"; //amarillo	
  }
  
  devolverColorFilaNoDisponible(i){
	  var indexNoDisponibles = this.noDisponibles.indexOf(i);
	  
	  if(this.mail == this.noDisponibles[indexNoDisponibles].v_mail){
		  return "#FFFADD";
	  }
  }
  
  marcarRadioCocheraDisponible(i){
	  this.indiceCocheraDisponible = i;
	  this.flagDisponibleParcial = false;
  }
  
  marcarRadioCocheraDisponibleParcial(i){
	  this.indiceCocheraDisponibleParcial = i;
	  this.indiceCocheraDisponible = i;
	  this.flagDisponibleParcial = true;
  }
  
  marcarRadioCocheraNoDisponible(i){
	this.indiceCocheraNoDisponible = null;
	this.flagDisponibleParcial = false;
	var index = this.noDisponibles.indexOf(i);
	this.telefonoNoDisponible = this.noDisponibles[index].v_telefono;
	
	if(this.noDisponibles[index].v_mail != this.mail){
		this.indiceCocheraNoDisponible = i;
	}
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

  setMeses() : Array<number>{
	   var fechaParametro = new Date(this.minDate);
	   var cantidadMeses = 12 - (fechaParametro.getMonth()+1);
	   var numerosMeses = [];
	   var i = 0;
	   
	   for (i = fechaParametro.getMonth(); i <= cantidadMeses+1; i++){
		   numerosMeses.push(i+1);
	   }
	   
	   return numerosMeses;
  }
  
  changeDate(fechaElegida) {
	 
	  this.indiceRadio = null;
	  var fechaElegidaNoAnterior = this.validarFecha(new Date(fechaElegida).toISOString(), new Date(this.minDate).toISOString());
	  this.flagColores = false;
	  
	  if(fechaElegidaNoAnterior){
		  this.hoy = new Date(fechaElegida).toISOString();
		  var fechaHoy = this.hoy.substr(0,11);
		  fechaHoy = fechaHoy + "03:00:00.000+0000";
		  this.fechaElegida = fechaHoy;
		  this.hoy = fechaHoy;
		  this.habilitarBoton = this.hoy;
	  } else {
		  var titulo = 'Fecha inv\u00E1lida';
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
	  var noAnterior: boolean = false;
	  
	  var mm1 = date1.getMonth() + 1; // getMonth() inicia en 0
	  var dd1 = date1.getDate();
	  var yy1 = date1.getFullYear();
	  
	  var mm2 = date2.getMonth() + 1; // getMonth() inicia en 0
	  var dd2 = date2.getDate();
	  var yy2 = date2.getFullYear();
	  
	  if(yy1 > yy2){	  
		noAnterior = true;
	  } else {	  
		if(yy1 == yy2){  
			if (mm1 == mm2 ){			
					if (dd1 >= dd2 ){
				       noAnterior = true;				
					} 					
			}else if ( mm1 > mm2 ){
				noAnterior = true;
			}
		}
	  } 
	  
	  return noAnterior;
    };
  
  buscar(){
	  this.changeDate(this.fechaElegida);
	  var fecha = this.hoy;
	  var horaActual = this.obtenerHoraActual();
	  var diaActual = new Date();
	  var parseFechaHoy = ((diaActual.toISOString()).substr(0, 10));
	  var parseFechaElegida = (this.fechaElegida.substr(0, 10));
	  var numeroFechaHoy = Number(parseFechaHoy.replace(/-/g , ""));
	  var numeroFechaElegida = Number(parseFechaElegida.replace(/-/g , ""));
	  if (((numeroFechaHoy == numeroFechaElegida) && horaActual < 2000) || (numeroFechaElegida > numeroFechaHoy)){
		  this.obtenerCocherasSinRango(fecha);
		  this.indiceRadio = 1;
		  this.ocultarResultados = false;
		  this.indiceCocheraDisponible = null;
		  this.indiceCocheraNoDisponible = null;
		  this.flagColores = true;
	  } else {
			this.habilitarBoton = null;
			this.disponibles = [];
			this.noDisponibles = [];
	  }
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
		
		if(allreservasArray.length > 1){
			allreservasArray.sort(function(a, b){return a.horaDesdeSort - b.horaDesdeSort});
		}

		if (allreservasArray.length <= 0) {
			
			if((diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10)) && (Number(horaActual.replace(":","")) >= 800)){
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
			if((diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10)) && (Number(horaActual.replace(":","")) >= 800)){
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
					
						//Iteramos los horarios desde las 08:00 y entre reservas para colocarlos como disponibles
						if (Number(horadesde.replace(":","")) < horaDesde1.replace(":","")) {
							horaDesde = horadesde;
							horaHasta = horaDesde1;
							v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
							
							if(horaDesde != horaHasta){
								this.tmpDispoParcial.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
							}
							
							var desdeTemporal = horaHasta1;

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
				this.buscarUsuarios(mailTemporal[iteradorMails], function (){
							var searchTerm = mailTemporal[iteradorMails];
							
							for(q = 0; q < outerThis.allUsuariosArray.length; q++) {
								if (outerThis.allUsuariosArray[q][0].mail == searchTerm && index == -1) {
									index = q;
									break;
								}
							}
							
							var usuario = outerThis.allUsuariosArray[index][0];//[outerThis.allUsuariosArray.length-1];
							index = -1;
							v_nombreCompleto = usuario.nombre + " " + usuario.apellido;
							v_telefono = usuario.telefono;
							var horaDesde = temporal[vectorHoras];
							var horaHasta = temporal [vectorHoras+1];
							var v_mail = mailTemporal[iteradorMails];
							v_Dispo = outerThis.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);

							//Colocamos como no disponible a la cochera para el rango de horarios hallado
							outerThis.tmpNoDispo.push({v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo, v_telefono, v_nombreCompleto});
							vectorHoras = vectorHoras + 2;
							iteradorMails = iteradorMails + 1;
					});
				}
	
			//Tramo final: si la última reserva termina antes de las 20:00, inserto como horario
			//disponible el tramo desde el final de la reserva hasta las 20:00			
			if (horadesde != "20:00"){
			
				//Coloca como disponible a la cochera para el rango hallado
				horaHasta = "20:00"
				horaDesde = horadesde;
				v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
				this.tmpDispoParcial.push({v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
			}
		}
	});
  };
  
  
  buscarUsuarios (mail: string, callback) {
	  this.usuariosService.getUsuariosByMail(mail).then((data) => {
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
	
	v_mail = this.mail;
	
	//Traigo de la base todas las cocheras
	this.cocherasService.getCocheras().then((data) => {
		
		v_items = data;
		this.tmpDispo = [];
		this.tmpDispoParcial = [];
		this.tmpNoDispo = [];
		this.disponibles =  [];
		this.disponiblesParcial = [];
		this.noDisponibles = [];
		this.allUsuariosArray = [];
		
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
		this.disponiblesParcial = this.tmpDispoParcial;
		this.noDisponibles = this.tmpNoDispo;
	});
 }

 
  showPrompt(subtitulo: string) {
	
	var index;
	var vector;
	
	if(this.flagDisponibleParcial){
		index = this.disponiblesParcial.indexOf(this.indiceCocheraDisponibleParcial);
		vector = this.disponiblesParcial[index];
	} else {
		index = this.disponibles.indexOf(this.indiceCocheraDisponible);
		vector = this.disponibles[index];
	}

	var texto;
	if (subtitulo == null || subtitulo == ""){
		texto = "";
	} else {
		texto = "<br/><center><b>" + subtitulo + "</b></center>";
	}
	
    let prompt = this.alertCtrl.create({
      title: 'D\u00EDa: ' + this.reservasService.formatearFecha(vector.v_fecha) + ' - Cochera: ' + vector.v_espacio,
	  enableBackdropDismiss: false,
      inputs: [
	  
        {
          name: 'desde',
		  placeholder: 'Desde',
		  type: 'time',
		  value: vector.horaDesde
        },
		{
		  name: 'hasta',
		  placeholder: 'Hasta',
		  type: 'time',
		  value: vector.horaHasta
		},	
      ],
	  message: texto,
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
			window.localStorage.setItem("noCancel", 'true');
			this.guardar(data, vector);
          }
        },
		{
          text: 'Cerrar',
          role: 'cancel',
        },
      ]
    });
	
	prompt.onDidDismiss((data) => this.guardar(data, vector));
    prompt.present();
  }
  
  
  guardar(data, vector){  
	var reserva = [];
	var mail = vector.v_mail;
	var nombreCochera = vector.v_nombre;
	var espacioCochera: String;
	espacioCochera = vector.v_espacio;
	var fechaRese = vector.v_fecha;
	var horaDesde = data.desde;
	var horaHasta = data.hasta;
	var horaDesdeSort = Number(horaDesde.replace(":",""));
	var estado = "Reservado";
	var fechaAlta = "";
	var fechaOcupa = "";
	var fechaLibre = "";
	var outerThis = this;
	var diaActual = new Date();
	var hora = diaActual.getHours();
	var minutos = diaActual.getMinutes();
	var min;
	var horas;

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

	var horaActualString = horas.toString() + ":" + min.toString();

	if(window.localStorage.getItem("noCancel") == 'true'){
		window.localStorage.removeItem("noCancel");
		this.obtenerCocheras(horaDesde, horaHasta, fechaRese, mail, nombreCochera, vector.v_espacio, function(){
			if(!outerThis.errorHorarios){
				if(!outerThis.errorRangoHorarios){
					if(!outerThis.errorLimiteHoras){
						if(!outerThis.errorMismaCochera){
							if(!outerThis.extenderReserva){
								if(!outerThis.error){
									if(data.desde >= vector.horaDesde && data.hasta <= vector.horaHasta){
										reserva.push({mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, fechaAlta, estado, fechaOcupa, fechaLibre, horaDesdeSort});
										outerThis.reservasService.createReserva(reserva[0], function(resultado: boolean){
												outerThis.buscar();
										});
									} else {
										var subtitulo = 'No es posible guardar el horario deseado, esta cochera ya posee una reserva';
										outerThis.errorHorarios = false;
										outerThis.showPrompt(subtitulo);
									}
								}else {
									var subtitulo = 'El horario seleccionado se superpone con el de otra reserva';
									outerThis.errorHorarios = false;
									outerThis.showPrompt(subtitulo);
								}
							} else {
								var subtitulo = 'Ya cuenta con una reserva para esta cochera en el d\u00EDa seleccionado, puede extenderla desde la pesta\u00F1a Mis Reservas';
								outerThis.extenderReserva = false;
								outerThis.showPrompt(subtitulo);
							}
						} else {
							var subtitulo = 'Ya tiene reservada esta cochera en el d\u00EDa seleccionado';
							outerThis.errorMismaCochera = false;
							outerThis.showPrompt(subtitulo);
						}
					} else {
						var subtitulo = 'El lapso de tiempo m\u00EDnimo para una reserva es de una hora';
						outerThis.errorLimiteHoras = false;
						outerThis.showPrompt(subtitulo);
					}
				} else {
					if ((diaActual.toISOString().substr(0, 10) == vector.v_fecha.substr(0,10)) && (Number(horaDesde.replace(":","")) > 800)){
						var subtitulo = 'El horario permitido es entre las ' + horaActualString + ' hs y las 20:00 hs';
					} else {
						var subtitulo = 'El horario permitido es entre las 08:00 hs y las 20:00 hs';
					}
					outerThis.errorRangoHorarios = false;
					outerThis.showPrompt(subtitulo);
				}
			} else {
				var subtitulo = 'El horario inicial debe ser anterior al horario final';
				outerThis.errorHorarios = false;
				outerThis.showPrompt(subtitulo);
			}
		});
	}
  }
  
  	
	obtenerCocheras(horaDesde: string, horaHasta: string, v_fecha: string, v_mail: string, nombre: string, espacio: string, callback){
		
		var allreservasArray;
		var outerThis = this;
		
		this.reservasService.getReservasByFechaRese(v_fecha).then((data) => {
			allreservasArray = data;
			var z = 0;
			var temporal = [];
			var temporalReservasOtrosUsuarios = [];
			var cocherasResevadasOtrosUsuarios = [];
			var horariosDisponibles = [];
			var horaDesdeCampoHora: number = Number((horaDesde).substr(0,2));
			var horaHastaCampoHora: number = Number((horaHasta).substr(0,2));
			var diaActual = new Date();
			var hora = diaActual.getHours();
			var minutos = diaActual.getMinutes();
			var min;
			var horas;
			
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
			
			if (diaActual.toISOString().substr(0, 10) != v_fecha.substr(0,10)){
				horaActual = 800;
			}
			
			if(horaDesdeCampoHora <= horaHastaCampoHora){
				
				if(Number(horaDesde.replace(":","")) >= horaActual && Number(horaHasta.replace(":","")) <= 2000){
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
									cocherasResevadasOtrosUsuarios.push({"espacio": allreservasArray[z].espacioCochera, "horaDesde": allreservasArray[z].horaDesde, "horaHasta": allreservasArray[z].horaHasta});
								}
								
							}
							
						z = z + 1;
						}
							
							var numeroHoraDesde = Number(horaDesde.replace(":",""));
							var numeroHoraHasta = Number(horaHasta.replace(":",""));
							var n : number = 0;
							var j : number = 0;
							var iterador;
							var r;
							var mismaCochera = false;
							var horaDesde1Numero = 2000;
							var horaHasta1Numero = 0;
							var horaInicial = 800;
							var horaFinal = 2000;
							var temporalJoin = [];
							
							//Verificamos si estamos reservando una cochera que ya tiene una o más reservas de otros usuarios
							for(r = 0; r < cocherasResevadasOtrosUsuarios.length; r++){
								if (cocherasResevadasOtrosUsuarios[r].espacio == espacio && mismaCochera == false){
									mismaCochera = true;
								}
							}
							
							//Guardamos los datos de las reservas de otros usuarios sobre la misma cochera que queremos reservar
							if(mismaCochera == true){
								var item;
								for (item in cocherasResevadasOtrosUsuarios){
									if (cocherasResevadasOtrosUsuarios[item].espacio == espacio){
										temporalJoin.push(cocherasResevadasOtrosUsuarios[item].horaDesde);
										temporalJoin.push(cocherasResevadasOtrosUsuarios[item].horaHasta);
									}
								}
							}
							
							//Si el usuario logeado tiene una o más reservas sobre la cochera que quiere resevar, guardamos esos datos
							if (temporal.length > 0){
								temporalJoin = temporalJoin.concat(temporal);
							}
							
							temporalJoin.sort();
							
							if(temporalJoin.length > 0){
									
								var m: number = temporalJoin.length;
								var gruposN = m/2;
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
												
												//Si la reserva es concatenada a una reserva mia
												if(temporal.length > 0 && (outerThis.igualA(temporal, numeroHoraDesde) || outerThis.igualA(temporal, numeroHoraHasta))){
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
								} else {
									outerThis.error = false;
								}
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
	
	igualA(array: any[], hora: number) {
		
		var resultado = false;
		var itemArray;
		for(itemArray in array){
			if (Number(array[itemArray].replace(":","")) == hora){
				resultado = true;
			}
		}
		return resultado;
	}
	
	contieneCochera(array: any[], espacio: string, numeroHoraDesde: number, numeroHoraHasta: number) {
		
		var resultado = false;
		var itemArray;
		for(itemArray in array){
			if (array[itemArray].espacio == espacio && (Number((array[itemArray].horaDesde).replace(":","")) == numeroHoraHasta || Number((array[itemArray].horaHasta).replace(":","")) == numeroHoraDesde)){
				resultado = true;
			}
		}
		return resultado;
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
  
  ionViewWillEnter(){
	var horaActual = this.obtenerHoraActual();
	var diaActual = new Date();
	var parseFechaHoy = ((diaActual.toISOString()).substr(0, 10));
	var parseFechaElegida = (this.fechaElegida.substr(0, 10));
	var numeroFechaHoy = Number(parseFechaHoy.replace(/-/g , ""));
	var numeroFechaElegida = Number(parseFechaElegida.replace(/-/g , ""));
	if (((numeroFechaHoy == numeroFechaElegida) && horaActual < 2000) || (numeroFechaElegida > numeroFechaHoy)){
		this.buscar();
	} else {
		this.disponibles = [];
		this.disponiblesParcial = [];
		this.noDisponibles = [];
		this.habilitarBoton = null;
	}
  }

}
