package ejecucion;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "reserva", path = "reserva")
public interface ReservaRepository extends MongoRepository<Reserva, String>, ReservaRepositoryCustom {

	List<Reserva> findByMail(@Param("mail") String mail);
	List<Reserva> findByQuery(String nombreCochera, int espacioCochera, 
			String fechaRese, String estado);
}
