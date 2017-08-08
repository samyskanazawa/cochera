package ar.com.stk.parking.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
    
	@Autowired
	private LdapComponent ldapComponent;
	
	@CrossOrigin
	@RequestMapping(value = "/login", method = RequestMethod.GET)
    public Boolean greeting(@RequestParam(value="username") String username, @RequestParam(value="password") String password) {
        return ldapComponent.validateLdapUser(username, password);
    }
}
