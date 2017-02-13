import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { Usuarios } from '../../providers/usuarios';


@Component({
  selector: 'page-login',
  templateUrl: 'login-page.html'
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};
  private allUsuariosArray = [];
  private isChecked: boolean = false;
 
  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private usuariosService: Usuarios) {}
 
 /*validate(password) {
	  if (password.length < 8) {
		this.showAdv("La contraseña debe ser mayor de 8 digitos")
		this.registerCredentials.password="";
	 }
 }*/

 validateEmail(email) {
	 if (email != "" && ! /^\w+[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+@softtek.com/.test(email)){
	 //^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
		 this.showAdv("Dominio Incorrecto");
		 this.registerCredentials.email="";
	 } 
 }

  public createAccount() {
    this.nav.push(RegisterPage);
  }
  
  recordarDatos(isChecked){
	  if(isChecked){
		  this.isChecked = false;
		  window.localStorage.removeItem("isChecked");
		  window.localStorage.removeItem("mail");
		  window.localStorage.removeItem("password");
	  } else {
		  this.isChecked = true;
		  window.localStorage.setItem("isChecked", "true");
		  window.localStorage.setItem("mail", this.registerCredentials.email);
		  window.localStorage.setItem("password", this.registerCredentials.password);
	  }
  }


  ionViewDidLoad() {
	  if(window.localStorage.length > 0){
		  this.registerCredentials.email = window.localStorage.getItem("mail");
		  this.registerCredentials.password = window.localStorage.getItem("password");
		  this.isChecked = true;
	  }
  }
 
  public login() {
	  
	var outerThis = this;
	var q;
	var index = -1;
    this.showLoading();
	
	if (this.registerCredentials.email === null || this.registerCredentials.password === null) {
      var titulo = "Error";
	  var subtitulo = "Por favor complete los campos para ingresar";
	  this.alertGenerico(titulo, subtitulo);
    } else {
		
		this.buscarsUsuarios(function(){
			
			var searchTerm = outerThis.registerCredentials.email;
			
			for(q = 0; q < outerThis.allUsuariosArray[0].length; q++) {
				if (outerThis.allUsuariosArray[0][q].mail == searchTerm && index == -1) {
					index = q;
				}
			}
			var usuario = outerThis.allUsuariosArray[0][index];
			
			if (usuario == null){
				var titulo = "Acceso denegado";
				var subtitulo = "Mail no autorizado";
				outerThis.alertGenerico(titulo, subtitulo);
			} else {
				
				var mensaje = outerThis.auth.login(outerThis.registerCredentials.email, outerThis.registerCredentials.password, usuario);
				
				if (mensaje == "Usuario no habilitado"){
					var titulo = "Acceso denegado";
					var subtitulo = "No se encuentra habilitado para utilizar la aplicación. Por favor ingrese su teléfono para continuar";
					outerThis.promptGenerico(titulo, subtitulo, usuario);
				} else {
					setTimeout(() => {
						
						outerThis.nav.setRoot(TabsPage);
					});
				}
			}
		});
	
		this.loading.dismiss();
	
	
	
		/*this.auth.login(usuario).subscribe(allowed => {
		  if (allowed) {
			setTimeout(() => {
			this.loading.dismiss();
			this.nav.setRoot(TabsPage);
			});
		  } else {
			this.showError("Acceso Denegado");
		  }
		},
		error => {
		  this.showError("Por favor complete los campos");
		});*/
	}
  }
  
  buscarsUsuarios (callback) {
	  this.usuariosService.getUsuarios().then((data) => {
		this.allUsuariosArray.push(data);
		callback();
	});
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Por favor aguarde...'
    });
    this.loading.present();
  }
 
  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  showAdv(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Advertencia',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

   showAdv2(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Credenciales incorrectas',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  
   alertGenerico(titulo: string, subtitulo: string) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      buttons:  [
			{
			  text: 'OK',
			  handler: data => {
				  if(titulo == "Datos Actualizados"){
						this.nav.setRoot(TabsPage);
					}
			  }
			},
		  ]
    });
    alert.present(prompt);
  }
  
   promptGenerico(titulo: string, subtitulo: string, usuario) {
	let prompt = this.alertCtrl.create({
		  title: titulo,
		  inputs: [
			{
			  name: 'telefono',
			  placeholder: 'Ingrese su número de teléfono',
			  type: 'number',		  
			},
		  ],
		  message: subtitulo,
		  buttons: [
			{
			  text: 'Guardar',
			  handler: data => {
				  if((data.telefono).length >= 10){
					var mensaje;
					var outerThis = this;
					this.usuariosService.habilitarUsuario(usuario, mensaje, data.telefono, function(mensajeADevolver: string){
						if (mensajeADevolver == "Datos actualizados"){
							var tituloCorrecto = "Datos Actualizados";
							var subtituloCorrecto = "Los datos fueron actualizados correctamente";
							outerThis.alertGenerico(tituloCorrecto, subtituloCorrecto);
						} else {
							subtitulo = "<center><b>Error. No se pudo actualizar la informacion.</b></center><br><br>" + subtitulo;
							outerThis.promptGenerico(titulo, subtitulo, usuario);
						}
					});
				  } else {
					  subtitulo = "<center><b>Formato de número telefónico inválido.</b></center><br><br>" + subtitulo; 
					  this.promptGenerico(titulo, subtitulo, usuario);
				  }
			  }
			},
			 {
			  text: 'Cerrar',
			  role: 'cancel',
			},
		  ]
		});
		prompt.present();
	}
}