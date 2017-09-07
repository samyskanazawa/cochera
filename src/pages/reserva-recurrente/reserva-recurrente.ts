import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReservaRecurrente } from '../../providers/reserva-recurrente';


/*
  Generated class for the ReservasRecurrentes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reserva-recurrente',
  templateUrl: 'reserva-recurrente.html'
})
export class ReservaRecurrentePage {
	
	public FechaDesde = new Date().toISOString();;
	public FechaHasta = new Date().toISOString();;
	public HoraDesde = '08:00';
	public HoraHasta = '20:00';
	public mail = window.localStorage.getItem("email");

	public Lunes;
	public Martes;
	public Miercoles;
	public Jueves;
	public Viernes;

	public Recurrence = "Diario";
	
	constructor(public navCtrl: NavController, public reservaRecurrenteService: ReservaRecurrente) {}

	executeReservaRecurrente(){ 
		var frec_semanal = "";

		if(this.Recurrence == "Semanal"){
			if(this.Lunes)
				frec_semanal += "1";
			if(this.Martes)
				frec_semanal += "2";
			if(this.Miercoles)
				frec_semanal += "3";
			if(this.Jueves)
				frec_semanal += "4";
			if(this.Viernes)
				frec_semanal += "5";
		}
		var fechaDesdeParse = this.FechaDesde.substr(0,10);
		var fechaHastaParse = this.FechaHasta.substr(0,10);
		
		this.reservaRecurrenteService.executeReservaRecurrente(fechaDesdeParse, fechaHastaParse,
			this.HoraDesde, this.HoraHasta, this.mail, "1", frec_semanal,
			this.mail /*deberia ser el usuario administrador*/);
	}

	removeReservaRecurrente(){ 
		var frec_semanal = "";

		if(this.Recurrence == "Semanal"){
			if(this.Lunes)
				frec_semanal += "1";
			if(this.Martes)
				frec_semanal += "2";
			if(this.Miercoles)
				frec_semanal += "3";
			if(this.Jueves)
				frec_semanal += "4";
			if(this.Viernes)
				frec_semanal += "5";
		}
		var fechaDesdeParse = this.FechaDesde.substr(0,10);
		var fechaHastaParse = this.FechaHasta.substr(0,10);
		
		this.reservaRecurrenteService.executeReservaRecurrente(fechaDesdeParse, fechaHastaParse,
			this.HoraDesde, this.HoraHasta, this.mail, "2", frec_semanal,
			this.mail /*deberia ser el usuario administrador*/);
	}
  
	



}
