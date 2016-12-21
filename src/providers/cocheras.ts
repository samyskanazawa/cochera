import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Cocheras provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Cocheras {

 data: any;
 
  constructor(public http: Http) {
    this.data = null;
  }
 
  getCocheras(){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/cochera')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.cochera;
          resolve(this.data);
        });
    });
 
  }
}
