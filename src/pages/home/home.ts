import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Cocheras } from '../../providers/cocheras';
import { Reservas } from '../../providers/reservas';
import { Usuarios } from '../../providers/usuarios';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

    private disponibles: any;
	private noDisponibles: any;
	private fechaActual = new Date().toISOString();
	private tmpDispo;
	private tmpNoDispo;
	private tmpDispoOut;
	private allUsuariosArray = [];
	private indiceCocheraDisponible: any;
	private indiceCocheraNoDisponible: any;
	private indiceOcupado: any;
	private error: boolean;
	private errorMismaCochera: boolean;
	private errorLimiteHoras: boolean;
	private errorHorarios: boolean;
	private extenderReserva: boolean;
	private indice: number;
	private telefonoNoDisponible:number;

    constructor(public navCtrl: NavController,  public reservasService: Reservas, public usuariosService: Usuarios,  public cocherasService: Cocheras, public alertCtrl: AlertController) {

    }
  
    devolverColorFilaDisponible(i){
		//[ngStyle]="{'background-color': devolverColorFila(i)}"
		var indexDisponibles = this.disponibles.indexOf(i);	
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
		
		//debugger;
		
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
		var numeroHoraActual = Number(horas.toString() + min);
		
		horaDesde = horaActual;
		v_DispoActual = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
		dispo  =   v_DispoActual - v_DispoFila;

		if(numeroHoraActual >= 800){
			if (dispo > 0) {
				return "#FFFA93"; //amarillo 
			} else {
				return "#DAF291"; //verde 
			}
		} else if(v_DispoFila < 1200){
				return "#FFFA93"; //amarillo
		} else {
				return "#DAF291"; //verde 
		}
    }
 
    devolverColorFilaNoDisponible(i){
		return "#FD7D7D"; //Rojo
    }
  
	marcarRadioCocheraDisponible(i){
		this.indiceCocheraDisponible = i;
		this.indiceCocheraNoDisponible = null;
		this.indiceOcupado = null;
		var index = this.disponibles.indexOf(this.indiceCocheraDisponible);
		var horaDesde = this.disponibles[index].horaDesde;
				if(!(horaDesde > this.getHoraActual())){
					this.indiceOcupado = index;	
				}			
	}
	  
	marcarRadioCocheraNoDisponible(i){
		this.indiceCocheraNoDisponible = i;
		this.indiceCocheraDisponible = null;
		this.indiceOcupado = null;
		var index = this.noDisponibles.indexOf(this.indiceCocheraNoDisponible);
        this.telefonoNoDisponible = this.noDisponibles[index].v_telefono;
	}
	
	llamar(){
		window.open("tel:" + this.telefonoNoDisponible);
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
	
  
	ocuparCochera(){
	    var index = this.disponibles.indexOf(this.indiceCocheraDisponible);
		var reserva = [];
		var mail = this.disponibles[index].v_mail;
		var nombreCochera = this.disponibles[index].v_nombre;
		var espacioCochera: String;
		espacioCochera = (this.disponibles[index].v_espacio).toString();
		var fechaRese = this.disponibles[index].v_fecha;
		var horaDesde = this.disponibles[index].horaDesde;
		var horaHasta = this.disponibles[index].horaHasta;
		var horaDesdeSort = Number(horaDesde.replace(":",""));
		var estado = "Ocupado";
		var fechaAlta = "";
		var fechaOcupa = "";
		var fechaLibre = "";
		var contadorReservas = 0;
		var item;
		var resultado: boolean;
		var error: boolean;
		var outerThis = this;
					
			this.obtenerCocheras(horaDesde, horaHasta, fechaRese, mail, nombreCochera, this.disponibles[index].v_espacio, function(){
				if(!outerThis.errorLimiteHoras){
					if(!outerThis.errorMismaCochera){
						if(!outerThis.extenderReserva){
							if(!outerThis.error){
								//debugger;
								reserva.push({mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, fechaAlta, estado, fechaOcupa, fechaLibre, horaDesdeSort});
								outerThis.reservasService.createReserva(reserva[0], function(resultado: boolean){
								outerThis.buscar();
								});
							}else {
										var titulo = 'Horario Inv\u00e1lido';
										var subtitulo = 'El horario seleccionado se superpone con el de otra de sus reservas';
										outerThis.errorHorarios = false;
										outerThis.alertGenerico(titulo, subtitulo);
							}
						} else {
									var titulo = 'Extender Reserva';
									var subtitulo = 'Ya cuenta con una reserva para esta cochera en el día seleccionado, puede extenderla desde la pestaña Mis Reservas';
									outerThis.extenderReserva = false;
									outerThis.alertGenerico(titulo, subtitulo);
						}
					}
				} else {
					var titulo = 'Horario Inv\u00e1lido';
					var subtitulo = 'El lapso de tiempo m\u00EDnimo para ocupar una cochera es de una hora';
					outerThis.errorLimiteHoras = false;
					outerThis.alertGenerico(titulo, subtitulo);
				}		
			});		
	}
	
	
	reservarCochera(){
		var index = this.disponibles.indexOf(this.indiceCocheraDisponible);	
		var reserva = [];
		var mail = this.disponibles[index].v_mail;
		var nombreCochera = this.disponibles[index].v_nombre;
		var espacioCochera: String;
		espacioCochera = (this.disponibles[index].v_espacio).toString();
		var fechaRese = this.disponibles[index].v_fecha;
		var horaDesde = this.disponibles[index].horaDesde;
		var horaHasta = this.disponibles[index].horaHasta;
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
						
		this.obtenerCocheras(horaDesde, horaHasta, fechaRese, mail, nombreCochera, this.disponibles[index].v_espacio, function(){

			if(!outerThis.errorLimiteHoras){
				if(!outerThis.errorMismaCochera){
					if(!outerThis.extenderReserva){
						if(!outerThis.error){
										//debugger;
											reserva.push({mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, fechaAlta, estado, fechaOcupa, fechaLibre, horaDesdeSort});
											outerThis.reservasService.createReserva(reserva[0], function(resultado: boolean){
													outerThis.buscar();
											});
						}else {
										var titulo = 'Horario Inv\u00e1lido';
										var subtitulo = 'El horario seleccionado se superpone con el de otra de sus reservas';
										outerThis.errorHorarios = false;
										outerThis.alertGenerico(titulo, subtitulo);
						}
					} else {
						var titulo = 'Extender Reserva';
						var subtitulo = 'Ya cuenta con una reserva para esta cochera en el d\u00eda seleccionado, puede extenderla desde la pesta\u00f1a Mis Reservas';
						outerThis.extenderReserva = false;
						outerThis.alertGenerico(titulo, subtitulo);
					}
				}
			} else {
				var titulo = 'Horario Inv\u00e1lido';
				var subtitulo = 'El lapso de tiempo m\u00EDnimo para una reserva es de una hora';
				outerThis.errorLimiteHoras = false;
				outerThis.alertGenerico(titulo, subtitulo);
			}				
		
		});						
	}
	
    buscar(){
	  this.obtenerCocherasSinRango(this.fechaActual);
	  this.indiceCocheraDisponible = null;
	  this.indiceCocheraNoDisponible = null;
	  this.indiceOcupado = null;
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
	
		//Traigo de la base todas las cocheras
		this.cocherasService.getCocheras().then((data) => {
			
			v_items = data;
			v_mail = "hernan.ruiz@softtek.com";
			this.tmpDispo = [];
			this.tmpNoDispo = [];
			this.disponibles =  [];
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
			this.noDisponibles = this.tmpNoDispo;
		});
	}

    ionViewDidEnter() {	
		var v_items;
		var v_item;
		var item;
		var v_espacio;
		var v_nombre;
		var v_mail;
		var v_fecha = this.fechaActual;
		var allreservasArray;
		var estado: String;
		var horaDesde:string;
		var horaHasta: string;
		this.indiceOcupado = null;
		this.indiceCocheraDisponible = null;
		this.indiceCocheraNoDisponible = null;
		var diaActual = new Date();
		var hora = diaActual.getHours();
		var minutos = diaActual.getMinutes();
		var min = minutos.toString();
		var horas = hora.toString();
		
		if (hora < 10){
			horas = "0" + hora.toString();
		}
		
		if (minutos < 10){
			min = "0" + minutos.toString();
		}
		
		var horaActual = Number(horas + minutos);
		
		if (horaActual < 2000 && horaActual >= 0){
		
			//Traigo de la base todas las cocheras
			this.cocherasService.getCocheras().then((data) => {
			
				v_items = data;		
				v_mail = "hernan.ruiz@softtek.com";
				this.tmpDispo = [];
				this.tmpNoDispo = [];		
				this.disponibles =  [];
				this.allUsuariosArray = [];
				
				//Itero las cocheras encontradas para buscar reservas actuales
				for (let item of v_items) {
					
					v_item = item;
					v_nombre = v_item.nombre;
					v_espacio = v_item.espacio;
					
					//Se buscará por estado diferente a "Libre"
					estado = "Libre";
					this.queryReservas(v_nombre, v_espacio, v_fecha, estado, v_mail, horaDesde, horaHasta, allreservasArray );		
				}
				console.log(data);
				//this.disponibles = v_items;	
				this.disponibles = this.tmpDispo;
				this.noDisponibles = this.tmpNoDispo;
			
			});
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
			
			if(diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10) && Number(horaActual.replace(":","")) >= 800){
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
			if(diaActual.toISOString().substr(0, 10) == v_fecha.substr(0,10) && Number(horaActual.replace(":","")) >= 800){
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
   
  
    
	obtenerCocheras(horaDesde: string, horaHasta: string, v_fecha: string, v_mail: string, nombre: string, espacio: number, callback){		
		var allreservasArray;
		var outerThis = this;
		var mismaCochera: boolean = false;
		//debugger;
			
		this.reservasService.getReservasByMailAndFechaRese(v_mail, v_fecha).then((data) => {
		allreservasArray = data;
		var z = 0;
		var temporal = [];
		var horariosDisponibles = [];
		var horaDesdeCampoHora: number = Number((horaDesde).substr(0,2));
		var horaHastaCampoHora: number = Number((horaHasta).substr(0,2));
		var p;
		var contadorIncorrectos = 0;
				
		//debugger;
				
				if(horaDesdeCampoHora < horaHastaCampoHora){					
					if((horaHastaCampoHora - horaDesdeCampoHora) >= 1 && (Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""))) >= 100){				
					for (p = 0; p < allreservasArray.length; p++) {
						if (allreservasArray[p].fechaRese.substr(0, 10) != v_fecha.substr(0, 10)) {
								contadorIncorrectos = contadorIncorrectos + 1;
						}
					}
						
					while(z < allreservasArray.length) {							
					//Busco reservas del mismo usuario sobre otras cocheras, para el día en el que quiere reservar una.
						if (allreservasArray[z].mail == v_mail && allreservasArray[z].fechaRese.substr(0, 10) == v_fecha.substr(0, 10)){
						temporal.push(allreservasArray[z].horaDesde);
						temporal.push(allreservasArray[z].horaHasta);
						temporal.sort();
						}
						z = z + 1;
					}
							
					var numeroHoraDesde = Number(horaDesde.replace(":",""));
					var numeroHoraHasta = Number(horaHasta.replace(":",""));
						
					//Itero los los resultados de la búsqueda y comparo horarios.
							
					var m: number = temporal.length;
					var gruposN = m/2;
					var n : number = 0;
					var j : number = 0;
					var iterador;
					var c;
					var horaDesde1Numero = 2000;
					var horaHasta1Numero = 0;
					var horaInicial = 800;
					var horaFinal = 2000;
								
						if(temporal.length > 0){
						var horaDesdeInicial = Number(temporal[j].replace(":",""));
						var horaHastaInicial = Number(temporal[j+1].replace(":",""));
									
							if (horaInicial < horaDesdeInicial){
											horariosDisponibles.push(horaInicial);
											horariosDisponibles.push(horaDesdeInicial);
							}									
							for(iterador = 1; iterador < gruposN; iterador++){
							j = j + 2;
							var horaDesdeActual = Number(temporal[j].replace(":",""));
							var horaHastaActual = Number(temporal[j+1].replace(":",""));
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
										var minimo = Number(temporal[n].replace(":",""));										
										if(horaDesde1Numero > minimo){
											horaDesde1Numero = minimo;
										}										
										var maximo = Number(temporal[n].replace(":",""));										
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
										//debugger;
												
										//Si los horarios que quiero reservar coinciden con algún horario disponible.
										if ((numeroHoraDesde >= horaDesdeDisponible) && (numeroHoraHasta <= horaHastaDisponible)){												
											if((numeroHoraDesde - horaDesdeDisponible) < 100){
													outerThis.extenderReserva = true;
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
					outerThis.errorHorarios = true;
				}
				callback();
		});	
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
  		
}
