/*
funcion ReservarEliminarRecurrente
Objetivo: Reservar o eliminar de forma recurrente para frecuencia diaria o semanal
Param: fecha_desde, fecha_hasta, hora_desde, hora_hasta, email
	operacion: 1=ingresar, 2=borrar
	frec_semanal: string que contiene los indices de dias de la semana. Ej "135" indica lunes, miercoles y viernes
	usuario_alta
Si param fecha_hasta es vacio se asume que desea reservar o eliminar solo en dicho dia: se setea mismo valor de fecha_desde	
ReservarEliminarRecurrente('2017-05-30', '2017-06-07', '16:00', '19:00', 'javier.porretti@softtek.com', 1, '135', 'secretaria@softtek.com');
*/
function ReservarEliminarRecurrente(fecha_desde, fecha_hasta, hora_desde, hora_hasta, email, operacion, frec_semanal, usuario_alta) {

if (fecha_hasta=='')
	fecha_hasta = fecha_desde;

fecha_desde = fecha_desde.replace(new RegExp('-', 'g'), '/');
fecha_hasta = fecha_hasta.replace(new RegExp('-', 'g'), '/');

var v_fecha_desde= new Date(fecha_desde);
var v_fecha_hasta= new Date(fecha_hasta);
var v_fecha_alta = new ISODate();
var dia_inicio = '';
var dia_fin = '';
var v_cochera='';
var v_is_usuario;
var v_cochera_duenio;
var v_espacio_cochera;
var v_es_duenio = false;

var v_cochera_disponible;

var v_cochera_ok = 0;
var v_email_ok = 0;
var v_dia_semana;
var v_evaluar_dia = true;



var usuario_pedido = db.usuario.findOne({'mail' : email});
if (usuario_pedido) {
	v_is_usuario = usuario_pedido.IS;
	v_email_ok = 1;
}
else {
	print('Error 001: No se encontro email ingresado, favor de revisar');
}
if (v_email_ok == 0) 
	return;
	
var cursor = db.cochera.find().forEach( function(myDoc) {
	if (v_is_usuario == myDoc.espacio.split("- ")[1]){
		v_cochera_duenio = myDoc.nombre;
		v_espacio_cochera = myDoc.espacio;
	}	
});

if (v_cochera_duenio)
	v_es_duenio = true;

var inicio = DiaDelAnio(v_fecha_desde);
var fin = DiaDelAnio(v_fecha_hasta);

if (operacion==1){ //Alta de reserva recurrente
	//1.1. o 2.1. Eliminar sus reservas en el rango de fechas sin importar las hs
	dia_inicio = v_fecha_desde.toISOString().substring(0, 10) + 'T00:00:00.000Z';
	dia_fin = v_fecha_hasta.toISOString().substring(0, 10) + 'T23:59:59.999Z';
	db.reserva.remove({mail: email
					, "fechaRese": {"$gte": ISODate(dia_inicio), "$lte": ISODate(dia_fin)}
					});
	
	for (i = inicio; i <= fin; i=i+1){ 
		v_evaluar_dia = true;//valor default para evaluar todos los dias de la semana
		//v_cochera_disponible = '';
		v_dia_semana = v_fecha_desde.getDay();
		//evaluara siempre excluyendo fines de semana
		if (v_dia_semana > 0 && v_dia_semana < 6) {
			//si es reserva semanal evalua si el dia pertenece a la frec semanal solicitada
			//si el dia no corresponde a la frec semanal no evalua la reserva
			if (frec_semanal != '' && frec_semanal.search(v_dia_semana) == -1){
				v_evaluar_dia=false;
			}
			if (v_evaluar_dia) {
				//print('Evaluando reservar para fecha: ' + v_fecha_desde.toISOString().substring(0, 10));
				dia_inicio = v_fecha_desde.toISOString().substring(0, 10) + 'T00:00:00.000Z';
				dia_fin = v_fecha_desde.toISOString().substring(0, 10) + 'T23:59:59.999Z';
				if (v_es_duenio){
					var cursor = db.reserva.find({"nombreCochera": v_cochera_duenio, "fechaRese": {"$gte": ISODate(dia_inicio), "$lte": ISODate(dia_fin)}}).forEach( function(myDoc) { 
						if (hora_hasta <= myDoc.horaDesde || hora_desde >= myDoc.horaHasta){
							//print('Reserva existente no genera conflicto ' + myDoc.mail + ' / Fecha ' + myDoc.fechaRese.toISOString().substring(0, 10) + '. De ' + myDoc.horaDesde + ' a ' + myDoc.horaHasta + ' hs' + ' / Cochera ' + cochera_duenio);
						}
						else {
							//Deberian ser de terceros porque el 1er paso fue eliminar las del duenio sin tener en cuenta las hs
							//1.2. Reasigna reserva de tercero buscando 1ra cochera libre de menor peso excluyendo la del duenio
							AsignarTercero(v_fecha_desde.toISOString().substring(0, 10), myDoc.horaDesde, myDoc.horaHasta, myDoc.mail, v_cochera_duenio, usuario_alta);
							//1.3. Eliminar reserva de tercero
							db.reserva.remove({'_id': myDoc._id});
						}
					});
					db.reserva.insert({mail : email
							, _class : "ejecucion.Reserva"
							, nombreCochera : v_cochera_duenio
							, espacioCochera : v_espacio_cochera
							//, fechaRese : new ISODate(v_fecha_desde.toISOString())
							, fechaRese : new ISODate(v_fecha_desde.toISOString().substring(0, 10) + 'T12:00:00.000Z')
							, horaDesde : hora_desde 
							, horaHasta : hora_hasta
							, estado: "Reservado"
							, horaDesdeSort: hora_desde.replace(':', '')
							, FechaAlta : v_fecha_alta
							, usuarioAlta: usuario_alta
							});
					//insertar reserva del duenio
					print('Reserva realizada exitosamente: Usuario ' + email + ' / Fecha ' + v_fecha_desde.toISOString().substring(0, 10) + ', de ' + hora_desde 
						+ ' a ' + hora_hasta + ' hs' + ' / Cochera ' + v_cochera_duenio + ' (' + v_espacio_cochera.split(" -")[0] + ')');
				}
				else {
					//RESERVA DE TERCERO
					AsignarTercero(v_fecha_desde.toISOString().substring(0, 10), hora_desde, hora_hasta, email, '', usuario_alta);
				}
			}
		} else 
			print('FINDE: ' + v_fecha_desde.toISOString().substring(0, 10));
			
		v_fecha_desde.setDate(v_fecha_desde.getDate() + 1); 
	}
} else if (operacion==2){ //Eliminar reserva recurrentem 

		if (frec_semanal == ''){
			//Frec diaria: eliminar las reservas del usuario en el rango de fechas solicitado
			var dia_inicio = v_fecha_desde.toISOString().substring(0, 10) + 'T00:00:00.000Z';
			var dia_fin = v_fecha_hasta.toISOString().substring(0, 10) + 'T23:59:59.999Z';
			print('Eliminando las reservas del usuario para el período ' + dia_inicio.substring(0, 10) + ' a ' + dia_fin.substring(0, 10));
			db.reserva.remove({mail: email
				, "fechaRese": {"$gte": ISODate(dia_inicio), "$lte": ISODate(dia_fin)}
				});
		}
		else {
			//Frec semanal: eliminar reservas por dia en el rango solicitado cuando el dia se incluya en la frec semanal solicitada
			for (i = inicio; i <= fin; i=i+1){ 
				v_dia_semana = v_fecha_desde.getDay();
				if (frec_semanal.search(v_dia_semana) != -1){
					print('Eliminando reservas del usuario para fecha: ' + v_fecha_desde.toISOString().substring(0, 10));
					var dia_inicio = v_fecha_desde.toISOString().substring(0, 10) + 'T00:00:00.000Z';
					var dia_fin = v_fecha_desde.toISOString().substring(0, 10) + 'T23:59:59.999Z';
					db.reserva.remove({mail: email
						, "fechaRese": {"$gte": ISODate(dia_inicio), "$lte": ISODate(dia_fin)}
						});
				}
				v_fecha_desde.setDate(v_fecha_desde.getDate() + 1); 
			}
		}
	}
}