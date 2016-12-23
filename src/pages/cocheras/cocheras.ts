import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Reservas } from '../../providers/reservas';
import { Cocheras } from '../../providers/cocheras';
import { Usuarios } from '../../providers/usuarios';
//import { TmpDispo } from '../../providers/tmpDispo';
//import { TmpNoDispo } from '../../providers/tmpNoDispo';

/*
  Generated class for the Cocheras page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cocheras',
  templateUrl: 'cocheras.html'
})
export class CocherasPage {
	private today: string;
	private horaDesde: string;
	private horaHasta: string;
	private ocultarResultados: boolean;
	private disponibles: any;
	private noDisponibles: any;
	private tmpDispo: any;
	private tmpNoDispo: any;
	private habilitarBoton: string;
	
	reservas: any;
	
  constructor(public navCtrl: NavController, public reservasService: Reservas, public usuariosService: Usuarios, 
					public cocherasService: Cocheras, /*public tmpDispoService: TmpDispo, public tmpNoDispoService: TmpNoDispo,*/
						public alertCtrl: AlertController) {
	this.ocultarResultados = true;
    //console.log(this.today);
  }

  setHoraDesde(){
	  this.horaDesde = new Date().toISOString();
  }
  
  setHoraHasta(){
	  this.horaHasta = new Date().toISOString();
  }
  
  setDia(){
	  this.today  = new Date().toISOString();
	  console.log(this.today);
	  this.habilitarBoton = this.today;
  }
  
  buscar(){
	  var v_nombre = "Maipu 942";
	  var v_espacio:number = 3;
	  var estado = "Ocupado";
	  var v_fecha = "23/12/2016";
	  var allreservasArray;
	  allreservasArray = this.obtenerCocherasSinRango(v_fecha);
	  console.log(allreservasArray);
	  this.ocultarResultados = false;
  }
  
  
  obtenerCocherasSinRango(v_fecha: string){
	  
	var v_mail;
	var v_items;
	var v_item;
	var v_nombre;
	var v_espacio;
	var allreservasArray;
	var z;
	var a;
	var v_array;
	var v_Dispo;
	var horadesde;
	var horadesde_libre;
	var horafin_libre;
	var	allUsuariosArray;
	var	v_telefono;
	var estado: string;
	
	v_mail = "hernan.ruiz@softtek.com";
	
	v_items = this.cocherasService.getCocheras();
	
	while(v_items.next) {
		v_item = v_items.next();
		v_nombre = v_item.nombre;
		v_espacio = v_item.espacio;
		
		allreservasArray = this.reservasService.findByQuery(v_nombre , v_espacio ,v_fecha);
		
		while (allreservasArray.next){
			i(allreservasArray[a].estado = "Libre"){
				allreservasArray.splice(a, 1);
			}
		}
		
		if (allreservasArray.length <= 0) {
			var horaDesde = "8:00";
			var horaHasta = "20:00";
			var horasDispo = 1200;
			this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde , horaHasta, horasDispo});
		}
		else {
			//Busca rango disponible
			z = 0;
			horadesde = "8:00";
			while(z < allreservasArray.length) {
				//Cochera Disponible
				if (Number(horadesde.replace(":","")) < Number(allreservasArray[z].horaDesde.replace(":",""))) {
		//			printjson("Entra");
					horadesde_libre = horadesde;
					horafin_libre = allreservasArray[z].horaDesde;
					v_Dispo = Number(horafin_libre.replace(":","")) - Number(
					this.tmpDispo[z] = {v_mail , v_nombre, v_espacio, v_fecha, horadesde_libre, horafin_libre, v_Dispo});
					//db.tmpDispo.insert( {"mail" : v_mail , "nombreCochera" : v_nombre, "espacioCochera" : v_espacio, "fechaDispo" : v_fecha, "horaDesde" : horadesde_libre , "horaHasta" : horafin_libre , "horasDispo" : v_Dispo});
				}

				//Cochera no disponible
				horadesde_libre = allreservasArray[z].horaDesde;
				horafin_libre = allreservasArray[z].horaHasta;
				v_Dispo = Number(horafin_libre.replace(":","")) - Number(horadesde_libre.replace(":",""));

				//Busco el teléfono
				allUsuariosArray = this.usuariosService.getUsuarios();
				if (allUsuariosArray.length >= 0 ) {
					v_telefono = allUsuariosArray[0].telefono;
				}

				//Coloca como disponible a la cochera para el rango hallado
				this.tmpNoDispo[z] = {v_mail , v_nombre, v_espacio, v_fecha, horadesde_libre, horafin_libre, v_Dispo, v_telefono};
				//db.tmpNoDispo.insert( {"mail" : v_mail , "nombreCochera" : v_nombre, "espacioCochera" : v_espacio, "fechaDispo" : v_fecha, "horaDesde" : horadesde_libre , "horaHasta" : horafin_libre , "horasDispo" : v_Dispo, telefono : v_telefono});
				
				horadesde = allreservasArray[z].horaHasta;
				z = z + 1;
			}

			if (horadesde != "20:00"){
				v_Dispo = 2000 - Number(horadesde.replace(":",""));
				//Coloca como disponible a la cochera para el rango hallado
				var horaHasta = "20:00"
				this.tmpDispo.push({v_mail, v_nombre, v_espacio, v_fecha, horadesde, horaHasta, v_Dispo});
			}
		}
	}
	
	this.disponibles = this.tmpDispo;
	this.noDisponibles = this.tmpNoDispo;
 }
	  
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Día:',
      inputs: [
        {
          name: 'Desde',
		  placeholder: 'Desde'
        },
		{
		  name: 'Hasta',
		  placeholder: 'Hasta'
		},
		{
			name: 'Todo el día:',
			label: 'Todo el día',
			type: "checkbox",
			value: "Todo el día:"
		}
      ],
	
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    prompt.present();
  }
  
  ionViewDidLoad() {
    console.log('Hello CocherasPage Page');
  }

}
