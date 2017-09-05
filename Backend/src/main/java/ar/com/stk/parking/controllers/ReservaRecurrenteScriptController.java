package ar.com.stk.parking.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.ScriptOperations;
import org.springframework.data.mongodb.core.script.ExecutableMongoScript;
import org.springframework.data.mongodb.core.script.NamedMongoScript;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import ar.com.stk.parking.entities.LogResRecurrente;
import ar.com.stk.parking.repositories.LogResRecurrenteRepository;

@CrossOrigin
@RepositoryRestController
public class ReservaRecurrenteScriptController {

	@Autowired
	private MongoTemplate mongoTemplate;

	@Autowired
	private LogResRecurrenteRepository repository;

	@RequestMapping(value = "/reserva/execute/ReservarEliminarRecurrente", method = RequestMethod.GET)
	public HttpEntity<List<LogResRecurrente>> findByFechaRese(String fecha_desde, String fecha_hasta,
			String hora_desde, String hora_hasta, String email, String operacion, String frec_semanal,
			String usuario_alta) {

		ScriptOperations scriptOps = mongoTemplate.scriptOps();

		// Execute script directly
		scriptOps.call("ReservarEliminarRecurrente", fecha_desde, fecha_hasta, hora_desde, hora_hasta, email, operacion,
				frec_semanal, usuario_alta);

		List<LogResRecurrente> reserva = repository.findByMail(email);
		return new ResponseEntity<List<LogResRecurrente>>(reserva, HttpStatus.OK);
	}

	public MongoTemplate getMongoTemplate() {
		return mongoTemplate;
	}

	public void setMongoTemplate(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

}
