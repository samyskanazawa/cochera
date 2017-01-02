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
	private fechaElegida: any;
	private horaDesde: string;
	private horaHasta: string;
	private ocultarResultados: boolean;
	private disponibles: any;
	private noDisponibles: any;
	private habilitarBoton: string;
	private tmpDispo;
	private tmpNoDispo;
	private allUsuariosArray = [];
	private hoy: string;
	private indiceCocheraDisponible: any
	private indiceCocheraNoDisponible: any
	
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
  
  marcarRadioCocheraDisponible(i){
	  this.indiceCocheraDisponible = i;
  }
  
  setHoraDesde(){
	  this.horaDesde = new Date().toISOString();
  }
  
  setHoraHasta(){
	  this.horaHasta = new Date().toISOString();
  }
  
  setDia(){
	  this.hoy = this.reservasService.formatearFecha(this.fechaElegida);
	  console.log(this.hoy);
  }
  
  changeDate(fechaElegida) {
	  this.hoy = new Date(fechaElegida).toISOString();
	  this.fechaElegida = this.hoy;
	  this.hoy = this.reservasService.formatearFecha(this.hoy);
	  console.log(this.hoy);
	  this.habilitarBoton = this.hoy;
  }
  
  buscar(){
	  var fecha = this.hoy;
	  this.obtenerCocherasSinRango(fecha);
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
		var telefonos = [];
		var v_nombreCompleto;
		var temporal = [];
		var mailTemporal = [];
		var indice;
		var i = 0;
		var h = 0;
		var item;
		var posicion = 0;
		allreservasArray = data2;
		
		if (allreservasArray.length <= 0) {
			horaDesde = "08:00";
			horaHasta = "20:00";
			v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
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
						v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
						//Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""));
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
						v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
						this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
						horadesde = horaHasta2;
					}
				}
					
				//Horario/s no disponible/s de la cochera - Busco los datos de quien ocupa la cochera
				var outerThis = this;
				var vectorHoras = i;
				mailTemporal.push(allreservasArray[z].mail);
				
				//Si hay ,más de una reserva para una cochera, las itero para agregar dichos tramos como no disponibles 
				for (item in mailTemporal){
					this.buscarsUsuarios(mailTemporal[item], function (){
						if (outerThis.allUsuariosArray.length >= 0 && i <= (mailTemporal.length)-1) {
							
							telefonos.push(outerThis.allUsuariosArray[i].telefono);
							v_nombreCompleto = outerThis.allUsuariosArray[i].nombre + " " + outerThis.allUsuariosArray[i].apellido;
							v_telefono = telefonos[i];
							var horaDesde = temporal[vectorHoras];
							var horaHasta = temporal [vectorHoras+1];
							var v_mail = mailTemporal[i];
							
							v_Dispo = outerThis.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
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
			
				//Coloca como disponible a la cochera para el rango hallado
				horaHasta = "20:00"
				horaDesde = horadesde;
				v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
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
	var index = this.disponibles.indexOf(this.indiceCocheraDisponible);
    let prompt = this.alertCtrl.create({
      title: 'Día: ' + this.disponibles[index].v_fecha + ' Cochera: ' + this.disponibles[index].v_espacio,
      inputs: [
	  
        {
          name: 'Desde',
		  placeholder: 'Desde',
		  value: this.disponibles[index].horaDesde
        },
		{
		  name: 'Hasta',
		  placeholder: 'Hasta',
		  value: this.disponibles[index].horaHasta
		},
		/*{	
			type: "checkbox",
			name: 'Todo el día:',
			label: 'Todo el día',
			value: "Todo el día:"
		},*/
		
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
