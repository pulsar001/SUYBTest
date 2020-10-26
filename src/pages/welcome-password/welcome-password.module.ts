import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePasswordPage } from './welcome-password';

@NgModule({
  declarations: [
    WelcomePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePasswordPage),
  ],
})
export class WelcomePasswordPageModule {}
