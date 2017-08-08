package ar.com.stk.parking.controllers;

import java.util.Properties;

import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ar.com.stk.parking.dtos.LdapUserDto;

@Component
public class LdapComponent {
	
	private static Logger logger = LoggerFactory.getLogger(LdapComponent.class);
    
	@Transactional(readOnly=true)
	public LdapUserDto validateLdapUser(String username) {
			
			String ldapUrl = "ldaps://172.16.80.10:636";
			String ldapUserDn = "creador";
			String ldapPassword = "Softtek1010";
			String ldapBase = "ou=Argentina,ou=Usuarios";
			
			if ((ldapUrl != null) && !ldapUrl.isEmpty()) {
		        DirContext ctx = null;
		        LdapUserDto userDto = new LdapUserDto();
		        try {
		            logger.info("checking with ldap [username: " + username + ", password: ******, ldap: " + ldapUrl + "]");
		            
		            Properties env = new Properties();
		            env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
		            env.put(Context.PROVIDER_URL, ldapUrl);
		            env.put(Context.SECURITY_AUTHENTICATION, "simple");
		            env.put(Context.SECURITY_PRINCIPAL, ldapUserDn);
		            env.put(Context.SECURITY_CREDENTIALS, ldapPassword);
		            ctx = new InitialDirContext(env);
		            String base = ldapBase;
		            String[] attributeFilter = {
		                    "sAMAccountName",
		                    "distinguishedName",
		                    "displayName",
		            };//Seteo los parametros que necesito extraer el servidor LDAP		            
		            SearchControls sc = new SearchControls();
		            sc.setReturningAttributes(attributeFilter);
		            sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
		            String filter = "(" + "sAMAccountName" + "=" + username + ")";
		            NamingEnumeration<SearchResult> results = ctx.search(base, filter, sc);
		            if (results.hasMore()) {
		            	SearchResult searchResult = (SearchResult) results.next();
		            	Attributes atr = searchResult.getAttributes();
//		            	Obtengo los datos personales del nuevo usuario		            	
		            	String result = atr.toString();
		            	result = result.substring((result.indexOf(":")+2), result.indexOf(",")).trim();
		            	userDto.setFirstName(result.substring(0 ,result.indexOf(" ")));
		            	System.out.println();
		            	userDto.setLastName(result.substring((result.indexOf(" ")+1), result.length()));
		            	userDto.setUsername(username);
		            	System.out.println(result);
						logger.trace(":::::::::: LDAP Autenticated ::::::::::");
						return userDto;
					}
		            else{
						logger.trace(":::::::::: LDAP NOT Autenticated ::::::::::");
						return null;
		            }
		} catch (Exception e) {
			logger.error(":::::::::: LDAP NOT Autenticated ::::::::::");
			logger.error("Error in UserServiceImpl.autenticateLdapUser: " + e.getMessage());
			//para el caso de que el usuario este mal creado en el ldap.. que lo deje loguear o crear si dto.username=login.username
			//return userdto o null
			if (userDto.getUsername().equals(username)){
				return userDto;
			}else
					return null;
		}
		        finally {
		            if (ctx != null) {
		                try {
		                    ctx.close();
		                } catch (NamingException e) {
		                	logger.error(":::::::::: LDAP NOT Autenticated ::::::::::");
		                	logger.error("Checking with ldap - ldap error: ", e.getMessage());
		                }
		            }
		        }
		        
		    } else {
		    	logger.trace(":::::::::: LDAP NOT Autenticated ::::::::::");
		    	return null;
		    }
	}
	
	@Transactional(readOnly=true)
	public boolean validateLdapUser(String username, String password) {
		boolean ok = false;
		

		String ldapUrl = "ldaps://172.16.80.10:636";
		String ldapUserDn = "creador";
		String ldapPassword = "Softtek1010";
		String ldapBase = "ou=Argentina,ou=Usuarios,dc=softtek,dc=com";
		
		if ((ldapUrl != null) && !ldapUrl.isEmpty()) {
	        DirContext ctx = null;
	        try {
	            logger.info("checking with ldap [username: " + username + ", password: ******, ldap: " + ldapUrl + "]");
	            Properties env = new Properties();
	            env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
	            env.put(Context.PROVIDER_URL, ldapUrl);
	            env.put(Context.SECURITY_AUTHENTICATION, "simple");
	            env.put(Context.SECURITY_PRINCIPAL, ldapUserDn);
	            env.put(Context.SECURITY_CREDENTIALS, ldapPassword);
	            ctx = new InitialDirContext(env);
	            String base = ldapBase;
	            String[] attributeFilter = {
	                    "sAMAccountName",
	                    "distinguishedName",
	            };
	            SearchControls sc = new SearchControls();
	            sc.setReturningAttributes(attributeFilter);
	            sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
	            String filter = "(" + "sAMAccountName" + "=" + username + ")";
	            NamingEnumeration<SearchResult> results = ctx.search(base, filter, sc);
	            if (results.hasMore()) {
	                Properties env1 = new Properties();
	                env1.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
	                env1.put(Context.PROVIDER_URL, ldapUrl);
	                SearchResult result = (SearchResult) results.next();
	                Attributes attrs = result.getAttributes();
	                Attribute dnAttr = attrs.get("distinguishedName");
	                String dn = (String) dnAttr.get();
	                env1.put(Context.SECURITY_PRINCIPAL, dn);
	                env1.put(Context.SECURITY_CREDENTIALS, password);
	                new InitialDirContext(env1); // in case of problem exception will be threw
	                logger.trace(":::::::::: LDAP Autenticated ::::::::::");
	                ok = true;
	            } else {
	            	logger.trace(":::::::::: LDAP NOT Autenticated ::::::::::");
	            }
	        } catch (Exception e) {
	        	logger.error(":::::::::: LDAP NOT Autenticated ::::::::::");
	            logger.error("Checking with ldap - ldap error: ", e.getMessage());
	        } finally {
	            if (ctx != null) {
	                try {
	                    ctx.close();
	                } catch (NamingException e) {
	                	logger.error(":::::::::: LDAP NOT Autenticated ::::::::::");
	                	logger.error("Checking with ldap - ldap error: ", e.getMessage());
	                }
	            }
	        }
	    } else {
	    	logger.trace(":::::::::: LDAP NOT Autenticated ::::::::::");
		}

		return ok;
	}
}
