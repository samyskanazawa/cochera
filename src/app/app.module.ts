import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login-page/login-page';
import { AuthService } from '../providers/auth-service';
import { RegisterPage } from '../pages/register/register';
import { MisReservasPage } from '../pages/mis-reservas/mis-reservas';
import { CocherasPage } from '../pages/cocheras/cocheras';
import { TabsPage } from '../pages/tabs/tabs';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
	TabsPage,
	MisReservasPage,
	CocherasPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
	TabsPage,
	MisReservasPage,
	CocherasPage
  ],
  providers: [AuthService]
})
export class AppModule {}
