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
 
      this.http.get('http://softteklabagents.eastus.cloudapp.azure.com/api/cocheras/java/cochera')

        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.cochera;
          resolve(this.data);
        });
    });
  }
}
