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

    public disponibles: any;
	public disponiblesParcial: any;
	public noDisponibles: any;
	public fechaActual = new Date().toISOString();
	public tmpDispo;
	public tmpDispoParcial;
	public tmpNoDispo;
	public allUsuariosArray = [];
	public indiceCocheraDisponible: any;
	public indiceCocheraDisponibleParcial: any;
	public indiceCocheraNoDisponible: any;
	public indiceOcupado: any;
	public indiceLlamar;
	public error: boolean;
	public errorMismaCochera: boolean;
	public errorLimiteHoras: boolean;
	public errorHorarios: boolean;
	public extenderReserva: boolean;
	public telefonoNoDisponible:number;
	public flagDisponibleNoDisponible;
	public flagDisponibleParcial;
	public mail = window.localStorage.getItem("email");

    constructor(public navCtrl: NavController,  public reservasService: Reservas, public usuariosService: Usuarios,  public cocherasService: Cocheras, public alertCtrl: AlertController) {

    }
  
    devolverColorFilaDisponible(i){
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
			if (dispo <= 0) {
				return "#DAF291"; //verde 
			}
		} else if(v_DispoFila >= 1200){
			return "#DAF291"; //verde 
		}
    }
	
	devolverColorFilaDisponibleParcial(i){
		return "#FFFA93"; //amarillo	
	}
	
    devolverColorFilaNoDisponible(i){
		var indexNoDisponibles = this.noDisponibles.indexOf(i);	
		
		if (this.mail == this.noDisponibles[indexNoDisponibles].v_mail){
			return "#E1DEDE"; //gris
		} else {
			return "#FD7D7D"; //Rojo
		}
	}
  
	marcarRadioCocheraDisponible(i){
		this.indiceCocheraDisponible = i;
		this.indiceCocheraNoDisponible = null;
		this.indiceOcupado = null;
		this.indiceLlamar = null;
		var index = this.disponibles.indexOf(this.indiceCocheraDisponible);
		var horaDesde = this.disponibles[index].horaDesde;
		
		if(!(horaDesde > this.getHoraActual())){
			this.indiceOcupado = index;	
		}
		
		this.flagDisponibleParcial = false;
		this.indiceCocheraDisponibleParcial = null;
		this.flagDisponibleNoDisponible = false;
	}
	
	marcarRadioCocheraDisponibleParcial(i){
		this.indiceCocheraDisponible = i;
		this.indiceCocheraNoDisponible = null;
		this.indiceOcupado = null;
		this.indiceLlamar = null;
		var index = this.disponiblesParcial.indexOf(this.indiceCocheraDisponible);
		var horaDesde = this.disponiblesParcial[index].horaDesde;
		
		if(!(horaDesde > this.getHoraActual())){
			this.indiceOcupado = index;	
		}
		
		this.flagDisponibleParcial = true;
		this.indiceCocheraDisponibleParcial = i;
		this.flagDisponibleNoDisponible = false;
	}
	  
	marcarRadioCocheraNoDisponible(i){
		
		var index = this.noDisponibles.indexOf(i);
        this.telefonoNoDisponible = this.noDisponibles[index].v_telefono;
		this.indiceOcupado = null;
		this.indiceCocheraNoDisponible = i;
		this.indiceLlamar = i;

		if(this.noDisponibles[index].v_mail == this.mail){
			this.indiceLlamar = null;
		} 
		
		var horaActualString = this.getHoraActual();
		var numeroHoraActual = Number(horaActualString.replace(":",""));
		var numeroHoraDesdeReserva = Number(this.noDisponibles[index].horaDesde.replace(":",""));
		var numeroHoraHastaReserva = Number(this.noDisponibles[index].horaHasta.replace(":",""));
		
		if((numeroHoraActual >= numeroHoraDesdeReserva) && (numeroHoraActual < numeroHoraHastaReserva) && this.noDisponibles[index].estado != "Ocupado" && this.noDisponibles[index].v_mail == this.mail){
			this.indiceOcupado = i;
		}
		
		this.indiceCocheraDisponible = null;
		this.indiceCocheraDisponibleParcial = null;
		this.flagDisponibleNoDisponible = true;
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
	
	agregarEspacio(nombre: string){
		var valorAAgregar = " ";
		var posicion = 5;
		
		if(nombre.length == 7){
			posicion = 6;
		}
		
		var nombreAMostrar = [nombre.slice(0, posicion), valorAAgregar, nombre.slice(posicion)].join('');
		return nombreAMostrar;
	}
	
  
	ocuparCochera(){
		
		var index;
		var mail;
		var nombreCochera;
		var espacioCochera;
		var fechaRese;
		var horaDesde;
		var horaHasta;
		var id;
		
		if(this.flagDisponibleNoDisponible){
			index = this.noDisponibles.indexOf(this.indiceCocheraNoDisponible);
			id = this.noDisponibles[index].id;
			mail = this.mail;
			nombreCochera = this.noDisponibles[index].v_nombre;
			espacioCochera = this.noDisponibles[index].v_espacio;
			fechaRese = this.noDisponibles[index].v_fecha;
			horaDesde = this.noDisponibles[index].horaDesde;
			horaHasta = this.noDisponibles[index].horaHasta;
		} else if(this.flagDisponibleParcial) {
			index = this.disponiblesParcial.indexOf(this.indiceCocheraDisponibleParcial);
			mail = this.disponiblesParcial[index].v_mail;
			nombreCochera = this.disponiblesParcial[index].v_nombre;
			espacioCochera = this.disponiblesParcial[index].v_espacio;
			fechaRese = this.disponiblesParcial[index].v_fecha;
			horaDesde = this.disponiblesParcial[index].horaDesde;
			horaHasta = this.disponiblesParcial[index].horaHasta;
		} else {
			index = this.disponibles.indexOf(this.indiceCocheraDisponible);
			mail = this.mail;
			nombreCochera = this.disponibles[index].v_nombre;
			espacioCochera = this.disponibles[index].v_espacio;
			fechaRese = this.disponibles[index].v_fecha;
			horaDesde = this.disponibles[index].horaDesde;
			horaHasta = this.disponibles[index].horaHasta;
		}
		
		this.indiceCocheraDisponible = null;
		this.indiceOcupado = null;
		var reserva = [];
		var horaDesdeSort = Number(horaDesde.replace(":",""));
		var estado = "Ocupado";
		var fechaAlta = "";
		var fechaOcupa = "";
		var fechaLibre = "";
		var outerThis = this;
	
		if(mail == this.mail && this.flagDisponibleNoDisponible){
			this.reservasService.deleteReserva(id, "Inicio");
			reserva.push({mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, fechaAlta, estado, fechaOcupa, fechaLibre, horaDesdeSort});
			this.reservasService.createReserva(reserva[0], function(resultado: boolean){
				outerThis.buscar();
			});
		} else {		
			this.obtenerCocheras(horaDesde, horaHasta, fechaRese, mail, nombreCochera, espacioCochera, function(){
				if(!outerThis.errorLimiteHoras){
					if(!outerThis.errorMismaCochera){
						if(!outerThis.extenderReserva){
							if(!outerThis.error){
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
							var subtitulo = 'Ya cuenta con una reserva para esta cochera en el d\u00EDa seleccionado, puede extenderla desde la pesta\u00f1a Mis Reservas';
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
	}
	
	
	reservarCochera(){	
		var reserva = [];
		var index;
		
		if (this.flagDisponibleParcial){
			index = this.disponiblesParcial.indexOf(this.indiceCocheraDisponibleParcial);
			var mail = this.disponiblesParcial[index].v_mail;
			var nombreCochera = this.disponiblesParcial[index].v_nombre;
			var espacioCochera = this.disponiblesParcial[index].v_espacio;
			var fechaRese = this.disponiblesParcial[index].v_fecha;
			var horaDesde = this.disponiblesParcial[index].horaDesde;
			var horaHasta = this.disponiblesParcial[index].horaHasta;
		} else{
			index = this.disponibles.indexOf(this.indiceCocheraDisponible);
			var mail = this.disponibles[index].v_mail;
			var nombreCochera = this.disponibles[index].v_nombre;
			var espacioCochera = this.disponibles[index].v_espacio;
			var fechaRese = this.disponibles[index].v_fecha;
			var horaDesde = this.disponibles[index].horaDesde;
			var horaHasta = this.disponibles[index].horaHasta;
		}
		
		this.indiceCocheraDisponible = null;     
		var horaDesdeSort = Number(horaDesde.replace(":",""));
		var estado = "Reservado";
		var fechaAlta = "";
		var fechaOcupa = "";
		var fechaLibre = "";
		var outerThis = this;
						
		this.obtenerCocheras(horaDesde, horaHasta, fechaRese, mail, nombreCochera, this.disponibles[index].v_espacio, function(){

			if(!outerThis.errorLimiteHoras){
				if(!outerThis.errorMismaCochera){
					if(!outerThis.extenderReserva){
						if(!outerThis.error){		
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
						var subtitulo = 'Ya cuenta con una reserva para esta cochera en el d\u00EDa seleccionado, puede extenderla desde la pesta\u00f1a Mis Reservas';
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
		var outerThis = this;
	
		//Traigo de la base todas las cocheras
		this.cocherasService.getCocheras().then((data) => {
			
			v_items = data;
			v_mail = outerThis.mail;
			this.tmpDispo = [];
			this.tmpNoDispo = [];
			this.tmpDispoParcial = [];
			this.disponibles =  [];
			this.disponiblesParcial =  [];
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

    ionViewDidEnter() {	
				
		var v_items;
		var v_item;
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
		var outerThis = this;
		
		if (hora < 10){
			horas = "0" + hora.toString();
		}
		
		if (minutos < 10){
			min = "0" + minutos.toString();
		}
		
		var horaActual = horas + min;
		var numerohoraActual = Number(horaActual.replace(":",""));
		
		if (numerohoraActual < 2000 && numerohoraActual >= 0){
		
			//Traigo de la base todas las cocheras
			this.cocherasService.getCocheras().then((data) => {
			
				v_items = data;		
				v_mail = outerThis.mail;
				this.tmpDispo = [];
				this.tmpNoDispo = [];
				this.tmpDispoParcial = [];				
				this.disponibles = [];
				this.noDisponibles = [];
				this.disponiblesParcial = [];
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
				
				this.disponibles = this.tmpDispo;
				this.disponiblesParcial = this.tmpDispoParcial;
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
		var ids = [];
		var estados = [];
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
				ids.push(allreservasArray[z].id);
				estados.push(allreservasArray[z].estado)
					
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
			var index = -1;
			var f = 0;
			
			//Itero las reservas para agregar los tramos que las conforman como no disponibles 
			for (item in mailTemporal){
				this.buscarUsuarios(mailTemporal[iteradorMails], function (){
									
							var usuario = outerThis.allUsuariosArray[0];
							index = -1;
							v_nombreCompleto = usuario.nombre + " " + usuario.apellido;
							v_telefono = usuario.telefono;
							var horaDesde = temporal[vectorHoras];
							var horaHasta = temporal [vectorHoras+1];
							var id = ids[f];
							var estado = estados[f];
							var v_mail = mailTemporal[iteradorMails];
							v_Dispo = outerThis.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);

							//Colocamos como no disponible a la cochera para el rango de horarios hallado
							outerThis.tmpNoDispo.push({id, v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo, v_telefono, v_nombreCompleto, estado});
							
							vectorHoras = vectorHoras + 2;
							iteradorMails = iteradorMails + 1;
							f++;
							i++;
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
		this.allUsuariosArray = data;
		callback();
	});
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
		var p;
		var contadorIncorrectos = 0;
				
				if(horaDesdeCampoHora <= horaHastaCampoHora){					
					if((horaHastaCampoHora - horaDesdeCampoHora) >= 1 && (Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""))) >= 100){				
					for (p = 0; p < allreservasArray.length; p++) {
						if (allreservasArray[p].fechaRese.substr(0, 10) != v_fecha.substr(0, 10)) {
								contadorIncorrectos = contadorIncorrectos + 1;
						}
					}
						
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
						
					//Itero los los resultados de la búsqueda y comparo horarios.
					var n : number = 0;
					var j : number = 0;
					var r : number;
					var iterador;
					var horaDesde1Numero = 2000;
					var horaHasta1Numero = 0;
					var horaInicial = 800;
					var horaFinal = 2000;
					var temporalJoin = [];
					var mismaCochera = false;
					
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
  		
}
