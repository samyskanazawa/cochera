//
// Este archivo ha sido generado por la arquitectura JavaTM para la implantación de la referencia de enlace (JAXB) XML v2.2.11 
// Visite <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Todas las modificaciones realizadas en este archivo se perderán si se vuelve a compilar el esquema de origen. 
// Generado el: 2017.08.22 a las 01:10:17 PM ART 
//


package ar.com.stk.uc.wsdl;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the ar.com.stk.uc.wsdl package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _GetRolesForApp_QNAME = new QName("http://ws.uc.softtek.com/", "getRolesForApp");
    private final static QName _GetRolesForAppResponse_QNAME = new QName("http://ws.uc.softtek.com/", "getRolesForAppResponse");
    private final static QName _GetUserForApp_QNAME = new QName("http://ws.uc.softtek.com/", "getUserForApp");
    private final static QName _GetUserForAppResponse_QNAME = new QName("http://ws.uc.softtek.com/", "getUserForAppResponse");
    private final static QName _GetUsersForApp_QNAME = new QName("http://ws.uc.softtek.com/", "getUsersForApp");
    private final static QName _GetUsersForAppResponse_QNAME = new QName("http://ws.uc.softtek.com/", "getUsersForAppResponse");
    private final static QName _RegisterApp_QNAME = new QName("http://ws.uc.softtek.com/", "registerApp");
    private final static QName _RegisterAppResponse_QNAME = new QName("http://ws.uc.softtek.com/", "registerAppResponse");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: ar.com.stk.uc.wsdl
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link GetRolesForApp }
     * 
     */
    public GetRolesForApp createGetRolesForApp() {
        return new GetRolesForApp();
    }

    /**
     * Create an instance of {@link GetRolesForAppResponse }
     * 
     */
    public GetRolesForAppResponse createGetRolesForAppResponse() {
        return new GetRolesForAppResponse();
    }

    /**
     * Create an instance of {@link GetUserForApp }
     * 
     */
    public GetUserForApp createGetUserForApp() {
        return new GetUserForApp();
    }

    /**
     * Create an instance of {@link GetUserForAppResponse }
     * 
     */
    public GetUserForAppResponse createGetUserForAppResponse() {
        return new GetUserForAppResponse();
    }

    /**
     * Create an instance of {@link GetUsersForApp }
     * 
     */
    public GetUsersForApp createGetUsersForApp() {
        return new GetUsersForApp();
    }

    /**
     * Create an instance of {@link GetUsersForAppResponse }
     * 
     */
    public GetUsersForAppResponse createGetUsersForAppResponse() {
        return new GetUsersForAppResponse();
    }

    /**
     * Create an instance of {@link RegisterApp }
     * 
     */
    public RegisterApp createRegisterApp() {
        return new RegisterApp();
    }

    /**
     * Create an instance of {@link RegisterAppResponse }
     * 
     */
    public RegisterAppResponse createRegisterAppResponse() {
        return new RegisterAppResponse();
    }

    /**
     * Create an instance of {@link UserDto }
     * 
     */
    public UserDto createUserDto() {
        return new UserDto();
    }

    /**
     * Create an instance of {@link RoleDto }
     * 
     */
    public RoleDto createRoleDto() {
        return new RoleDto();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetRolesForApp }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "getRolesForApp")
    public JAXBElement<GetRolesForApp> createGetRolesForApp(GetRolesForApp value) {
        return new JAXBElement<GetRolesForApp>(_GetRolesForApp_QNAME, GetRolesForApp.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetRolesForAppResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "getRolesForAppResponse")
    public JAXBElement<GetRolesForAppResponse> createGetRolesForAppResponse(GetRolesForAppResponse value) {
        return new JAXBElement<GetRolesForAppResponse>(_GetRolesForAppResponse_QNAME, GetRolesForAppResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetUserForApp }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "getUserForApp")
    public JAXBElement<GetUserForApp> createGetUserForApp(GetUserForApp value) {
        return new JAXBElement<GetUserForApp>(_GetUserForApp_QNAME, GetUserForApp.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetUserForAppResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "getUserForAppResponse")
    public JAXBElement<GetUserForAppResponse> createGetUserForAppResponse(GetUserForAppResponse value) {
        return new JAXBElement<GetUserForAppResponse>(_GetUserForAppResponse_QNAME, GetUserForAppResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetUsersForApp }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "getUsersForApp")
    public JAXBElement<GetUsersForApp> createGetUsersForApp(GetUsersForApp value) {
        return new JAXBElement<GetUsersForApp>(_GetUsersForApp_QNAME, GetUsersForApp.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetUsersForAppResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "getUsersForAppResponse")
    public JAXBElement<GetUsersForAppResponse> createGetUsersForAppResponse(GetUsersForAppResponse value) {
        return new JAXBElement<GetUsersForAppResponse>(_GetUsersForAppResponse_QNAME, GetUsersForAppResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link RegisterApp }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "registerApp")
    public JAXBElement<RegisterApp> createRegisterApp(RegisterApp value) {
        return new JAXBElement<RegisterApp>(_RegisterApp_QNAME, RegisterApp.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link RegisterAppResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.uc.softtek.com/", name = "registerAppResponse")
    public JAXBElement<RegisterAppResponse> createRegisterAppResponse(RegisterAppResponse value) {
        return new JAXBElement<RegisterAppResponse>(_RegisterAppResponse_QNAME, RegisterAppResponse.class, null, value);
    }

}
