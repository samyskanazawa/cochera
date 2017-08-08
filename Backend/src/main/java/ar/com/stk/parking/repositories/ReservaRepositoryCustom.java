package ar.com.stk.parking.repositories;

import java.util.List;

import ar.com.stk.parking.entities.Reserva;

/**
 * Interface de los métodos personalizados para realizar operaciones no
 * soportadas genéricamente por Spring Boot.
 */
public interface ReservaRepositoryCustom {

	List<Reserva> findByQuery(String nombreCochera, String espacioCochera, String fechaRese, String estado);

	List<Reserva> findByMailAndFechaRese(String mail, String fechaRese);

	List<Reserva> findByFechaReseAndEstado(String fechaRese, String estado);

	List<Reserva> findByFechaRese(String fechaRese);

	void deleteAnterioresByFechaRese();
}
