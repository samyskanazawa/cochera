import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Cocheras provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Cocheras {

  
 data: any;

 

 ip_dinamica ="10.5.10.151";
 
  constructor(public http: Http) {
    this.data = null;
  }
 
  getCocheras(){
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/cochera')

        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.cochera;
          resolve(this.data);
        });
    });
  }

  deleteCochera(id : string) {
   return new Promise(resolve => {
      this.http.delete('http://localhost:8080/cochera/' + id)

        .map(res => res)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
