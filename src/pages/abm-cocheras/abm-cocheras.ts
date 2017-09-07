import { Component } from '@angular/core';	
import { NavController, AlertController, LoadingController, Loading, Platform } from 'ionic-angular';
import { Cocheras } from '../../providers/cocheras';

/*
  Generated class for the AbmCocheras page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-abm-cocheras',
  templateUrl: 'abm-cocheras.html'
})
export class ABMCocherasPage {
 
 public index;
 public cocheras;
 public cocheraSeleccionada;

 public direccion;
 public espacio;
 public localidad;
 public nombre;

 public loading: Loading;
 
ionViewDidEnter() {
    
//Traigo de la base todas las cocheras
  this.cocherasService.getCocheras().then((data) => {
      this.cocheras = data;
      console.log(this.cocheras);
    });	
  }

  constructor(public navCtrl: NavController,public cocherasService: Cocheras,public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

  showPrompt(subtitulo: string) {
  
  }
  
  eliminarCochera() {
    var cochera = this.cocheras[this.index];  
    this.cocherasService.deleteCochera(cochera.id);
    this.cocheras.splice(this.index,1);
  }

  agregarCochera() {
    var cochera = this.cocheras[this.index];  
    this.cocherasService.deleteCochera(cochera.id);
    this.cocheras.splice(this.index,1);
  }

  editarCochera() {
    var cochera = this.cocheras[this.index];  
    this.cocherasService.deleteCochera(cochera.id);
    this.cocheras.splice(this.index,1);
  }

  marcarRadioButton(i){
    this.index = this.cocheras.indexOf(i);
    this.cocheraSeleccionada = this.cocheras[this.index];
    this.espacio = this.cocheraSeleccionada.espacio;
    this.direccion = this.cocheraSeleccionada.direccion;
    this.localidad = this.cocheraSeleccionada.localidad;
    this.nombre = this.cocheraSeleccionada.nombre;
  }
  

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Por favor aguarde...'
    });
    this.loading.present();
  }

  alertGenerico(titulo: string, subtitulo: string) {
  	let alert = this.alertCtrl.create({
      title: titulo,
  	enableBackdropDismiss: false,
      subTitle: subtitulo,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ]
    });
    alert.present();
  }
}