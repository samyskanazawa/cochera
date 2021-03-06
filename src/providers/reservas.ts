import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the Reservas provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()

export class Reservas {

  data: any;
  public resultado: boolean;

   ip_dinamica ="10.5.10.151";
 
  constructor(public http: Http, public alertCtrl: AlertController) {
    this.data = null;
  }
 
  getResultado(){
	  return this.resultado;
  }
  
  getReservasByMailAndFechaRese(mail: string, fecha: string){
    return new Promise(resolve => {
		/* PRODUCCION */
		/* this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/search/findByMailAndFechaRese?mail=' + mail + '&fechaRese=' + fecha) */

		/* LOCAL */
		this.http.get('http://localhost:8080/reserva/search/findByMailAndFechaRese?mail=' + mail + '&fechaRese=' + fecha)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
		  
        });
    });
 
  }
    
  getReservasByFechaReseAndEstado(fechaRese: string, estado: string){
    return new Promise(resolve => {

    	/* PRODUCCION */
		/* this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/search/findByFechaReseAndEstado?fechaRese=' + fechaRese + '&estado=' + estado) */

		/* LOCAL*/
		this.http.get('http://localhost:8080/reserva/search/findByFechaReseAndEstado?fechaRese=' + fechaRese + '&estado=' + estado)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
		  
        });
    });
 
  }
  
  getReservasByFechaRese(fecha: string){
    return new Promise(resolve => {

    	/* PRODUCCION */
		/* this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/search/findByFechaRese?fechaRese=' + fecha) */

		/* LOCAL*/
		this.http.get('http://localhost:8080/reserva/search/findByFechaRese?fechaRese=' + fecha)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
		  
        });
    });
 
  }
  
  getReservasByMail(mail: string){
    return new Promise(resolve => {

    	/* PRODUCCION */
      	/* this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/search/findByMail?mail=' + mail) */

      	/* LOCAL */
      	this.http.get('http://localhost:8080/reserva/search/findByMail?mail=' + mail)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.reserva;
          resolve(this.data);
        });
    });
 
  }
  
 findByQuery( nombreCochera: string, espacioCochera: string, fechaRese: string, estado: string){
    return new Promise(resolve => {
	
    	/* PRODUCCION */
      	/* this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/search/findByQuery?nombreCochera='+ nombreCochera + '&espacioCochera=' + espacioCochera + '&fechaRese=' + fechaRese + '&estado' + estado) */

      	/* LOCAL */
      	this.http.get('http://localhost:8080/reserva/search/findByQuery?nombreCochera='+ nombreCochera + '&espacioCochera=' + espacioCochera + '&fechaRese=' + fechaRese + '&estado' + estado)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
 
  }
 
  editReserva(reserva, horaDesde, horaHasta, callback){
 
	let id = reserva.id;
	var allreservasArray;
	var z;
	var temporal = [];
	var numeroHoraDesde = Number(horaDesde.replace(":",""));
	var numeroHoraHasta = Number(horaHasta.replace(":",""));
	var desdeCampoHora;
	var hastaCampoHora;	
	var titulo: string = "Error";
	var	subtitulo: string = "";
	var error: boolean = false;
	var diaActual = new Date();
	var hora = diaActual.getHours();
	var minutos = diaActual.getMinutes();
	var min;
	var numeroHoraActual;
	var estado = "libre";
	var esDiaActual: boolean = false;
	
	if (minutos < 10){
		min = "0" + minutos.toString();
	} else {
		min = minutos.toString();
	}

	var horaActual = hora.toString() + ":" + min;
	
	if (numeroHoraDesde<1000){	
	    desdeCampoHora = numeroHoraDesde.toString().substr(0,1);
	}else{
		desdeCampoHora = numeroHoraDesde.toString().substr(0,2);
	}
	
	if (numeroHoraHasta<1000){	
		hastaCampoHora = numeroHoraHasta.toString().substr(0,1);
	}else{
		hastaCampoHora = numeroHoraHasta.toString().substr(0,2);
	}
	
	
	if(Number(desdeCampoHora) < 10) {
		desdeCampoHora = "0" + desdeCampoHora;
	}
	
	if(Number(hastaCampoHora) < 10) {
		hastaCampoHora = "0" + hastaCampoHora;
	}
	
	var horaDesdeCampoHora = Number(desdeCampoHora.substr(0,2));
	var horaHastaCampoHora = Number(hastaCampoHora.substr(0,2));
	
	if(diaActual.toISOString().substr(0, 10) == reserva.fechaRese.substr(0,10)){
		numeroHoraActual = Number(horaActual.replace(":",""));
		esDiaActual = true;
	} else {
		numeroHoraActual = 800;
		horaActual = "08:00";
	}
	
	if(reserva.estado == "Ocupado"){
		numeroHoraActual = numeroHoraDesde;		
	}
		
	if ((horaDesde != reserva.horaDesde) || (horaHasta != reserva.horaHasta)){
				
			this.getReservasByFechaReseAndEstado(reserva.fechaRese, estado).then((data2) => {
				
				allreservasArray = data2;
				z = 0;
					while(z < allreservasArray.length) {
						//Tomo los horarios de todas las reservas del usuario y de todas las reservas sobre la cochera sobre la que 
						//el usuario está editando su reserva
						if(reserva.espacioCochera == allreservasArray[z].espacioCochera || allreservasArray[z].mail == reserva.mail){
							temporal.push(allreservasArray[z].horaDesde);
							temporal.push(allreservasArray[z].horaHasta);
						}
						z = z + 1;	
					}
					
					//Saco del array temporal los horarios de la reserva que estoy editando
					var posicionHoraDesde = temporal.indexOf(reserva.horaDesde);
					temporal.splice(posicionHoraDesde, 1);
					
					var posicionHoraHasta = temporal.indexOf(reserva.horaHasta);
					temporal.splice(posicionHoraHasta, 1);
					
					temporal.sort();

					if((numeroHoraDesde >= numeroHoraActual && esDiaActual == true) || esDiaActual == false || (esDiaActual == true && reserva.estado == "Ocupado")){
							
							if(numeroHoraDesde >= 800 && numeroHoraHasta <= 2000){
							
								if((numeroHoraDesde != numeroHoraHasta) && (numeroHoraDesde < numeroHoraHasta)){
						
									if(horaHastaCampoHora - horaDesdeCampoHora >= 1 && numeroHoraHasta - numeroHoraDesde >= 100){
										
										if(numeroHoraHasta >= Number(horaActual.replace(":", ""))){
												
												var m: number = temporal.length;
												var gruposN = m/2;
												var n : number = 0;
												var iterador;
												
													for(iterador = 0; iterador<gruposN; iterador++){	
														var horaDesde1 = temporal[n];
														var horaHasta1 = temporal [n+1];
													
														var horaDesde1Numero = Number(horaDesde1.replace(":",""));
														var horaHasta1Numero = Number(horaHasta1.replace(":",""));
														
														if(!error) {
															//Si extiendo hora Hasta y se me superpone con otra reserva existente.
															if ((numeroHoraDesde < horaDesde1Numero) && (numeroHoraHasta > horaDesde1Numero) && (numeroHoraHasta < horaHasta1Numero)){							
																	titulo = "Error";
																	subtitulo= "El horario de finalización seleccionado se superpone con los de otra reserva,<br> que abarca desde las " + horaDesde1 + " hs hasta las " + horaHasta1 + " hs";
																	error = true;
															} else 
														
															//Si atraso hora Desde y se me superpone con otra reserva existente.
															if ((numeroHoraDesde >= horaDesde1Numero) && (numeroHoraDesde < horaHasta1Numero) && (numeroHoraHasta > horaHasta1Numero)){
																titulo = "Error";
																subtitulo = "El horario de inicio seleccionado se superpone con los de otra reserva,<br> que abarca desde las " + horaDesde1 + " hs hasta las " + horaHasta1 + " hs";
																error = true;
															} else 
															
															//Si hora Desde y hora Hasta me quedan dentro de otra reserva existente.
															if ((numeroHoraDesde > horaDesde1Numero) && (numeroHoraDesde < horaHasta1Numero) && (numeroHoraHasta > horaDesde1Numero) && (numeroHoraHasta < horaHasta1Numero)){								
																	titulo = "Error";
																	subtitulo= "Los horarios seleccionados se superponen con los de otra reserva,<br> que abarca desde las " + horaDesde1 + " hs hasta las " + horaHasta1 + " hs";
																	error = true;								
															} else 
															
															//Si hora Desde y hora Hasta engloban otra reserva existente.
															if ((numeroHoraDesde < horaDesde1Numero) && (numeroHoraHasta > horaHasta1Numero)){
																titulo = "Error";
																subtitulo = "Los horarios seleccionados se superponen con los de otra reserva,<br> que abarca desde las " + horaDesde1 + " hs hasta las " + horaHasta1 + " hs";
																error = true;
															} else 
																
															//Si la reserva empieza en el mismo horario que otra pero termina antes
															if ((numeroHoraDesde == horaDesde1Numero) && (numeroHoraHasta < horaHasta1Numero)){
																titulo = "Error";
																subtitulo = "El horario de finalización seleccionado se superpone con los de otra reserva,<br> que abarca desde las " + horaDesde1 + " hs hasta las " + horaHasta1 + " hs";
																error = true;
															} else 
															
															//Si la reserva termina en el mismo horario que otra pero empieza antes
															if ((numeroHoraDesde < horaDesde1Numero) && (numeroHoraHasta == horaHasta1Numero)){
																titulo = "Error";
																subtitulo = "El horario de inicio seleccionado se superpone con los de otra reserva,<br> que abarca desde las " + horaDesde1 + " hs hasta las " + horaHasta1 + " hs";
																error = true;
															}
														}
														n = n + 2;
													}

											if (!error){
												reserva.horaDesde = horaDesde;
												reserva.horaHasta = horaHasta;
										 
												let headers = new Headers();

												headers.append('Content-Type', 'application/json');
											 
											 	/* PRODUCCION */
												/* this.http.put('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/' + id, JSON.stringify(reserva), {headers: headers}) */

												/* LOCAL */
												this.http.put('http://localhost/reserva/' + id, JSON.stringify(reserva), {headers: headers})
												  .subscribe(res => {
												 //Si falla, se mostrará un mensaje de error
													if(res.status < 200 || res.status >= 300) {
														titulo = "Error";
														subtitulo = "No se pudo ocupar la cochera";
													} 
													//Si todo sale bien, se muestr mensaje confirmándolo
													else {
														titulo ="Horarios";
														subtitulo = "Los horarios fueron modificados exitosamente"
														console.log(res.json());
													}
													this.alertGenerico(titulo, subtitulo);
												});

												this.getReservasByMailAndFechaRese(reserva.mail, reserva.fechaRese);
											}
										} else {
											subtitulo = "El horario de finalizaci\u00F3n no puede ser anterior a la hora actual para la fecha en curso";
										}
									}else{
										subtitulo = "El lapso m\u00EDnimo de horarios debe ser de al menos una hora";
									}
								} else {
									subtitulo = "El horario inicial debe ser anterior al horario final";
								}
						} else {
							subtitulo = "Los horarios ingresados no pueden ser anteriores a las 08:00 hs ni posteriores a las 20:00 hs";
						}
					} else {
						esDiaActual = false;
						subtitulo = "El horario de inicio no puede ser anterior a la hora actual para la fecha en curso";
					}
					callback(subtitulo);
			});
	} 
}
  
  ocupar(reserva, texto: string){

	let id = reserva.id;
	var titulo;
	var subtitulo;
	let headers = new Headers();
    headers.append('Content-Type', 'application/json');
	
	reserva.estado = "Ocupado";
	reserva.fechaOcupa = new Date().toISOString();
	
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
	var horaActualString = horas.toString() + ":" + min.toString();

	if(diaActual.toISOString().substr(0, 10) == reserva.fechaRese.substr(0,10)){
		if (horaActual > Number(reserva.horaDesde.replace(":",""))){
			reserva.horaDesde = horaActualString;
			reserva.horaDesdeSort = Number(reserva.horaDesde.replace(":",""));
		}
	}
  
  	/* PRODUCCION */
    /* this.http.put('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/' + id, JSON.stringify(reserva), {headers: headers}) */

    /* LOCAL */
    this.http.put('http://localhost:8080/reserva/' + id, JSON.stringify(reserva), {headers: headers})
      .subscribe(res => {
		 //Si falla, se mostrará un mensaje de error
		if(res.status < 200 || res.status >= 300) {
			titulo = "Error";
			subtitulo = "No se pudo ocupar la cochera";
		} 
		//Si todo sale bien, se muestr mensaje confirmándolo
		else {
		
			if (texto == 'Inicio'){				
				titulo = "Ocupar";
				subtitulo = "Cochera ocupada exitosamente"				
			}else {				
				titulo = "Ocupando cochera";
			    subtitulo = "Ocupaci\u00F3n exitosa de la cochera N° " + reserva.espacioCochera + " en el horario de: " 
				+ reserva.horaDesde + ' hs a ' + reserva.horaHasta + " hs";
			}					

            console.log(res.json());
		}
		this.alertGenerico(titulo, subtitulo);
      });
	  
	this.getReservasByMailAndFechaRese(reserva.mail, reserva.fechaRese);
  }
 
 
  createReserva(reserva, callback){
 
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
 
	var titulo;
	var subtitulo;
 
 	/* PRODUCCION */
    /* this.http.post('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva', JSON.stringify(reserva), {headers: headers}) */

    /* LOCAL */
    this.http.post('http://localhost:8080/reserva', JSON.stringify(reserva), {headers: headers})
      .subscribe(res => {
		//Si falla, se mostrará un mensaje de error
		if(res.status < 200 || res.status >= 300) {
			titulo = "Error";
			subtitulo = "La reserva no fue generada";
		}
		//Si todo sale bien, se muestr mensaje confirmándolo
		else {
		
		//ROME2 agrega condicional por ocupado o reservado
		
		    if(reserva.estado == "Reservado"){
				titulo ="Reserva";
				subtitulo= "Cochera reservada exitosamente desde las: " + reserva.horaDesde + " hs hasta las " + reserva.horaHasta + " hs";			
			}
			if(reserva.estado == "Ocupado"){
				titulo ="Cochera";
				subtitulo="Usted ocup\u00F3 la cochera exitosamente";				
			}
				console.log(res.json());
		}
		this.alertGenerico2(titulo, subtitulo, function(){
			callback();
		});
	  });
	  
  }
 
  deleteReserva(id, texto: string){
 
	var titulo;
	var subtitulo;

 	/* PRODUCCION */
    /* this.http.delete('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/' + id).subscribe((res) => { */

    /* LOCAL */
    this.http.delete('http://localhost:8080/reserva/' + id).subscribe((res) => {
	  //Si falla, se mostrará un mensaje de error
		if(res.status < 200 || res.status >= 300) {
			titulo = "Error";
			if (texto == "Eliminar"){
				subtitulo = "No se pudo eliminar la reserva";
			} else if(texto == "Liberar") {
				subtitulo = "No se pudo liberar la cochera";
			}
		} 
		//Si todo sale bien, se muestr mensaje confirmándolo
		else {
			if (texto == "Eliminar"){
				titulo = "Eliminar";
				subtitulo = "Reserva eliminada exitosamente";
			} else if(texto == "Liberar") {
				titulo = "Liberar";
				subtitulo = "Cochera liberada exitosamente";
			}
			
			if(texto != "Inicio"){
				this.alertGenerico(titulo, subtitulo);
			}
		}
    });      
  }
  
  obtenerDiferenciaDeTiempo(horaDesde: string, horaHasta: string){
	var s = horaDesde.split(':');
	var e = horaHasta.split(':');
	var min = Number(e[1])-Number(s[1]);
	var minuto: string;
	var hora_adicional = 0;
	
	if(min < 0){
	   min += 60;
	   hora_adicional += 1;
	}
	
	var hora = Number(e[0]) - Number(s[0]) - hora_adicional;
	minuto = min.toString();
	
	if (min < 10){
		minuto = '0' + minuto;
	};
	
	var diferencia = hora.toString() + (minuto).substring(0,2);
	return Number(diferencia);
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


  alertGenerico2(titulo: string, subtitulo: string, callback) {
	let alert = this.alertCtrl.create({
    title: titulo,
	enableBackdropDismiss: false,
    subTitle: subtitulo,
    buttons: [
      {
        text: 'OK',
        handler: data => {
            callback();
       }
      },
    ]
  });
  alert.present();
  callback();
}

formatearFecha(fecha) {
	  
	  var date = new Date(fecha);
	  var mm = date.getMonth() + 1; // getMonth() arranca en 0
	  var dd = date.getDate();
	  return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, date.getFullYear()].join('/');
			 
  };
  
  
  formatearFechaADate(fecha) {
	  
	  var dia = fecha.substr(0,2);
	  var mes = fecha.substr(3,2);
	  var anio = fecha.substr(6,4);
	  
	  var fechaAFormatear = [mes, dia, anio].join('/');
	  
	  var date = new Date(fechaAFormatear);
	  var mm = date.getMonth() + 1; // getMonth() arranca en 0
	  var dd = date.getDate();
	  return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, date.getFullYear()].join('/');
			 
  };

}
