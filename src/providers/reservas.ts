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
  
  
  
 findByQuery( nombreCochera: string, espacioCochera: number, fechaRese: string){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
	/*let headers = new Headers();
    headers.append('Content-Type', 'application/json');
 
	var body = new FormData;
	body.append('nombreCochera', nombreCochera);
	body.append('espacioCochera', espacioCochera);
	body.append('fechaRese', fechaRese);
	body.append('estado', estado);*/
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/reserva/search/findByQuery?nombreCochera='+ nombreCochera + '&espacioCochera=' + espacioCochera + '&fechaRese=' + fechaRese)
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

}
