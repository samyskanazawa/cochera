package ar.com.stk.parking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import ar.com.stk.parking.controllers.ReservaSearchController;

/**
 * Clase encargada del arranque de la aplicación de Spring Boot.
 */
@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackageClasses = ReservaSearchController.class)
@EnableAutoConfiguration
public class StkParkingApp {
	public static void main(String[] args) {
		SpringApplication.run(StkParkingApp.class, args);
	}
}
