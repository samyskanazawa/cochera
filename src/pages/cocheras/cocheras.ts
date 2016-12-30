import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Reservas } from '../../providers/reservas';
import { Cocheras } from '../../providers/cocheras';
import { Usuarios } from '../../providers/usuarios';
import { OrderBy } from '../../pipes/sort';
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
	private habilitarBoton: string;
	private tmpDispo;
	private tmpNoDispo;
	private allUsuariosArray = [];
	
	reservas: any;
	
  constructor(public navCtrl: NavController, public reservasService: Reservas, public usuariosService: Usuarios, 
					public cocherasService: Cocheras, /*public tmpDispoService: TmpDispo, public tmpNoDispoService: TmpNoDispo,*/
						public alertCtrl: AlertController) {
	
	this.ocultarResultados = true;
  }

  devolverColorFilaDisponible(i){
	//[ngStyle]="{'background-color': devolverColorFila(i)}"
	var indexDisponibles = this.disponibles.indexOf(i);
	
	switch (this.disponibles[indexDisponibles].v_Dispo) {
		case 1200:
			return "green";
		default:
			return "yellow";
    }
  }
  
  devolverColorFilaNoDisponible(){
	  return "red";
  }
  
  setHoraDesde(){
	  this.horaDesde = new Date().toISOString();
  }
  
  setHoraHasta(){
	  this.horaHasta = new Date().toISOString();
  }
  
  setDia(){
	  this.today  = new Date().toISOString();
	  this.habilitarBoton = this.today;
  }
  
  formatearFecha(fecha) {
	  var date = new Date(fecha);
	  var mm = date.getMonth() + 1; // getMonth() is zero-based
	  var dd = date.getDate();

	  return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, date.getFullYear()].join('/');
			 
  };
  
  buscar(){
	  var fecha = this.formatearFecha(this.today);
	  var v_fecha = fecha;
	  this.obtenerCocherasSinRango(v_fecha);
	  this.ocultarResultados = false;
  }
  
  queryReservas(v_nombre,v_espacio, v_fecha, estado, v_mail, horaDesde, horaHasta, allreservasArray ){
	  this.reservasService.findByQuery(v_nombre, v_espacio, v_fecha, estado).then((data2) => {
				
		var z;
		var v_Dispo;
		var horadesde;
		var horaDesdeNoDisponible;
		var horaHastaNoDiponible;
		var	v_telefono;
		var telefonos = []
		var nombreCompleto = [];
		var v_nombreCompleto;
		var temporal = [];
		var mailTemporal = [];
		var vectorHoraHasta = [];
		var indice;
		var i = 0;
		var h = 0;
		var item;
		var posicion = 0;
		allreservasArray = data2;

		if (allreservasArray.length <= 0) {
			horaDesde = "08:00";
			horaHasta = "20:00";
			v_Dispo = 1200;
			this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde , horaHasta, v_Dispo});
		}
		else {
			
			//Busca rango disponible
			z = 0;
			horadesde = "08:00";
			
			while(z < allreservasArray.length) {
				
					temporal.push(allreservasArray[z].horaDesde);
					temporal.push(allreservasArray[z].horaHasta);
					temporal.sort();
					
				//Cochera con horario/s dsponible/s - tomo un máximo de 2 reservas en el día para la cochera
				if(temporal.length == (allreservasArray.length)*2){
					
					var horaDesde1 = temporal[0];
					var horaHasta1 = temporal [1];
					var horaDesde2 = temporal[2];
					var horaHasta2 = temporal [3];
					
					//Primera reserva: insertamos como horario desde las 08:00 hasta su comienzo,
					//o pasa a ser horario ocupado si comienza a las 08:00
					if (Number(horadesde.replace(":","")) < horaDesde1.replace(":","")) {
						horaDesde = horadesde;
						horaHasta = horaDesde1;
						//debugger;
						v_Dispo = Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""));
						this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
						horadesde = horaHasta1;
					} else {
						horadesde = horaHasta1;
					}
					
					//Segunda reserva: insertamos como diponible el tramo desde el final de la reserva
					//anterior al comienzo de la segunda.
					if (horaDesde2 != null && horaHasta2 != null){
						horaDesde = horaHasta1;
						horaHasta = horaDesde2;
						v_Dispo = Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""));
						this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
						horadesde = horaHasta2;
					}
				}
					
				//Horario/s no disponible/s de la cochera
				vectorHoraHasta.push({"espacio" :v_espacio , horaHasta : allreservasArray[z].horaHasta, "horaHastaNumero" : Number((allreservasArray[z].horaHasta).replace(":",""))});
				mailTemporal.push(allreservasArray[z].mail);
				
				//Busco los datos de quien ocupa la cochera
				var outerThis = this;
				var vectorHoras = i;
				
				//Si hay ,más de una reserva, las itero para agregar dichos tramos como no disponibles 
				for (item in mailTemporal){
					this.buscarsUsuarios(mailTemporal[item], function (){
						if (outerThis.allUsuariosArray.length >= 0 && i <= (mailTemporal.length)-1) {
							
							telefonos.push(outerThis.allUsuariosArray[i].telefono);
							nombreCompleto.push({item : outerThis.allUsuariosArray[item].nombre + " " + outerThis.allUsuariosArray[item].apellido});

							var horaDesde = temporal[vectorHoras];
							var horaHasta = temporal [vectorHoras+1];
							var v_mail = mailTemporal[i];
							v_Dispo = Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""));
							v_nombreCompleto = outerThis.allUsuariosArray[i].nombre + " " + outerThis.allUsuariosArray[i].apellido;
							v_telefono = telefonos[i];
							vectorHoras = vectorHoras +2;
							i = i+1;
							
							//Colocamos como no disponible a la cochera para el rango de horarios hallado
							outerThis.tmpNoDispo.push({v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo, v_telefono, v_nombreCompleto});
						}
					});
				}

				z = z + 1;		
			}

			//Tramo final: si la última reserva termina antes de las 20:00, inserto como horario
			//disponible el tramo desde el final de la reserva hasta las 20:00			
			if (horadesde != "20:00"){
				
				v_Dispo = 2000 - Number(horadesde.replace(":",""));
				//Coloca como disponible a la cochera para el rango hallado
				horaHasta = "20:00"
				horaDesde = horadesde;
				this.tmpDispo.push({v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
			}
		}
	});
  };
  
  
  buscarsUsuarios (mail: string, callback) {
	  this.usuariosService.getUsuariosByMail(mail).then((data) => {

		this.allUsuariosArray = data;
		callback();
	});
  }
  
  
  obtenerCocherasSinRango(v_fecha: string){
	  
	var v_mail;
	var v_items;
	var v_item;
	var v_nombre;
	var v_espacio;
	var allreservasArray;
	var estado: string;
	var horaDesde:string;
	var horaHasta: string;
	
	v_mail = "hernan.ruiz@softtek.com";
	
	//Traigo de la base todas las cocheras
	this.cocherasService.getCocheras().then((data) => {
		
		v_items = data;
		this.tmpDispo = [];
		this.tmpNoDispo = [];
		this.disponibles =  [];
		this.noDisponibles = [];
		this.allUsuariosArray = [];
		
		//Itero las cocheras encontradas para buscar reservas en el día seleccionado
		for (let item of v_items) {
			
			v_item = item;
			v_nombre = v_item.nombre;
			v_espacio = v_item.espacio;
			
			//Se buscará por estado diferente a "Libre"
			estado = "Libre";
			
			this.queryReservas(v_nombre, v_espacio, v_fecha, estado, v_mail, horaDesde, horaHasta, allreservasArray );
		}
		
		this.disponibles = this.tmpDispo;
		this.noDisponibles = this.tmpNoDispo;
	});
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
    console.log('Página Cocheras');
  }

}
