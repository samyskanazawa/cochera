package ar.com.stk.parking;

import javax.xml.bind.JAXBElement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import ar.com.stk.uc.wsdl.GetUserForApp;
import ar.com.stk.uc.wsdl.GetUserForAppResponse;

public class UserCenterClient extends WebServiceGatewaySupport {

	private static final Logger log = LoggerFactory.getLogger(UserCenterClient.class);

	public GetUserForAppResponse getUserForApp(String username, String password) {

		GetUserForApp request = new GetUserForApp();

		request.setUsername(username);
		request.setPassword(password);
		request.setAppname("CO");

		GetUserForAppResponse response = (GetUserForAppResponse)((JAXBElement) getWebServiceTemplate().marshalSendAndReceive(
				"http://192.153.155.18:8080/uc/ws/UserCenterWS", request,
				new SoapActionCallback(""))).getValue();

		return response;
	}

}