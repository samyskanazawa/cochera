package ejecucion;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "cochera", path = "cochera")
public interface CocheraRepository extends MongoRepository<Cochera, String> {

	List<Cochera> findByNombre(@Param("nombre") String nombre);

}