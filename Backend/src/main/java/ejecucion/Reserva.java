package ejecucion;

import org.springframework.data.annotation.Id;

public class Reserva {

	@Id private String id;
	
	private String mail;
	private String nombreCochera;
	private int espacioCochera;
	private String fechaRese;
	private String horaDesde;
	private String horaHasta;
	private String fechaAlta;
	private String estado;
	private String fechaOcupa;
	private String fechaLibre;
	private int horaDesdeSort;
	
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
	
	public int getEspacio() {
		return espacioCochera;
	}
	
	public void setEspacio(int espacio) {
		this.espacioCochera = espacio;
	}
	
	public String getFechaRese() {
		return fechaRese;
	}
	
	public void setFechaRese(String fechaRese) {
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
	
	public String getFechaAlta() {
		return fechaAlta;
	}
	
	public void setFechaAlta(String fechaAlta) {
		this.fechaAlta = fechaAlta;
	}
	
	public String getEstado() {
		return estado;
	}
	
	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	public String getFechaOcupa() {
		return fechaOcupa;
	}
	
	public void setFechaOcupa(String fechaOcupa) {
		this.fechaOcupa = fechaOcupa;
	}
	
	public String getFechaLibre() {
		return fechaLibre;
	}
	
	public void setFechaLibre(String fechaLibre) {
		this.fechaLibre = fechaLibre;
	}
	
	public int getHoraDesdeSort() {
		return horaDesdeSort;
	}
	
	public void setHoraDesdeSort(int horaDesdeSort) {
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

	public int getEspacioCochera() {
		return espacioCochera;
	}

	public void setEspacioCochera(int espacioCochera) {
		this.espacioCochera = espacioCochera;
	}
}
