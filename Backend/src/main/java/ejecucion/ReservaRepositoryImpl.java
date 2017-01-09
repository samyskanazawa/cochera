package ejecucion;

import java.util.Date;
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
	public List<Reserva> findByQuery(String nombreCochera, String espacioCochera, String fechaRese, String estado) {
		
		Date[] vectorFechas = DateUtils.getDates(fechaRese);
		
		Query query = new Query();
		query.addCriteria(Criteria
			.where("nombreCochera").is(nombreCochera)
			.and("espacioCochera").is(espacioCochera)
			.and("fechaRese").gte(vectorFechas[0]).lte(vectorFechas[1])
			.and("estado").ne(estado)
			);

		return mongoTemplate.find(query, clazz);
	}

	@Override
	public List<Reserva> findByMailAndFechaRese(String mail, String fechaRese) {
			Query query = new Query();
			query.addCriteria(Criteria
				.where("mail").is(mail)
				.and("fechaRese").gte(DateUtils.getDate(fechaRese))
				);
			
			return mongoTemplate.find(query, clazz);
	}

}
