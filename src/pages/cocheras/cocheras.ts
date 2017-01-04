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
	private minDate;
	
	reservas: any;
	
  constructor(public navCtrl: NavController, public reservasService: Reservas, public usuariosService: Usuarios, 
					public cocherasService: Cocheras, /*public tmpDispoService: TmpDispo, public tmpNoDispoService: TmpNoDispo,*/
						public alertCtrl: AlertController) {
	
	this.ocultarResultados = true;
	this.setDia();
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
  
  marcarRadioCocheraNoDisponible(i){
	  this.indiceCocheraNoDisponible = i;
  }
  
  setHoraDesde(){
	  this.horaDesde = new Date().toISOString();
  }
  
  setHoraHasta(){
	  this.horaHasta = new Date().toISOString();
  }
  
  setDia(){
	   this.minDate = new Date().toISOString();
  }
  
  changeDate(fechaElegida) {
	    
	  var iguales = this.validarFecha(new Date(fechaElegida).toISOString(), new Date(this.minDate).toISOString());
	  
	  if(iguales){
		  this.hoy = new Date(fechaElegida).toISOString();
		  this.fechaElegida = this.hoy;
		  this.hoy = this.reservasService.formatearFecha(this.hoy);
		  console.log(this.hoy);
		  this.habilitarBoton = this.hoy;
	  } else {
		  var titulo = 'Fecha inválida';
		  var subtitulo = 'La fecha ingresada debe ser mayor o igual a la fecha actual';
		  this.alertGenerico(titulo, subtitulo);
	  }
  }
  
    validarFecha(fecha1, fecha2) {

	  var date1 = new Date(fecha1);
	  var date2 = new Date(fecha2);
	  var iguales: boolean = false;
	  
	  var mm1 = date1.getMonth() + 1; // getMonth() inicia en 0
	  var dd1 = date1.getDate()+1;
	  var yy1 = date1.getFullYear();
	  
	  var mm2 = date2.getMonth() + 1; // getMonth() inicia en 0
	  var dd2 = date2.getDay() + 1;
	  var yy2 = date2.getFullYear();
	  
	  if(yy1 >= yy2 && mm1 >= mm2 && dd1 >= dd2){
		  iguales =true;
	  } 
	  
	  return iguales;		 
  };
  
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
		var	v_telefono;
		var v_nombreCompleto;
		var temporal = [];
		var mailTemporal = [];
		var i = 0;
		var item;
		allreservasArray = data2;
		
		if(allreservasArray.length > 1){
			allreservasArray.sort(function(a, b){return a.horaDesdeSort - b.horaDesdeSort});
		}

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
					
				//Cochera con horario/s dsponible/s
				if(temporal.length == (allreservasArray.length)*2){
					
					var m: number = temporal.length;
					var gruposN = m/2;
					var n : number = 0;
					var iterador;
					
					for(iterador = 0; iterador<gruposN; iterador++){
						var horaDesde1 = temporal[n];
						var horaHasta1 = temporal [n+1];
					
						//Iteramos los horarios desde las 08:00 y entre reservas para colocarlos como disponibles
						if (Number(horadesde.replace(":","")) < horaDesde1.replace(":","")) {
							horaDesde = horadesde;
							horaHasta = horaDesde1;
							v_Dispo = this.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);
							//Number(horaHasta.replace(":","")) - Number(horaDesde.replace(":",""));
							if(horaDesde != horaHasta){
								this.tmpDispo.push({v_mail , v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo});
							}
							var desdeTemporal = horaHasta1;
							horadesde = desdeTemporal;
						} else {
							var desdeTemporal = horaHasta1;
							horadesde = desdeTemporal;
						}
						
						n = n + 2;
					}
				}
				
				mailTemporal.push(allreservasArray[z].mail);
				z = z + 1;		
			}
				
			//Horario/s no disponible/s de la cochera - Busco los datos de quien ocupa la cochera
			var outerThis = this;
			var vectorHoras = i;
			var iteradorMails = 0;
			
			//Itero las reservas para agregar los tramos que las conforman como no disponibles 
			for (item in mailTemporal){
				this.buscarsUsuarios(mailTemporal[item], function (){
						if (outerThis.allUsuariosArray.length >= 0 && i <= (mailTemporal.length)-1) {
							var usuario = outerThis.allUsuariosArray[0];
							v_nombreCompleto = usuario.nombre + " " + usuario.apellido;
							v_telefono = usuario.telefono;
							var horaDesde = temporal[vectorHoras];
							var horaHasta = temporal [vectorHoras+1];
							var v_mail = mailTemporal[iteradorMails];
							v_Dispo = outerThis.reservasService.obtenerDiferenciaDeTiempo(horaDesde, horaHasta);

							//Colocamos como no disponible a la cochera para el rango de horarios hallado
							outerThis.tmpNoDispo.push({v_mail, v_nombre, v_espacio, v_fecha, horaDesde, horaHasta, v_Dispo, v_telefono, v_nombreCompleto});
							
							vectorHoras = vectorHoras + 2;
							iteradorMails = iteradorMails + 1;
							i++;
						}
					});
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
	var v_espacio: string;
	var allreservasArray;
	var estado: String;
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
      title: 'Día: ' + this.disponibles[index].v_fecha + ' - Cochera: ' + this.disponibles[index].v_espacio,
      inputs: [
	  
        {
          name: 'desde',
		  placeholder: 'Desde',
		  type: 'time',
		  value: this.disponibles[index].horaDesde
        },
		{
		  name: 'hasta',
		  placeholder: 'Hasta',
		  type: 'time',
		  value: this.disponibles[index].horaHasta
		},
		/*{	
			type: "checkbox",
			name: 'Todo el día:',
			label: 'Todo el día',
			value: 'Todo el día:'
		},*/
		
      ],
	
      buttons: [
        {
          text: 'Guardar',
          handler: data => {
			//({v_mail , v_nombre, v_espacio, v_fecha, horaDesde , horaHasta, v_Dispo});
				//mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, estado, horaDesdeSort
			var reserva = [];
			var mail = this.disponibles[index].v_mail;
			var nombreCochera = this.disponibles[index].v_nombre;
			var espacioCochera: String;
			espacioCochera = (this.disponibles[index].v_espacio).toString();
			var fechaRese = this.disponibles[index].v_fecha;
			var horaDesde = data.desde;
			var horaHasta = data.hasta;
			var horaDesdeSort = Number(horaDesde.replace(":",""));
			var estado = "Reservado";
			var fechaAlta = "";
			var fechaOcupa = "";
			var fechaLibre = "";
			var contadorReservas = 0;
			var item;
			
			if(data.desde >= this.disponibles[index].horaDesde && data.hasta <= this.disponibles[index].horaHasta){
				reserva.push({mail, nombreCochera, espacioCochera, fechaRese, horaDesde, horaHasta, fechaAlta, estado, fechaOcupa, fechaLibre, horaDesdeSort});
				this.reservasService.createReserva(reserva[0]);
				//this.buscar();
			} else {
				var titulo = 'Horario Inválido';
				var subtitulo = 'El horario permitido es entre las '+ this.disponibles[index].horaDesde + ' hs y las ' + this.disponibles[index].horaHasta + ' hs';
				this.alertGenerico(titulo, subtitulo);
			}
          }
        },
		{
          text: 'Cerrar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    prompt.present();
  }
  
  alertGenerico(titulo: string, subtitulo: string) {
	let alert = this.alertCtrl.create({
    title: titulo,
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
  
  ionViewDidLoad() {
    console.log('Página Cocheras');
  }

}
