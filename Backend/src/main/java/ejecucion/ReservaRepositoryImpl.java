package ejecucion;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.scheduling.annotation.Scheduled;

public class ReservaRepositoryImpl implements ReservaRepositoryCustom{
	
	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date fecha = new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000L);
	
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

	@Override
	public List<Reserva> findByFechaRese(String fechaRese) {
		
		Date[] vectorFechas = DateUtils.getDates(fechaRese);
		
		Query query = new Query();
		query.addCriteria(Criteria
			.where("fechaRese").gte(vectorFechas[0]).lte(vectorFechas[1])
			);
		
		return mongoTemplate.find(query, clazz);
	}

	@Override
	public List<Reserva> findByFechaReseAndEstado(String fechaRese, String estado) {
		Date[] vectorFechas = DateUtils.getDates(fechaRese);
		
		Query query = new Query();
		query.addCriteria(Criteria
			.where("fechaRese").gte(vectorFechas[0]).lte(vectorFechas[1])
			.and("estado").ne(estado)
			);

		return mongoTemplate.find(query, clazz);
	}
	
	@Override
	@Scheduled(cron = "0 1 20 * * *")
	public void deleteAnterioresByFechaRese() {
		
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
		String fechaISO = df.format(fecha);
		System.out.println(fechaISO);
		
		Date[] vectorFechas = DateUtils.getDates(fechaISO);
		
		Query query = new Query();
		query.addCriteria(Criteria
			.where("fechaRese").lte(vectorFechas[1])
		);
		
		mongoTemplate.findAllAndRemove(query, clazz);
	}

}
