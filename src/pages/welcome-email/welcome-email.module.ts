import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomeEmailPage } from './welcome-email';

@NgModule({
  declarations: [
    WelcomeEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomeEmailPage),
  ],
})
export class WelcomeEmailPageModule {}
