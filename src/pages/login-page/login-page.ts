import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { TabsPage } from '../tabs/tabs';
import { Usuarios } from '../../providers/usuarios';


@Component({
  selector: 'page-login',
  templateUrl: 'login-page.html'
})
export class LoginPage {
  @ViewChild('input') myInput ;
  loading: Loading;
  registerCredentials = {email: '', password: ''};
  public allUsuariosArray = [];
  public isChecked: boolean = false;
  public flagOnDismiss = false;
  public flagCancelclicked = false;
  public flagFocus;
 
  constructor(public nav: NavController, public auth: AuthService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public usuariosService: Usuarios) {}
  
 validateEmail(email) {
	if (email != "" && ! /^[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+@softtek.com/.test(email.toLowerCase())){
		
		this.showAdv("Dominio Incorrecto");
		this.registerCredentials.email="";
		this.registerCredentials.password="";
		
		if(this.isChecked == true){
			this.isChecked = false;
			window.localStorage.removeItem("mail");
			window.localStorage.removeItem("pass");
		}
		
	} else {
		var outerThis = this;
		var x;
		var index = -1;
		
		this.buscarsUsuarios(function(){
			var searchTerm = outerThis.registerCredentials.email;
					
			for(x = 0; x < outerThis.allUsuariosArray[0].length; x++) {
				if (outerThis.allUsuariosArray[0][x].mail == searchTerm && index == -1) {
					index = x;
				}
			}
			
			var usuario = outerThis.allUsuariosArray[0][index];
			
			if(outerThis.registerCredentials.email !== "" && usuario == null){
				var titulo = "Acceso denegado";
				var subtitulo = "Mail no autorizado";
				outerThis.alertGenerico(titulo, subtitulo);
				outerThis.registerCredentials.email="";
			} else{
				var mensaje = outerThis.auth.login(outerThis.registerCredentials.email, outerThis.registerCredentials.password, usuario);
							
				if (mensaje == "Primer ingreso"){
					var titulo = "Informaci\u00F3n adicional requerida";
					var subtitulo = "<br/><center><b>Por favor ingrese su n\u00FAmero de tel\u00E9fono celular (c\u00F3digo de area + n\u00FAmero) y contrase\u00f1a para contirunar</b></center>";
					outerThis.promptGenerico(titulo, subtitulo, usuario);
				}
			}
		});
	}
 }

  recordarDatos(isChecked){
	  if(isChecked){
		  this.isChecked = false;
		  window.localStorage.removeItem("mail");
		  window.localStorage.removeItem("pass");
	  } else {
		  this.isChecked = true;
		  window.localStorage.setItem("mail", this.registerCredentials.email);
		  window.localStorage.setItem("pass", this.registerCredentials.password);
	  }
  }


  ionViewWillLoad() {
	  this.isChecked = false;
	  if(window.localStorage.length > 2){
		  this.registerCredentials.email = window.localStorage.getItem("mail");
		  this.registerCredentials.password = window.localStorage.getItem("pass");
		  this.isChecked = true;
	  }
  }
 
  public login() {
	  
	this.flagFocus = true;  
	var outerThis = this;
	var q;
	var index = -1;
	
	if (this.registerCredentials.email === null || this.registerCredentials.password === null) {
      var titulo = "Error";
	  var subtitulo = "Por favor complete los campos para ingresar";
	  this.alertGenerico(titulo, subtitulo);
    } else {
		
		if ((this.registerCredentials.email != window.localStorage.getItem("mail")) && this.isChecked == true){
		  window.localStorage.removeItem("mail");
		  window.localStorage.removeItem("pass");
		  window.localStorage.setItem("mail", this.registerCredentials.email);
		  window.localStorage.setItem("pass", this.registerCredentials.password);
		}
		
		this.buscarsUsuarios(function(){
			
			var searchTerm = outerThis.registerCredentials.email;
			
			for(q = 0; q < outerThis.allUsuariosArray[0].length; q++) {
				if (outerThis.allUsuariosArray[0][q].mail == searchTerm && index == -1) {
					index = q;
				}
			}
			
			var usuario = outerThis.allUsuariosArray[0][index];
			
			if (usuario == null || (usuario.habilitado == false && usuario.telefono != "" && usuario.clave != "")){
				if(outerThis.isChecked == true){
					outerThis.registerCredentials.email="";
					outerThis.registerCredentials.password="";
					outerThis.isChecked = false;
					window.localStorage.removeItem("mail");
					window.localStorage.removeItem("pass");
				}
				var titulo = "Acceso denegado";
				var subtitulo = "Mail no autorizado";
				outerThis.alertGenerico(titulo, subtitulo);
			
			} else if(outerThis.registerCredentials.password == usuario.clave){
				setTimeout(() => {
					window.localStorage.setItem("email", outerThis.registerCredentials.email);
					outerThis.nav.setRoot(TabsPage);	
				});
			} else {
				outerThis.showAdv("Credenciales incorrectas");
				outerThis.registerCredentials.email="";
				outerThis.registerCredentials.password="";
				
				if(outerThis.isChecked == true){
					outerThis.isChecked = false;
					window.localStorage.removeItem("mail");
					window.localStorage.removeItem("pass");
				}
			}
		});
	}
  }
  
  buscarsUsuarios (callback) {
	  if(this.flagFocus){
		this.showLoading();
		this.usuariosService.getUsuarios().then((data) => {
			this.allUsuariosArray.push(data);
			callback();
		});
		this.loading.dismiss();
	  } else {
		this.usuariosService.getUsuarios().then((data) => {
			this.allUsuariosArray.push(data);
			callback();
		});
	  }
	  
	  
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
    if(this.flagFocus){
		setTimeout(() => {
			this.loading.dismiss();
		});
	}
	
    let alert = this.alertCtrl.create({
      title: titulo,
	  enableBackdropDismiss: false,
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
	var subtituloError;
	let prompt = this.alertCtrl.create({
		  title: titulo,
		  enableBackdropDismiss: false,
		  inputs: [
			{
			  name: 'telefono',
			  placeholder: 'Ingrese su n\u00FAmero de teléfono',
			  type: 'number',		  
			},
			{
			  name: 'contrasena',
			  placeholder: 'Ingrese una contrase\u00f1a',
			  type: 'password',		  
			},
			{
			  name: 'repetirContrasena',
			  placeholder: 'Repita la contrase\u00f1a',
			  type: 'password',		  
			},
		  ],
		  message: subtitulo,
		  buttons: [
			{
			  text: 'Guardar',
			  handler: data => {
				window.localStorage.setItem("noCancel", 'true');
				subtituloError = this.guardar(data, titulo, usuario);
			  }
			},
			 {
			  text: 'Cerrar',
			  role: 'cancel',
			},
		  ]
		});
		onkeypress = function(e) {
			var key = e.charCode || e.keyCode || 0;     
			if (key == 13) {
				window.localStorage.setItem("noCancel", 'true');
			}
		}
		prompt.onDidDismiss((data) => {
			if(subtituloError == null || subtitulo == ""){
				this.guardar(data, titulo, usuario);
			}
		});
		prompt.present();
	}
	
	
	cancelHandler(){
		this.flagOnDismiss = true;
	}
	
	guardar(data, titulo, usuario){
	  var subtituloError;
		if(window.localStorage.getItem("noCancel") == 'true'){
		  window.localStorage.removeItem("noCancel");
		  if (data.contrasena != "" || data.repetirContrasena != ""){
			  if ((data.contrasena).length >= 8){
				  if(data.contrasena == data.repetirContrasena){
					  if((data.telefono).length >= 10){
							var mensaje;
							var outerThis = this;
							this.usuariosService.habilitarUsuarioConContrasena(usuario, mensaje, data.telefono, data.contrasena, function(mensajeADevolver: string){
								if (mensajeADevolver == "Datos actualizados"){
									var tituloCorrecto = "Datos Actualizados";
									var subtituloCorrecto = "Los datos fueron actualizados correctamente";
									outerThis.alertGenerico(tituloCorrecto, subtituloCorrecto);
								} else {
									subtituloError = "<center><b>Error. No se pudo actualizar la informaci\u00F3n.</b></center><br>" + "<center><b>Por favor ingrese su n\u00FAmero de tel\u00E9fono celular (c\u00F3digo de area + n\u00FAmero) y contrase\u00f1a para contirunar</b></center>";
									outerThis.promptGenerico(titulo, subtituloError, usuario);
								}
							});
						} else {
							subtituloError = "<center><b>Formato de n\u00FAmero telef\u00F3nico inv\u00E1lido.</b></center><br>" + "<center><b>Por favor ingrese su n\u00FAmero de tel\u00E9fono celular (c\u00F3digo de area + n\u00FAmero) y contrase\u00f1a para contirunar</b></center>";
							this.promptGenerico(titulo, subtituloError, usuario);
						}
				  } else {
						subtituloError = "<center><b>Las contrase\u00f1as no coinciden.</b></center><br>" + "<center><b>Por favor ingrese su n\u00FAmero de tel\u00E9fono celular (c\u00F3digo de area + n\u00FAmero) y contrase\u00f1a para contirunar</b></center>";
						this.promptGenerico(titulo, subtituloError, usuario);
				  }
			  } else {
				  subtituloError = "<center><b>Las contrase\u00f1a requiere como m\u00EDnimo ocho d\u00EDgitos.</b></center><br>" + "<center><b>Por favor ingrese su n\u00FAmero de tel\u00E9fono celular (c\u00F3digo de area + n\u00FAmero) y contrase\u00f1a para contirunar</b></center>";
				  this.promptGenerico(titulo, subtituloError, usuario);
			  }
		  } else {
			  subtituloError = "<center><b>Por favor ingrese su n\u00FAmero de tel\u00E9fono celular (c\u00F3digo de area + n\u00FAmero) y contrase\u00f1a para contirunar</b></center>";
			  this.promptGenerico(titulo, subtituloError, usuario);
		  }
	  }
	  return subtituloError;
	}
}