import { Injectable } from '@angular/core';
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
	  
	if(usuario.habilitado == true && usuario.telefono == ""){
		var error = "Usuario no habilitado";
		return error; 
	}
  }
}
