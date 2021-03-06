package ar.com.stk.parking.repositories.impl;

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

import ar.com.stk.parking.entities.Reserva;
import ar.com.stk.parking.repositories.ReservaRepositoryCustom;
import ar.com.stk.parking.utils.DateUtils;

/**
 * Implementación de los métodos personalizados para acceder al repositorio de
 * reservas.
 */
public class ReservaRepositoryImpl implements ReservaRepositoryCustom {

	@DateTimeFormat(iso = ISO.DATE_TIME)
	private Date fecha = new Date();

	@Autowired
	private MongoTemplate mongoTemplate;
	private Class<Reserva> clazz = Reserva.class;

	@Override
	public List<Reserva> findByQuery(String nombreCochera, String espacioCochera, String fechaRese, String estado) {

		Date[] vectorFechas = DateUtils.getDates(fechaRese);

		Query query = new Query();
		query.addCriteria(Criteria.where("nombreCochera").is(nombreCochera).and("espacioCochera").is(espacioCochera)
				.and("fechaRese").gte(vectorFechas[0]).lte(vectorFechas[1]).and("estado").ne(estado));

		return mongoTemplate.find(query, clazz);
	}

	@Override
	public List<Reserva> findByMailAndFechaRese(String mail, String fechaRese) {
		Query query = new Query();
		query.addCriteria(Criteria.where("mail").is(mail).and("fechaRese").gte(DateUtils.getDate(fechaRese)));

		return mongoTemplate.find(query, clazz);
	}

	@Override
	public List<Reserva> findByFechaRese(String fechaRese) {

		Date[] vectorFechas = DateUtils.getDates(fechaRese);

		Query query = new Query();
		query.addCriteria(Criteria.where("fechaRese").gte(vectorFechas[0]).lte(vectorFechas[1]));

		return mongoTemplate.find(query, clazz);
	}

	@Override
	public List<Reserva> findByFechaReseAndEstado(String fechaRese, String estado) {
		Date[] vectorFechas = DateUtils.getDates(fechaRese);

		Query query = new Query();
		query.addCriteria(
				Criteria.where("fechaRese").gte(vectorFechas[0]).lte(vectorFechas[1]).and("estado").ne(estado));

		return mongoTemplate.find(query, clazz);
	}

	@Override
	@Scheduled(cron = "0 0 23 * * *")
	public void deleteAnterioresByFechaRese() {

		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
		String fechaISO = df.format(fecha);
		System.out.println(fechaISO);

		Date[] vectorFechas = DateUtils.getDates(fechaISO);

		Query query = new Query();
		query.addCriteria(Criteria.where("fechaRese").lte(vectorFechas[1]));

		mongoTemplate.findAllAndRemove(query, clazz);
	}

}
