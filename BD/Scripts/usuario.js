function usuarios(nombre,apellido,telefono,flag,mail,clave,habilitado,is,operacion){

 if (operacion=='alta'){
     db.usuario.insert( {nombre : nombre , apellido : apellido, telefono : telefono , flag : flag, mail : mail , clave : clave, habilitado: habilitado, IS: is});
print(nombre,apellido,telefono,flag,mail,clave,habilitado,is);    
    print('se insertó el registro');
  } 
 if (operacion=='baja'){
     db.usuario.remove({'mail':mail})
     
    print('se borró el registro');
  } 
 if (operacion=='cambio'){
     
     if (nombre != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"nombre":nombre }}
)
     if (apellido != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"apellido":apellido }}
)   
     if (telefono != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"telefono":telefono }}
)      
     if (flag != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"flag":flag }}
)   
     if (mail != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"mail":mail }}
)  
     if (clave != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"clave":clave }}
)   
     if (habilitado != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"habilitado":habilitado }}
) 

     if (is != null)
     db.usuario.update(
        {"mail" : mail},
        {"$set":{"IS":is }}
)
    print('se actualizo el registro');
  }
}
