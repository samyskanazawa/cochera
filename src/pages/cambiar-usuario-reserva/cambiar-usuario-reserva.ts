import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Usuarios } from '../../providers/usuarios';

@Component({
  selector: 'page-cambio-usuario-reserva',
  templateUrl: 'cambiar-usuario-reserva.html'
})
 
export class CambiarUsuarioReservaPage {

	usuarios:any;
	usuario:any
	public selectOptions;
	
  	constructor(public navCtrl: NavController, public usuariosService: Usuarios, public alertCtrl: AlertController) {
	}

	ionViewDidEnter() {

		this.buscarUsuarios(function(){

		});

		this.selectOptions = {
  			title: 'Seleccione Usuario',
  			subTitle: 'para realizar reservas',
  			mode: 'md'
		};
		
	}

	buscarUsuarios (callback) {
	  	this.usuariosService.getUsuarios().then((data) => {
			this.usuarios = data;

			this.usuarios.sort(function(a, b){
    			return a.apellido == b.apellido ? 0 : a.apellido < b.apellido ? -1 : 1;
			})

			var mailCambioUsuario = window.sessionStorage.getItem("mailCambioUsuario");
			if(mailCambioUsuario) {
				this.usuario = mailCambioUsuario;
			}

			callback();
		});
  	}

  	changeSelect(mail) {
  		window.sessionStorage.setItem("mailCambioUsuario", mail);
	}

}
