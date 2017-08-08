package ar.com.stk.parking.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import ar.com.stk.parking.entities.Usuario;

/**
 * Repository implementado genericamente por spring boot.
 */
@RepositoryRestResource(collectionResourceRel = "usuario", path = "usuario")
public interface UsuarioRepository extends MongoRepository<Usuario, String> {

	List<Usuario> findByNombre(@Param("nombre") String nombre);
	List<Usuario> findByMail(@Param("mail") String mail);

}
