import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, Loading } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
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
export class AbmCocherasPage {
 
 public indiceAgregar;
 public indiceEditar;
 public indiceBorrar;
 
 public loading: Loading;
 public loadingCtrl: LoadingController;
 public alertCtrl: AlertController;

ionViewDidEnter() {
    
	//implementar con las cocheras
  }

  constructor(public navCtrl: NavController) {}

  showPrompt(subtitulo: string) {
  
  }
  
  eliminarCochera() {
	// var textoBoton;
	// var index = this.reservas.indexOf(this.indiceAlert);
		// if (this.reservas[index].estado == "Reservado"){
			// var titulo = 'Eliminar Reserva';
			// var subtitulo = '¿Desea eliminar esta reserva?';
			// textoBoton = 'Eliminar';
		// } else {
			// var titulo = 'Liberar Cochera';
			// var subtitulo = '¿Desea liberar la cochera seleccionada?';
			// textoBoton = 'Liberar';
		// }
	// let alert = this.alertCtrl.create({
    // title: titulo,
	// enableBackdropDismiss: false,
    // subTitle: subtitulo,
    // buttons: [
      // {
        // text: textoBoton,
        // handler: () => {
			// this.deleteReserva(this.reservas[index], textoBoton);
			// this.indiceOcupado = null;
			// this.indiceLiberar = null;
		// }
      // },
	   // {
        // text: 'Cerrar',
        // role: 'cancel',
      // },
    // ]
  // });
  // alert.present();
// }
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
