import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the TmpNoDispo provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TmpNoDispo {

data: any;
 
  constructor(public http: Http) {
    this.data = null;
  }
 
  getTmpNoDispo(){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get('http://localhost:8080/tmpNoDispo')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data._embedded.tmpNoDispo;
          resolve(this.data);
        });
    });
 
  }

}
