package ejecucion;

import java.util.List;

public interface ReservaRepositoryCustom {
	  
	  List<Reserva> 
	    findByQuery(String nombreCochera, int espacioCochera, 
				String fechaRese, String estado);
	}

