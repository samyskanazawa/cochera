package ejecucion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

public class ReservaRepositoryImpl implements ReservaRepositoryCustom{

	@Autowired
	private MongoTemplate mongoTemplate;
	private Class<Reserva> clazz = Reserva.class;

	@Override
	public List<Reserva> findByQuery(String nombreCochera, Integer espacioCochera, String fechaRese, String estado) {
		Query query = new Query();
		query.addCriteria(Criteria
			.where("nombreCochera").is(nombreCochera)
			.and("espacioCochera").is(String.valueOf(espacioCochera))
			.and("fechaRese").is(fechaRese)
			.and("estado").ne(estado)
			);
				
		
		return mongoTemplate.find(query, clazz);
	}

}
