import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Usuarios provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Usuarios {

data: any;
public mensaje: string;
 
  constructor(public http: Http, public alertCtrl: AlertController) {
    this.data = null;
  }
 
  getUsuariosByMail(mail: string){
    return new Promise<any>(resolve => {
 
      this.http.get('http://localhost:8080/usuario/search/findByMail?mail=' + mail)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.usuario;
          resolve(this.data);
        });
    });
 
  }
  
  
  getUsuarios(){
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/usuario')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.usuario;
          resolve(this.data);
        });
    });
 
  }
  
  habilitarUsuario(usuario, mensaje, telefono, callback){
 
	usuario.telefono = telefono;
	usuario.habilitado = true;
	var outerThis = this;

    this.actualizarDatosUsuario(usuario, mensaje, function(){
		mensaje = outerThis.mensaje;
		callback(mensaje);
	});
  }
  
  habilitarUsuarioConContrasena(usuario, mensaje, telefono, contrasena, callback){
 
	usuario.telefono = telefono;
	usuario.clave = contrasena;
	usuario.habilitado = true;
	var outerThis = this;

    this.actualizarDatosUsuario(usuario, mensaje, function(){
		mensaje = outerThis.mensaje;
		callback(mensaje);
	});
  }
  
  actualizarDatosUsuario(usuario: any, mensaje: string, callback){
	  
	  let id = (usuario._links.self.href).substr(30);
	  let headers = new Headers();
	  headers.append('Content-Type', 'application/json');
   	  var titulo;
	  var subtitulo;
	  
	  this.http.put('http://localhost:8080/usuario/' + id, JSON.stringify(usuario), {headers: headers})
      .subscribe(res => {
		 //Si falla, se mostrará un mensaje de error
		if(res.status < 200 || res.status >= 300) {
			titulo = "Error";
			subtitulo = "No se pudo actualizar la informacion";
			this.alertGenerico(titulo, subtitulo);
			this.mensaje = "No se pudo actualizar la informacion";
		} 
		//Si todo sale bien, se muestr mensaje confirmándolo
		else {
            console.log(res.json());
			this.mensaje = "Datos actualizados";
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
        role: "cancel",
      },
    ]
  });
  alert.present();
}

}