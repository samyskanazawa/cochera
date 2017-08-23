package ar.com.stk.parking.repositories;

import java.lang.annotation.Annotation;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import ar.com.stk.parking.entities.Reserva;

/**
 * Extendida por ReservaRepositoryCustom dado que se requieren busquedas y
 * operaciones personalizadas no soportadas genericamente por Spring Boot.
 * 
 * TODO: Revisar el funcionamiento del annotation @Service.
 */
@Service
@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "reserva", path = "reserva")
public interface ReservaRepository extends MongoRepository<Reserva, String>, ReservaRepositoryCustom {

	List<Reserva> findByMail(@Param("mail") String mail);
}
