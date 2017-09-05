package ar.com.stk.parking.entities;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

public class Reserva {

	@Id private String id;
	
	private String mail;
	private String nombreCochera;
	private String espacioCochera;
	
	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date fechaRese;
	
	private String horaDesde;
	private String horaHasta;
	
	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date fechaAlta;
	
	private String estado;
	
	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date fechaOcupa;
	
	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date fechaLibre;
	
	private String horaDesdeSort;
	
	public String getMail() {
		return mail;
	}
	
	public void setMail(String mail) {
		this.mail = mail;
	}
	
	public String getNombre() {
		return nombreCochera;
	}
	
	public void setNombre(String nombre) {
		this.nombreCochera = nombre;
	}
	
	public String getEspacio() {
		return espacioCochera;
	}
	
	public void setEspacio(String espacio) {
		this.espacioCochera = espacio;
	}
	
	public Date getFechaRese() {
		return fechaRese;
	}
	
	public void setFechaRese(Date fechaRese) {
		this.fechaRese = fechaRese;
	}
	
	public String getHoraDesde() {
		return horaDesde;
	}
	
	public void setHoraDesde(String horaDesde) {
		this.horaDesde = horaDesde;
	}
	
	public String getHoraHasta() {
		return horaHasta;
	}
	
	public void setHoraHasta(String horaHasta) {
		this.horaHasta = horaHasta;
	}
	
	public Date getFechaAlta() {
		return fechaAlta;
	}
	
	public void setFechaAlta(Date fechaAlta) {
		this.fechaAlta = fechaAlta;
	}
	
	public String getEstado() {
		return estado;
	}
	
	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	public Date getFechaOcupa() {
		return fechaOcupa;
	}
	
	public void setFechaOcupa(Date fechaOcupa) {
		this.fechaOcupa = fechaOcupa;
	}
	
	public Date getFechaLibre() {
		return fechaLibre;
	}
	
	public void setFechaLibre(Date fechaLibre) {
		this.fechaLibre = fechaLibre;
	}
	
	public String getHoraDesdeSort() {
		return horaDesdeSort;
	}
	
	public void setHoraDesdeSort(String horaDesdeSort) {
		this.horaDesdeSort = horaDesdeSort;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNombreCochera() {
		return nombreCochera;
	}

	public void setNombreCochera(String nombreCochera) {
		this.nombreCochera = nombreCochera;
	}

	public String getEspacioCochera() {
		return espacioCochera;
	}

	public void setEspacioCochera(String espacioCochera) {
		this.espacioCochera = espacioCochera;
	}
}
