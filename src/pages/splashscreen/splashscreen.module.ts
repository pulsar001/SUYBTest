import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashscreenPage } from './splashscreen';
import { LottieAnimationViewModule } from 'ng-lottie';
import { LottieAnimationLoading } from '../../pages/splashscreen/splashscreen';
import { AppVersion } from '@ionic-native/app-version';

@NgModule({
  declarations: [
    SplashscreenPage,
    LottieAnimationLoading,
  ],
  imports: [
    IonicPageModule.forChild(SplashscreenPage),
    LottieAnimationViewModule.forRoot()
  ],
  providers: [
    AppVersion
  ]
})
export class SplashscreenPageModule {}
