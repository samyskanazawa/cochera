package ar.com.stk.parking.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import ar.com.stk.parking.entities.Reserva;
import ar.com.stk.parking.repositories.ReservaRepository;

/**
 * Controller para la busqueda de reserva. Spring boot requiere que al
 * utilizar un repository personalizado para la obtención de datos se defina el
 * controller explicitamente.
 */
@CrossOrigin
@RepositoryRestController
public class ReservaSearchController {

	@Autowired
	private ReservaRepository reservaRepository;

	@RequestMapping(value = "/reserva/search/findByQuery", method = RequestMethod.GET)
	public HttpEntity<List<Reserva>> findByQuery(String nombreCochera, String espacioCochera, String fechaRese,
			String estado) {

		List<Reserva> reserva = reservaRepository.findByQuery(nombreCochera, espacioCochera, fechaRese, estado);
		return new ResponseEntity<List<Reserva>>(reserva, HttpStatus.OK);
	}

	@RequestMapping(value = "/reserva/search/findByMailAndFechaRese", method = RequestMethod.GET)
	public HttpEntity<List<Reserva>> findByMailAndFechaRese(String mail, String fechaRese) {

		List<Reserva> reserva = reservaRepository.findByMailAndFechaRese(mail, fechaRese);
		return new ResponseEntity<List<Reserva>>(reserva, HttpStatus.OK);
	}

	@RequestMapping(value = "/reserva/search/findByFechaRese", method = RequestMethod.GET)
	public HttpEntity<List<Reserva>> findByFechaRese(String fechaRese) {

		List<Reserva> reserva = reservaRepository.findByFechaRese(fechaRese);
		return new ResponseEntity<List<Reserva>>(reserva, HttpStatus.OK);
	}

	@RequestMapping(value = "/reserva/search/findByFechaReseAndEstado", method = RequestMethod.GET)
	public HttpEntity<List<Reserva>> findByFechaReseAndEstado(String fechaRese, String estado) {

		List<Reserva> reserva = reservaRepository.findByFechaReseAndEstado(fechaRese, estado);
		return new ResponseEntity<List<Reserva>>(reserva, HttpStatus.OK);
	}
}