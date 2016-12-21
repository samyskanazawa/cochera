var v_mail;
var v_items;
var v_item;
var v_nombre;
var v_espacio;
var v_fecha;
var allreservasArray;
var z;
var v_array;
var v_Dispo;
var horadesde;
var horadesde_libre;
var horafin_libre;
var	allUsuariosArray;
var	v_telefono;


v_mail = "julian.alessandrini@softtek.com";
v_fecha = new Date("2016, 11, 30");

//Borra le la colección temporaria las disponibilidades y no disponibilidades para el usuario ingresado
db.tmpDispo.remove({"mail" : v_mail});
db.tmpNoDispo.remove({"mail" : v_mail});

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
    { "FechaRese" : v_fecha },
	{ "Estado" : {$ne: "Libre"} }
    ]
    }).sort({ HoraDesdeSort: 1 }).toArray();

//Si no encontro reservas coloca como disponible a la cochera toda la jornada
 if (allreservasArray.length <= 0) {
db.tmpDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaDispo" : v_fecha, "HoraDesde" : "8:00" , "HoraHasta" : "20:00", "HorasDispo" : 1200});
    }
    else
//Si encontró Reservas u Ocupaciones busca rangos de disponibilidad para la cochera
{
	//Busca rango disponible
	z = 0;
	horadesde = "8:00";
	while(z < allreservasArray.length) {
		//Cochera Disponible
		if (Number(horadesde.replace(":","")) < Number(allreservasArray[z].HoraDesde.replace(":",""))) {
//			printjson("Entra");
			horadesde_libre = horadesde;
			horafin_libre = allreservasArray[z].HoraDesde;
			v_Dispo = Number(horafin_libre.replace(":","")) - Number(horadesde_libre.replace(":",""));
			//Coloca como disponible a la cochera para el rango hallado
			db.tmpDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaDispo" : v_fecha, "HoraDesde" : horadesde_libre , "HoraHasta" : horafin_libre , "HorasDispo" : v_Dispo});
		}

		//Cochera no disponible
		horadesde_libre = allreservasArray[z].HoraDesde;
		horafin_libre = allreservasArray[z].HoraHasta;
		v_Dispo = Number(horafin_libre.replace(":","")) - Number(horadesde_libre.replace(":",""));

		//Busco el teléfono
		allUsuariosArray = db.usuarios.find({"mail" : allreservasArray[z].mail}).toArray();
		if (allUsuariosArray.length >= 0 ) {
			v_telefono = allUsuariosArray[0].telefono;
		}

		//Coloca como disponible a la cochera para el rango hallado
		db.tmpNoDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaDispo" : v_fecha, "HoraDesde" : horadesde_libre , "HoraHasta" : horafin_libre , "HorasDispo" : v_Dispo, telefono : v_telefono});
		
		horadesde = allreservasArray[z].HoraHasta;
		z = z + 1;
	}

	if (horadesde != "20:00"){
		v_Dispo = 2000 - Number(horadesde.replace(":",""));
		//Coloca como disponible a la cochera para el rango hallado
		db.tmpDispo.insert( {"mail" : v_mail , "cochera" : { "nombre" : v_nombre, "espacio" : v_espacio }, "FechaDispo" : v_fecha, "HoraDesde" : horadesde , "HoraHasta" : "20:00" , "HorasDispo" : v_Dispo});
	}
}

}

// Devuelve datos para la grilla de disponibles en pestaña cocheras
db.tmpDispo.find({"mail" : v_mail}).sort({ HorasDispo: -1 });

// Devuelve datos para la grilla de NO disponibles en pestaña cocheras
db.tmpNoDispo.find({"mail" : v_mail}).sort({ HorasDispo: -1 });
