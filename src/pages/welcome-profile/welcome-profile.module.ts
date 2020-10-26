import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomeProfilePage } from './welcome-profile';

@NgModule({
  declarations: [
    WelcomeProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomeProfilePage),
  ],
})
export class WelcomeProfilePageModule {}
