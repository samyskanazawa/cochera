package ejecucion;

import java.util.List;

public interface ReservaRepositoryCustom {
	  
	  List<Reserva> 
	    findByQuery(String nombreCochera, Integer espacioCochera, 
				String fechaRese);
	}

