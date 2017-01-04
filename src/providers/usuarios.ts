import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Usuarios provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Usuarios {

data: any;
 
  constructor(public http: Http) {
    this.data = null;
  }
 
  getUsuariosByMail(mail: string){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/usuario/search/findByMail?mail=' + mail)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.usuario;
          resolve(this.data);
        });
    });
 
  }

}
