package ejecucion;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "tmpDispo", path = "tmpDispo")
public interface TmpDispoRepository extends MongoRepository<TmpDispo, String> {

	List<TmpDispo> findByMail(@Param("mail") String mail);

}