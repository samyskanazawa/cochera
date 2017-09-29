import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

import { AuthService } from '../providers/auth-service';
import { Reservas } from '../providers/reservas';
import { Usuarios } from '../providers/usuarios';
import { Cocheras } from '../providers/cocheras';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login-page/login-page';
import { ReservaRecurrente } from '../providers/reserva-recurrente';
import { MisReservasPage } from '../pages/mis-reservas/mis-reservas';
import { CocherasPage } from '../pages/cocheras/cocheras';
import { ABMCocherasPage } from '../pages/abm-cocheras/abm-cocheras';
import { CambiarUsuarioReservaPage } from '../pages/cambiar-usuario-reserva/cambiar-usuario-reserva';
import { ReservaRecurrentePage } from '../pages/reserva-recurrente/reserva-recurrente';

import { OrderBy } from '../pipes/sort';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
	  MisReservasPage,  
	  CocherasPage,
    ABMCocherasPage,
    CambiarUsuarioReservaPage,
    ReservaRecurrentePage,
	  OrderBy
  ],
  imports: [
  //  IonicModule.forRoot(MyApp, {
	//	backButtonText: "Volver"
	//}),
	IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false } ),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
	  MisReservasPage,
	  CocherasPage,
    ABMCocherasPage,
    CambiarUsuarioReservaPage,
    ReservaRecurrentePage
  ],
  providers: [AuthService, Reservas, Usuarios, Cocheras,ReservaRecurrente]
})
export class AppModule {}





