import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderBy', pure: false})
export class OrderBy implements PipeTransform {

  static _orderByComparator(a:any, b:any):number{

	let isDate = typeof a == 'string' && Date.parse(a);
	if (isDate){
	  var dtastr = a.replace(/\D/g," ");
	  var dtacomps = dtastr.split(" ");
	  a = [dtacomps[0],dtacomps[1],dtacomps[2]].join('');
	  
	  var dtbstr = b.replace(/\D/g," ");
	  var dtbcomps = dtbstr.split(" ");
	  b = [dtbcomps[0],dtbcomps[1],dtbcomps[2]].join('');
	}
	
    if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
      //Si no son numeros, hago toLowerCase para comparar apropiadamente
      if(a.toLowerCase() < b.toLowerCase()) return -1;
      if(a.toLowerCase() > b.toLowerCase()) return 1;
    }
    else{
      //Parsear los strings como numeros para comparar apropiadamente
      if(parseFloat(a) < parseFloat(b)) return -1;
      if(parseFloat(a) > parseFloat(b)) return 1;
    }
    
    return 0; //Iguales
  }

  transform(input:any, [config = '+']): any{
        
    if(!Array.isArray(input)) return input;

    if(!Array.isArray(config) || (Array.isArray(config) && config.length == 1)){
      var propertyToCheck:string = !Array.isArray(config) ? config : config[0];
      var desc = propertyToCheck.substr(0, 1) == '-';
            
       //Array basico
       if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
         return !desc ? input.sort() : input.sort().reverse();
       }
       else {
         var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
           ? propertyToCheck.substr(1)
           : propertyToCheck;

          return input.sort(function(a:any,b:any){
            return !desc ?
                OrderBy._orderByComparator(a[property], b[property])
                 : -OrderBy._orderByComparator(a[property], b[property]);
          });
        }
      }
      else {
        return input.sort(function(a:any,b:any){
          for(var i:number = 0; i < config.length; i++){
            var desc = config[i].substr(0, 1) == '-';
            var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
              ? config[i].substr(1)
              : config[i];

            var comparison = !desc 
                ? OrderBy._orderByComparator(a[property], b[property])
                : -OrderBy._orderByComparator(a[property], b[property]);
                    
            if(comparison != 0) return comparison;
          }

        return 0; //Iguales
      });
    }
  }
}