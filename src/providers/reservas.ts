import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Reservas provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Reservas {

  data: any;
 
  constructor(public http: Http) {
    this.data = null;
  }
 
  getReservas(){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/reserva')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.reserva;
          resolve(this.data);
        });
    });
 
  }
  
  getReservasByFecha(fecha: string){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/reserva/search/findByFechaRese?fechaRese=' + fecha)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.reserva;
          resolve(this.data);
        });
    });
 
  }
  
  getReservasByMail(mail: string){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/reserva/search/findByMail?mail=' + mail)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.reserva;
          resolve(this.data);
        });
    });
 
  }
  
 findByQuery( nombreCochera: string, espacioCochera: number, fechaRese: string, estado: string){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/reserva/search/findByQuery?nombreCochera='+ nombreCochera + '&espacioCochera=' + espacioCochera + '&fechaRese=' + fechaRese + '&estado' + estado)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
 
  }
 
  editReserva(reserva, horaDesde, horaHasta){
 
	let id = (reserva._links.self.href).substr(30);
 
	let headers = new Headers();
    headers.append('Content-Type', 'application/json');
	
	reserva.horaDesde = horaDesde;
	reserva.horaHasta = horaHasta;
 
    this.http.put('http://localhost:8080/reserva/' + id, JSON.stringify(reserva), {headers: headers})
      .subscribe(res => {
        console.log(res.json());
      });
	  
	this.getReservas();
  }
  
  ocupar(reserva){
 
	let id = (reserva._links.self.href).substr(30);
 
	let headers = new Headers();
    headers.append('Content-Type', 'application/json');
	
	reserva.estado = "Ocupado";
	reserva.fechaOcupa = "22/12/2016";
 
    this.http.put('http://localhost:8080/reserva/' + id, JSON.stringify(reserva), {headers: headers})
      .subscribe(res => {
        console.log(res.json());
      });
	  
	this.getReservas();
  }
 
  createReserva(reserva){
 
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
 
    this.http.post('http://localhost:8080/reserva', JSON.stringify(reserva), {headers: headers})
      .subscribe(res => {
        console.log(res.json());
      });
  }
 
  deleteReserva(id){
 
    this.http.delete('http://localhost:8080/reserva/' + id).subscribe((res) => {
      console.log(res.json());
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
	//var min = (min/60)*100;
	minuto = min.toString();
	
	if (min < 10){
		minuto = '0' + minuto;
	};
	
	var diferencia = hora.toString() + (minuto).substring(0,2);
	return Number(diferencia);
  }
  
  formatearFecha(fecha) {
	  var date = new Date(fecha);
	  var mm = date.getMonth() + 1; // getMonth() inicia en 0
	  var dd = date.getDate() + 1;

	  return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, date.getFullYear()].join('/');
			 
  };

}
