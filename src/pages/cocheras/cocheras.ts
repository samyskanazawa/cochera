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
	private habilitarBoton: string;
	private tmpDispo;
	private tmpNoDispo;
	private allUsuariosArray = [];
	private hoy: string;
	private indiceCocheraDisponible: any
	private indiceCocheraNoDisponible: any
	private minDate;
	private error: boolean;
	private errorMismaCochera: boolean;
	private errorLimiteHoras: boolean;
	private errorHorarios: boolean;
	private extenderReserva: boolean;
	
	reservas: any;
	
  constructor(public navCtrl: NavController, public reservasService: Reservas, public usuariosService: Usuarios, 
					public cocherasService: Cocheras, /*public tmpDispoService: TmpDispo, public tmpNoDispoService: TmpNoDispo,*/
						public alertCtrl: AlertController) {
	
	this.ocultarResultados = true;
	this.setDia();
  }

  devolverColorFilaDisponible(i){
	//[ngStyle]="{'background-color': devolverColorFila(i)}"
	var indexDisponibles = this.disponibles.indexOf(i);
	
	switch (this.disponibles[indexDisponibles].v_Dispo) {
		case 1200:
			return "#DAF291";
		default:
			return "#FFFA93";
    }
  }
  
  marcarRadioCocheraDisponible(i){
	  this.indiceCocheraDisponible = i;
  }
  
  marcarRadioCocheraNoDisponible(i){
	  this.indiceCocheraNoDisponible = i;
  }
  
  setHoraDesde(){
	  this.horaDesde = new Date().toISOString();
  }
  
  setHoraHasta(){
	  this.horaHasta = new Date().toISOString();
  }
  
  setDia(){
	   this.minDate = new Date().toISOString();
  }
  
  changeDate(fechaElegida) {
	  var iguales = this.validarFecha(new Date(fechaElegida).toISOString(), new Date(this.minDate).toISOString());
	  
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
		  this.alertGenerico(titulo, subtitulo); 
	  }
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
	  
	  if(yy1 >= yy2 && mm1 >= mm2 && dd1 >= dd2){
		  iguales =true;
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
							debugger;
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
			
			//Itero las reservas para agregar los tramos que las conforman como no disponibles 
			for (item in mailTemporal){
				this.buscarsUsuarios(mailTemporal[item], function (){
						if (outerThis.allUsuariosArray.length >= 0 && i <= (mailTemporal.length)-1) {
							var usuario = outerThis.allUsuariosArray[0];
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
							i++;
						}
					});
				}

			debugger;	
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
  
  
  buscarsUsuarios (mail: string, callback) {
	  this.usuariosService.getUsuariosByMail(mail).then((data) => {
		this.allUsuariosArray = data;
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

 
  showPrompt() {
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
		
			this.obtenerCocheras(horaDesde, horaHasta, fechaRese, mail, nombreCochera, this.disponibles[index].v_espacio, function(){
				
				if(!outerThis.errorHorarios){
					if(!outerThis.errorLimiteHoras){
						if(!outerThis.errorMismaCochera){
							if(!outerThis.extenderReserva){
								if(!outerThis.error){
									//debugger;
									if(data.desde >= outerThis.disponibles[index].horaDesde && data.hasta <= outerThis.disponibles[index].horaHasta && data.desde < data.hasta){
										reserva.push({mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, fechaAlta, estado, fechaOcupa, fechaLibre, horaDesdeSort});
										outerThis.reservasService.createReserva(reserva[0], function(resultado: boolean){
												outerThis.buscar();
										});
									} else {
										var titulo = 'Horario Inválido';
										var subtitulo = 'El horario permitido es entre las '+ outerThis.disponibles[index].horaDesde + ' hs y las ' + outerThis.disponibles[index].horaHasta + ' hs';
										outerThis.errorHorarios = false;
										outerThis.alertGenerico(titulo, subtitulo);
									}
								}else {
									var titulo = 'Horario Inválido';
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
						} else {
							var titulo = 'Cochera Inválida';
							var subtitulo = 'Ya tiene reservada esta cochera en el día seleccionado';
							outerThis.errorMismaCochera = false;
							outerThis.alertGenerico(titulo, subtitulo);
						}
					} else {
						var titulo = 'Horario Inválido';
						var subtitulo = 'El lapso de tiempo mínimo para una reserva es de una hora';
						outerThis.errorLimiteHoras = false;
						outerThis.alertGenerico(titulo, subtitulo);
					}
				} else {
					var titulo = 'Horario Inválido';
					var subtitulo = 'El horario inicial debe ser anterior al horario final';
					outerThis.errorHorarios = false;
					outerThis.alertGenerico(titulo, subtitulo);
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

					//if (!mismaCochera){
						
						var numeroHoraDesde = Number(horaDesde.replace(":",""));
						var numeroHoraHasta = Number(horaHasta.replace(":",""));
					
						//Itero los los resultados de la búsqueda y comparo horarios.
						//if(temporal.length == (allreservasArray.length)*2){
						
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
										
										debugger;
											
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
							
						/*} else {
								outerThis.errorMismaCochera = true;
						}*/
					} else {
						outerThis.errorLimiteHoras = true;
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
