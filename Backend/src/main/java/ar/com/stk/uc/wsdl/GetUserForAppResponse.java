//
// Este archivo ha sido generado por la arquitectura JavaTM para la implantación de la referencia de enlace (JAXB) XML v2.2.11 
// Visite <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Todas las modificaciones realizadas en este archivo se perderán si se vuelve a compilar el esquema de origen. 
// Generado el: 2017.08.22 a las 01:10:17 PM ART 
//


package ar.com.stk.uc.wsdl;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Clase Java para getUserForAppResponse complex type.
 * 
 * <p>El siguiente fragmento de esquema especifica el contenido que se espera que haya en esta clase.
 * 
 * <pre>
 * &lt;complexType name="getUserForAppResponse"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="getUserForApp" type="{http://ws.uc.softtek.com/}userDto" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "getUserForAppResponse", propOrder = {
    "getUserForApp"
})
@XmlRootElement
public class GetUserForAppResponse {

    protected UserDto getUserForApp;

    /**
     * Obtiene el valor de la propiedad getUserForApp.
     * 
     * @return
     *     possible object is
     *     {@link UserDto }
     *     
     */
    public UserDto getGetUserForApp() {
        return getUserForApp;
    }

    /**
     * Define el valor de la propiedad getUserForApp.
     * 
     * @param value
     *     allowed object is
     *     {@link UserDto }
     *     
     */
    public void setGetUserForApp(UserDto value) {
        this.getUserForApp = value;
    }

}
