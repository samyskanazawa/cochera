import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 
export class User {
  name: string;
  email: string;
  isLogged: boolean;
  rememberMe: boolean;
 
  constructor(name: string, email: string, isLogged: boolean, rememberMe: boolean, password2: string) {
    this.name = name;
    this.email = email;
	this.isLogged = isLogged;
	this.rememberMe = rememberMe;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;
 
  public login(email: string, password: string, usuario) {
	  
		if(usuario.habilitado == false){
			var error = "Usuario no habilitado";
			return error; 
		} else {
		
		
			/*
				if(res.status == 401) {
						this.nav.setRoot(TabsPage)
				} 
			*/
			
			  return Observable.create(observer => {
				// At this point make a request to your backend to make a real check!
				let access = (password !== "pass" && email !== "email");
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
  }
  
  public register(credentials) {
    if (credentials.email === null || credentials.password === null|| credentials.password === credentials.password2) {
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
  }*/
}
