import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the WelcomeSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome-success',
  templateUrl: 'welcome-success.html',
})
export class WelcomeSuccessPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomeSuccessPage');
  }

}



@Component({
  selector: 'lottie-animation-success',
  template: ` <lottie-animation-view
                  [options]="lottieConfig"
                  (animCreated)="handleAnimation($event)">
            </lottie-animation-view>`,
  //styles: ['lottie-animation-success { width:200px; height:200px; }']

})
export class LottieAnimationSuccess {

  public lottieConfig: Object;
  private anim: any;

  animTime:number = 3000; // milisec 

  constructor(private navCtrl: NavController, public platform: Platform, public statusBar: StatusBar, private api: UserProvider) {
    this.lottieConfig = {
        path: 'assets/gifs/success-1.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true
    };

    setTimeout(() => {
      this.navCtrl.setRoot(this.api.dashboardPage)
    }, 3000);
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  
  ionViewDidEnter() {
    console.log("WelcomeSuccess Page");
    this.api.currentPage = "WelcomeSuccessPage";

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#fff");
    });

  }
  
  ionViewDidLoad() {

    this.anim.play();

  }

}