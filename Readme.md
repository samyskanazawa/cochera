**Stk Parking**
===============


### **Motivación**


**Stk Parking** surge a partir de la necesidad de tener una aplicación que permita administrar de manera rápida y ágil las cocheras che posee actualmente Sofftek.
para ello se decidió hacer una aplicación mobile hibrida que permita ver el estado actual de las cocheras, con las siguientes funcionalidades:

+ Consultar el estado Actual de la disponibilidad de las cocheras 
+ Reservar un espacio en la cochera en un horario determinado.
+ Ocupar un espacio de la cochera 
+ Liberar un espacio de la cochera 
+ Reservar cochera en una fecha futura
+ Comunicarse con un usuario que tiene reserva.

### **Entorno de Desarrollo**

   
+ Base de Datos: **MongoDB**
+ Backend: **Java 1.8, Spring Boot**
+ FrontEnd: **Ionic 2**

### **Integrantes**

+ Ariel Szocki
+ Ariel Pinto
+ Dario Cohen
+ Julian Alessandrini
+ Leandro Fragala
+ Maximiliano Mussetto
+ Pablo Garcia
+ Pablo Sartorio Mechoso
+ Pablo Torres Nimo


### **Diseño de solución**

El proyecto está desarrollado con Ionic Framework y Angular, ambos versión 2 (FrontEnd) y Spring Boot (en Java, BackEnd). 
Se consumen los servicios de tipo rest.
El repositorio se divide principalmente en BackEnd (pojos, controllers e interfaces llamadas repositorys) y FrontEnd (pages).

Respecto a la base de datos, se definieron las siguientes colecciones principales: Usuario, Cocheras, y Reservas.
En la presente versión, se utilizan funciones personalizadas de MongoDb para la gestión de reservas recurrentes y de los maestros de usuarios y cocheras.


### **Deploy a Producción**

Respecto a la base de datos, se deben actualizar las colecciones Cocheras y Usuarios, usando el contenido de los archivos de mismos nombres ubicados en la carpeta BD del repositorio.
Asimismo, se deberán crear las siguientes funciones personalizadas (functions de MongoDb). Las mismas se obtienen desde la carpeta BD/Scripts del repositorio.
+ AsignarTercero
+ CocheraDisponible
+ DiaDelAnio
+ ReservarEliminarRecurrente
+ cocheras
+ usuarios

