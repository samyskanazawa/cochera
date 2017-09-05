package ar.com.stk.parking.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ar.com.stk.parking.UserCenterClient;
import ar.com.stk.uc.wsdl.GetUserForAppResponse;

@RestController
public class LoginController {

	@Autowired
	private UserCenterClient ucClient;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public Boolean login(@RequestParam(value = "username") String username,
			@RequestParam(value = "password") String password) {
		GetUserForAppResponse userForApp = null; 
		try {
			userForApp = ucClient.getUserForApp(username, password);
		} catch (Exception e) {
			return Boolean.FALSE;
		}
		if (userForApp != null) {
			if (userForApp.getGetUserForApp() != null) {
				return Boolean.TRUE;
			} 
		}
		return Boolean.FALSE;
	}
}
