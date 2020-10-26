import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomePage } from './welcome';

import { Facebook } from '@ionic-native/facebook'

@NgModule({
  declarations: [
    WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(WelcomePage),
  ],
  providers: [
    Facebook
  ]
})
export class WelcomePageModule {}
