//var	allUsuariosArray;
//var	v_telefono;
var v_mail;
var v_items;
var v_item;
var v_nombre;
var v_espacio;
var v_fecha_desde;
var v_fecha_hasta;
var v_fecha_desde_hora;
var v_fecha_hasta_hora;
var allreservasArray;
var z;
var v_array;
var v_Dispo;
var horadesde;
var fecha_horadesde_libre;
var fecha_horafin_libre;
var v_fecha_d;

v_mail = "julian.alessandrini@softtek.com";
v_fecha_desde = new Date("2016-12-24T00:00:00.000Z");
v_fecha_hasta = new Date("2016-12-25T00:00:00.000Z");

//Borra le la colección temporaria las disponibilidades y no disponibilidades para el usuario ingresado
db.tmpDispo.remove({"mail" : v_mail});
db.tmpNoDispo.remove({"mail" : v_mail});

printjson(v_fecha_desde);

v_fecha_desde_hora = new Date("2016-12-24T08:00:00.000Z");
v_fecha_hasta_hora = new Date("2016-12-24T20:00:00.000Z");

//v_fecha_desde.setUTCHours(8,0);
//v_fecha_desde.setUTCHours(20,0);
//printjson(v_fecha_desde);

//printjson(v_fecha_desde_hora);
//printjson(v_fecha_hasta_hora);
//printjson("Entra");

var v_items = db.cocheras.find();

//Recorre todas las cocheras 
while(v_items.hasNext()) {
    v_item = v_items.next();
    v_nombre = v_item.nombre;
    v_espacio = v_item.espacio;

//Busca las reservas que tenga la cochera que no esté Liberada para la fecha ingresada
 allreservasArray = db.reservas.find({
    $and: [
    { "cochera.nombre" : v_nombre },
    { "cochera.espacio" : v_espacio },
    { "FechaHoraDesde" : {"$gte": v_fecha_desde,
    "$lt": v_fecha_hasta} },
	{ "Estado" : {$ne: "Libre"} }
    ]
    }).sort({ FechaHoraDesde: 1 }).toArray();

//Si no encontro reservas coloca como disponible a la cochera toda la jornada
 if (allreservasArray.length <= 0) {

		db.tmpDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaHoraDesde" : v_fecha_desde_hora, "FechaHoraHasta" : v_fecha_hasta_hora, "HorasDispo" : 1200});
    } else {
	//Si encontró Reservas u Ocupaciones busca rangos de disponibilidad para la cochera
	//Busca rango disponible

	z = 0;
	v_fecha_d = v_fecha_desde_hora;
	while(z < allreservasArray.length) {
		//Cochera Disponible
//printjson(v_fecha_d);
//printjson(allreservasArray[z].FechaHoraDesde);
		 if (v_fecha_d < allreservasArray[z].FechaHoraDesde) {
			fecha_horadesde_libre = v_fecha_d;
			fecha_horafin_libre = allreservasArray[z].FechaHoraDesde;

			// Determino como coloco los minutos
			if (fecha_horadesde_libre.getUTCMinutes() == 0){
				v_Dispo_desde =	fecha_horadesde_libre.getUTCHours().toString() + "00";
			} else {
				v_Dispo_desde =	fecha_horadesde_libre.getUTCHours().toString() + fecha_horadesde_libre.getUTCMinutes().toString();
			} 

			// Determino como coloco los minutos
			if (fecha_horafin_libre.getUTCMinutes() == 0){
				v_Dispo_hasta =	fecha_horafin_libre.getUTCHours().toString() + "00";
			} else {
				v_Dispo_hasta =	fecha_horafin_libre.getUTCHours().toString() + fecha_horafin_libre.getUTCMinutes().toString();
			} 

			v_Dispo = Number(v_Dispo_hasta) - Number(v_Dispo_desde);
			//Coloca como disponible a la cochera para el rango hallado
			db.tmpDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaHoraDesde" : fecha_horadesde_libre, "FechaHoraHasta" : fecha_horafin_libre, "HorasDispo" : v_Dispo});
		 }
		 
		//Cochera no disponible
		fecha_horadesde_libre = allreservasArray[z].FechaHoraDesde;
		fecha_horafin_libre = allreservasArray[z].FechaHoraHasta;

		// Determino como coloco los minutos
		if (fecha_horadesde_libre.getUTCMinutes() == 0){
			v_Dispo_desde =	fecha_horadesde_libre.getUTCHours().toString() + "00";
		} else {
			v_Dispo_desde =	fecha_horadesde_libre.getUTCHours().toString() + fecha_horadesde_libre.getUTCMinutes().toString();
		} 

		// Determino como coloco los minutos
		if (fecha_horafin_libre.getUTCMinutes() == 0){
			v_Dispo_hasta =	fecha_horafin_libre.getUTCHours().toString() + "00";
		} else {
			v_Dispo_hasta =	fecha_horafin_libre.getUTCHours().toString() + fecha_horafin_libre.getUTCMinutes().toString();
		} 

		v_Dispo = Number(v_Dispo_hasta) - Number(v_Dispo_desde);

		//Busco el teléfono
		allUsuariosArray = db.usuarios.find({"mail" : allreservasArray[z].mail}).toArray();
		if (allUsuariosArray.length >= 0 ) {
			v_telefono = allUsuariosArray[0].telefono;
		}

		//Coloca como disponible a la cochera para el rango hallado
		db.tmpNoDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaHoraDesde" : fecha_horadesde_libre, "FechaHoraHasta" : fecha_horafin_libre, "HorasDispo" : v_Dispo, telefono : v_telefono});

		v_fecha_d = allreservasArray[z].FechaHoraHasta;
		z = z + 1;
	}

	if (v_fecha_d < v_fecha_hasta_hora){

		// Determino como coloco los minutos
		if (v_fecha_d.getUTCMinutes() == 0){
			v_Dispo_desde =	v_fecha_d.getUTCHours().toString() + "00";
		} else {
			v_Dispo_desde =	v_fecha_d.getUTCHours().toString() + v_fecha_d.getUTCMinutes().toString();
		} 

		// Determino como coloco los minutos
		if (v_fecha_hasta_hora.getUTCMinutes() == 0){
			v_Dispo_hasta =	v_fecha_hasta_hora.getUTCHours().toString() + "00";
		} else {
			v_Dispo_hasta =	v_fecha_hasta_hora.getUTCHours().toString() + v_fecha_hasta_hora.getUTCMinutes().toString();
		} 

		v_Dispo = Number(v_Dispo_hasta) - Number(v_Dispo_desde);

		//Coloca como disponible a la cochera para el rango hallado
		db.tmpDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaHoraDesde" : v_fecha_d, "FechaHoraHasta" : v_fecha_hasta_hora, "HorasDispo" : v_Dispo});
	}
}

}

// Devuelve datos para la grilla de disponibles en pestaña cocheras
db.tmpDispo.find({"mail" : v_mail}).sort({ HorasDispo: -1 });

// Devuelve datos para la grilla de NO disponibles en pestaña cocheras
db.tmpNoDispo.find({"mail" : v_mail}).sort({ HorasDispo: -1 });
