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

export class ReservaRecurrente {

  data: any;
  public resultado: boolean;

  constructor(public http: Http, public alertCtrl: AlertController) {
    this.data = null;
  } 
 
  executeReservaRecurrente(fecha_desde : string, fecha_hasta : string,
			hora_desde : string, hora_hasta : string, email : string, operacion : string, frec_semanal : string,
			usuario_alta : string){
    return new Promise(resolve => {
 
      this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/execute/ReservarEliminarRecurrente?fecha_desde=' + fecha_desde 
      	 + '&fecha_hasta=' + fecha_hasta
      	 + '&hora_desde=' + hora_desde 
      	 + '&hora_hasta=' + hora_hasta 
      	 + '&email=' + email 
      	 + '&operacion=' + operacion 
      	 + '&frec_semanal=' + frec_semanal 
      	 + '&usuario_alta=' + usuario_alta )
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
		  
        });
    });
 
  }
    
 }
