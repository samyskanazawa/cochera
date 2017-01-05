package ejecucion;

import java.util.List;

public interface ReservaRepositoryCustom {
	  
	  List<Reserva> 
	    findByQuery(String nombreCochera, String espacioCochera, 
				String fechaRese, String estado);
	  
	  
	  List<Reserva> findByMailAndFechaRese(String mail, String fechaRese);
	}

