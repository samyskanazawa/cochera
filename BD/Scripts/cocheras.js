function cocheras(nombre,espacio,direccion,fecha,localidad,peso,operacion){

 if (operacion=='alta'){
     db.cochera.insert( {nombre : nombre , espacio : espacio, direccion : direccion , fecha : fecha, localidad: localidad, peso: peso});
print(nombre,espacio,direccion,fecha,localidad,peso);    
    print('se insertó el registro');
  } 

 if (operacion=='baja'){
     db.cochera.remove({'nombre':nombre})
     
    print('se borró el registro');
  } 

 if (operacion=='cambio'){
     
     if (nombre != null)
     db.cochera.update(
        {"nombre" : nombre},
        {"$set":{"nombre":nombre }}
)
     if (espacio != null)
     db.cochera.update(
        {"nombre" : nombre},
        {"$set":{"espacio":espacio }}
)   
     if (direccion != null)
     db.cochera.update(
        {"nombre" : nombre},
        {"$set":{"direccion":direccion }}
)      
     if (fecha != null)
     db.cochera.update(
        {"nombre" : nombre},
        {"$set":{"fecha":fecha }}
)     
     if (localidad != null)
     db.cochera.update(
        {"nombre" : nombre},
        {"$set":{"localidad":localidad }}
)     
     if (peso != null)
     db.cochera.update(
        {"nombre" : nombre},
        {"$set":{"peso":peso }}
) 

    print('se actualizo el registro');
  } 


}

/*cocheras('21','Sub 3 - ARP4 (test3)','Maipu 942','17/05/2017','CABA','1','cambio');*/