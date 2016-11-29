import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 
export class User {
  name: string;
  email: string;
  isLogged: boolean;
  rememberMe: boolean;
 
  constructor(name: string, email: string, isLogged: boolean, rememberMe: boolean) {
    this.name = name;
    this.email = email;
	this.isLogged = isLogged;
	this.rememberMe = rememberMe;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Por favor complete los campos para ingresar");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.email === "email");
        //this.currentUser = new User('Simon', 'saimon@devdactic.com');
        observer.next(access);
		//this.setLogged(true);
        observer.complete();
      });
    }
  }
  
  /*public setLogged (isLogged: boolean) {
		this.isLogged = isLogged;
  }
  
    public boolean isLogged () {
		return this.isLogged;
  }
  
  public boolean isChecked(isChecked: boolean) {
    this.isChecked = isChecked;
  }*/
  
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}