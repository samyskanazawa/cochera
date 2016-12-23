package ejecucion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RepositoryRestController
public class ReservaSearchController {

	@Autowired
	private ReservaRepository reservaRepository;
    
	  @RequestMapping(value = "/reserva/search/findByQuery", method = RequestMethod.GET)
	    public HttpEntity<List<Reserva>> findByQuery(String nombreCochera, Integer espacioCochera, String fechaRese) {

		  	List<Reserva> reserva = reservaRepository.findByQuery(nombreCochera, espacioCochera, fechaRese);
	        return new ResponseEntity<List<Reserva>>(reserva, HttpStatus.OK);
	    }
}
