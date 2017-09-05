package ar.com.stk.parking.entities;

import org.springframework.data.annotation.Id;

public class LogResRecurrente {
	@Id
	private String id;
	private String mail;
	private String mensaje;

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

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}

}
