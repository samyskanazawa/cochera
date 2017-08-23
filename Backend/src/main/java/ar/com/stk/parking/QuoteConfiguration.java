package ar.com.stk.parking;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;


/**
 * TODO: Revisar el por qué de esta clase.
 */
@Configuration
public class QuoteConfiguration {

	

	@Bean
	public Jaxb2Marshaller marshaller() {
		Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
		// this package must match the package in the <generatePackage> specified in
		// pom.xml
		marshaller.setContextPath("ar.com.stk.uc.wsdl");
		return marshaller;
	}

	@Bean
	public UserCenterClient userCenterClient(Jaxb2Marshaller marshaller) {
		UserCenterClient client = new UserCenterClient();
		client.setDefaultUri("http://192.153.155.18:8080/uc/ws/UserCenterWS");
		client.setMarshaller(marshaller);
		client.setUnmarshaller(marshaller);
		return client;
	}
}
