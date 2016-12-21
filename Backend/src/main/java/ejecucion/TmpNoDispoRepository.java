package ejecucion;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "tmpNoDispo", path = "tmpNoDispo")
public interface TmpNoDispoRepository extends MongoRepository<TmpNoDispo, String> {

	List<TmpNoDispo> findByMail(@Param("mail") String mail);

}