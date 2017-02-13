import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login-page/login-page';
import { AuthService } from '../providers/auth-service';
import { Reservas } from '../providers/reservas';
import { Usuarios } from '../providers/usuarios';
import { Cocheras } from '../providers/cocheras';
import { MisReservasPage } from '../pages/mis-reservas/mis-reservas';
import { CocherasPage } from '../pages/cocheras/cocheras';
import { TabsPage } from '../pages/tabs/tabs';
import { OrderBy } from '../pipes/sort';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
	TabsPage,
	MisReservasPage,
	CocherasPage,
	OrderBy
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
		backButtonText: "Volver"
	})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
	TabsPage,
	MisReservasPage,
	CocherasPage
  ],
  providers: [AuthService, Reservas, Usuarios, Cocheras]
})
export class AppModule {}
