package ar.com.stk.parking.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import ar.com.stk.parking.entities.Cochera;

/**
 * Repository implementado genericamente por spring boot
 */
@RepositoryRestResource(collectionResourceRel = "cochera", path = "cochera")
public interface CocheraRepository extends MongoRepository<Cochera, String> {

	List<Cochera> findByNombre(@Param("nombre") String nombre);

}