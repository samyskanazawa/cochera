import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';


 
@Component({
  selector: 'page-login',
  templateUrl: 'login-page.html'
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};
  private emailingresado: string;
 
  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}
 
  public createAccount() {
    this.nav.push(RegisterPage);
  }

 
  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
        this.loading.dismiss();
        this.nav.setRoot(TabsPage)
        });
      } else {
        this.showError("Acceso Denegado");
      }
    },
    error => {
      this.showError("Por favor complete los campos");
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


 validarEmail() {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(this.emailingresado)){
   this.showError("La dirección de email " + this.emailingresado + " es correcta.");
  } else {
   this.showError("La dirección de email es incorrecta.");
  }
}

}
	

