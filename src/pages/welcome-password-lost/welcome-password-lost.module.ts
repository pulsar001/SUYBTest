import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePasswordLostPage } from './welcome-password-lost';

@NgModule({
  declarations: [
    WelcomePasswordLostPage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePasswordLostPage),
  ],
})
export class WelcomePasswordLostPageModule {}
