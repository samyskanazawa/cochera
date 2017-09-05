package ar.com.stk.parking.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import ar.com.stk.parking.entities.LogResRecurrente;
	
@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "logResRecurrente", path = "logResRecurrente")
public interface LogResRecurrenteRepository extends MongoRepository<LogResRecurrente, String>  {
	List<LogResRecurrente> findByMail(@Param("mail") String mail);

}
