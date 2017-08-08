package ar.com.stk.parking.conf;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import ar.com.stk.parking.entities.Usuario;


/**
 * TODO: Revisar el por qué de esta clase.
 */
@Configuration
public class StkParkingRepositoryConfigurerAdapter extends RepositoryRestConfigurerAdapter {
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		config.exposeIdsFor(Usuario.class);
	}
}
