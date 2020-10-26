import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePasswordLostNewPage } from './welcome-password-lost-new';

@NgModule({
  declarations: [
    WelcomePasswordLostNewPage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePasswordLostNewPage),
  ],
})
export class WelcomePasswordLostNewPageModule {}
