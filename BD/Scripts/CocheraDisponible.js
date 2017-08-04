/*
Funcion CocheraDisponible
Objetivo: devuelve LIBRE en caso de poder reservar el pedido
Parametros:
	fecha: fecha de reserva solicitada
	hora_desde: hora desde de reserva solicitada
	hora_hasta: hora hasta de reserva solicitada
	email: email del que solicita reservar
	nombre_cochera: nombre de la cochera que desea reservar
CocheraDisponible('2017-05-30', '16:00', '19:00', 'rodrigo.suarez@softtek.com', '01');	
*/
function CocheraDisponible(fecha, hora_desde, hora_hasta, email, nombre_cochera) {

var salida = 'LIBRE';
fecha = fecha.substring(0, 10);
var dia_inicio = fecha + 'T00:00:00.000Z';
var dia_fin = fecha + 'T23:59:59.999Z';
var is_pedido;
var is_duenio;
var v_espacio_cochera;
var v_cochera_ok = 0;
var v_email_ok = 0;
var v_reasigna;

var cursor = db.reserva.find({"nombreCochera": nombre_cochera, "fechaRese": {"$gte": ISODate(dia_inicio), "$lte": ISODate(dia_fin)}}).forEach( function(myDoc) { 
	if (salida != 'LIBRE'){
		return salida; 
	}
	if (hora_hasta <= myDoc.horaDesde || hora_desde >= myDoc.horaHasta){
		//print('Reserva existente no genera conflicto ' + myDoc.mail + ' / Fecha ' + myDoc.fechaRese.toISOString().substring(0, 10) + '. De ' + myDoc.horaDesde + ' a ' + myDoc.horaHasta + ' hs' + ' / Cochera ' + nombre_cochera);
	}
	else {
		salida = 'COCHERA NO DISPONIBLE';
	}
});

return salida;
}