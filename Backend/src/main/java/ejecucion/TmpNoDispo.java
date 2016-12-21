package ejecucion;

import org.springframework.data.annotation.Id;

public class TmpNoDispo {


	private String mail;
	private String nombreCochera;
	private int espacioCochera;
	private String fechaDispo;
	private String horaDesde;
	private String horaHasta;
	private int horasDispo;
	private int telefono;
	
	@Id
	private String id;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
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

	public String getFechaDispo() {
		return fechaDispo;
	}

	public void setFechaDispo(String fechaDispo) {
		this.fechaDispo = fechaDispo;
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

	public int getHorasDispo() {
		return horasDispo;
	}

	public void setHorasDispo(int horasDispo) {
		this.horasDispo = horasDispo;
	}

	public int getTelefono() {
		return telefono;
	}

	public void setTelefono(int telefono) {
		this.telefono = telefono;
	}
}