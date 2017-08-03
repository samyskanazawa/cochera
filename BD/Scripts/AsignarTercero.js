/*
funcion AsignarTercero
Objetivo: Reserva para un usuario la primer cochera que encuentra libre segun peso 
Param: v_fecha, hora_desde, hora_hasta, email, cochera_duenio
	Si el param cochera_duenio es vacio, se usa para asignar a tercero por primera vez
	usuario_alta
AsignarTercero('2017-05-30', '16:00', '19:00', 'javier.porretti@softtek.com', '02', 'secretaria@softtek.com');
*/
function AsignarTercero(v_fecha, hora_desde, hora_hasta, email, cochera_duenio, usuario_alta) {

var v_fecha_desde= new Date(v_fecha);
var v_item;
var v_cochera_disponible;
var v_resultado = 'SINASIGNACION';
var v_fecha_alta = new ISODate();

//Recorre todas (asigna a tercero) o excluye la del duenio (reasignacion del tercero por eliminacion del duenio)
if (cochera_duenio == '')
	var v_items = db.cochera.find().sort({ peso: 1 });
else
	var v_items = db.cochera.find({ nombre: { $ne: cochera_duenio } }).sort({ peso: 1 });

//print ('Reasignar - Evaluando reservar para fecha: ' + v_fecha_desde.toISOString().substring(0, 10));
while((v_items.hasNext()) && (v_resultado != 'ASIGNADA') ) {
    v_item = v_items.next();
	
	v_cochera_disponible = CocheraDisponible(v_fecha_desde.toISOString(), hora_desde, hora_hasta, email, v_item.nombre);
	
	if (v_cochera_disponible == 'LIBRE') {
		//insertar reserva de tercero
		db.reserva.insert({mail : email
				, _class : "ejecucion.Reserva"
				, nombreCochera : v_item.nombre
				, espacioCochera : v_item.espacio
				, fechaRese : new ISODate(v_fecha_desde.toISOString().substring(0, 10) + 'T12:00:00.000Z')
				, horaDesde : hora_desde 
				, horaHasta : hora_hasta
				, estado: "Reservado"
				, horaDesdeSort: hora_desde.replace(':', '')
				, FechaAlta : v_fecha_alta
				, usuarioAlta: usuario_alta
				});
		v_resultado = 'ASIGNADA';
		if (cochera_duenio == '') {
			print('Reserva realizada exitosamente: Usuario ' + email + ' / Fecha ' + v_fecha_desde.toISOString().substring(0, 10) + ', de ' + hora_desde 
				+ ' a ' + hora_hasta + ' hs' + ' / Cochera ' + v_item.nombre + ' (' + v_item.espacio.split(" -")[0] + ')');
		} else {
			print('Reserva reasignada: Usuario ' + email + ' / Fecha ' + v_fecha_desde.toISOString().substring(0, 10) + ', de ' + hora_desde 
				+ ' a ' + hora_hasta + ' hs' + ' / Cochera ' + v_item.nombre + ' (' + v_item.espacio.split(" -")[0] + ')');
		}
	}
}

if (v_resultado == 'SINASIGNACION')
	if (cochera_duenio == '')
		print('No se encontro cochera libre para realizar la reserva. Fecha ' + v_fecha_desde.toISOString().substring(0, 10) + ', de ' + hora_desde + ' a ' + hora_hasta + ' hs');
	else
		print('Reserva ocupada por el dueño de la cochera, no se encontro cochera libre para reasignar. Usuario ' + email + ' / Fecha ' + v_fecha_desde.toISOString().substring(0, 10) + ', de ' + hora_desde + ' a ' + hora_hasta + ' hs' + ' / Cochera ' + cochera_duenio); 

return v_resultado;

}