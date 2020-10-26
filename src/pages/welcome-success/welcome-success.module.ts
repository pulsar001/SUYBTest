import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WelcomeSuccessPage } from './welcome-success';
import { LottieAnimationViewModule } from 'ng-lottie';
import { LottieAnimationSuccess } from '../../pages/welcome-success/welcome-success';

@NgModule({
  declarations: [
    WelcomeSuccessPage,
    LottieAnimationSuccess,
  ],
  imports: [
    IonicPageModule.forChild(WelcomeSuccessPage),
    LottieAnimationViewModule.forRoot()
  ],
})
export class WelcomeSuccessPageModule {}
