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
   public  tipoOperacion: string;

   constructor(public http: Http, public alertCtrl: AlertController) {
      this.data = null;
   } 
 
   executeReservaRecurrente(fecha_desde : string, fecha_hasta : string, hora_desde : string, hora_hasta : string, 
   email : string, operacion : string, frec_semanal : string, usuario_alta : string) {
      
      return new Promise(resolve => {

         var titulo: string = "";
         var subtitulo: string = "";
         this.tipoOperacion = operacion;

         /* PRODUCCION */
         /* this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/reserva/execute/ReservarEliminarRecurrente?fecha_desde=' + fecha_desde  */

         /* LOCAL */
         this.http.get('http://localhost:8080/reserva/execute/ReservarEliminarRecurrente?fecha_desde=' + fecha_desde 
         + '&fecha_hasta=' + fecha_hasta
         + '&hora_desde=' + hora_desde 
         + '&hora_hasta=' + hora_hasta 
         + '&email=' + email 
         + '&operacion=' + operacion 
         + '&frec_semanal=' + frec_semanal 
         + '&usuario_alta=' + usuario_alta)
         .subscribe((res) => {
            /* ALTA DE RESERVA */
            if ( this.tipoOperacion == '1' ) {
               /* SI FALLA MOSTRARA UN MENSAJE DE ERROR */
               if(res.status < 200 || res.status >= 300) {
                  titulo = "Error";
                  subtitulo = "No se pudo reservar";
               } 
               /* MENSAJE DE CONFIRMACION*/
               else {
                  titulo = "Reserva Recurrente";
                  subtitulo = "Reserva creada exitosamente";
               }
            }
            /* BAJA DE RESERVA */
            if( this.tipoOperacion == '2' ) {
               /* SI FALLA MOSTRARA UN MENSAJE DE ERROR */
               if(res.status < 200 || res.status >= 300) {
                  titulo = "Error";
                  subtitulo = "No se pudo eliminar";
               } 
               /* MENSAJE DE CONFIRMACION*/
               else {
                  titulo = "Reserva Recurrente";
                  subtitulo = "Reserva eliminada exitosamente";
               }
            }
               
            this.alertGenerico(titulo, subtitulo);
         });
      });
   }

   alertGenerico(titulo: string, subtitulo: string) {
      let alert = this.alertCtrl.create({
         title: titulo,
         enableBackdropDismiss: false,
         subTitle: subtitulo,
         buttons: [
            {
               text: 'OK',
               role: 'cancel'
            }
         ]
      });
      alert.present();
   }
}
