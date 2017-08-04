/*
funcion DiaDelAnio
Objetivo: devolver el dia del año de la fecha parametro (del 1 al 365)
DiaDelAnio('2017/05/28');
*/
function (d) {   // d is a Date object
var yn = d.getFullYear();
var mn = d.getMonth();
var dn = d.getDate();
var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
var ddiff = Math.round((d2-d1)/864e5);
return ddiff+1; }