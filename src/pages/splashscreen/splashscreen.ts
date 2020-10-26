import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { AppVersion } from '@ionic-native/app-version';
import { TranslateService } from '@ngx-translate/core';


/**
 * Generated class for the SplashscreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splashscreen',
  templateUrl: 'splashscreen.html',
})
export class SplashscreenPage {

  intervalTime:number = 3000;
  intervalObj:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public statusBar: StatusBar,
    public api: UserProvider, appVersion: AppVersion,
    private translate: TranslateService) {

      platform.ready().then(() => {

          // Lang
          this.api.storage.get('lang').then((val) => {
              this.translate.setDefaultLang(val);
              this.translate.use(val);
          });

          // App Conf
          this.api.sendRequest('get_app_conf', {app:true}, false, false, false).then((data) => {

              if(data.type == "success") {

                  this.api.appConfig = data.data;
                  this.api.storage.set("appConfig", data.data);

                  // Check version
                  appVersion.getVersionNumber().then((version) => {
                    if(version != this.api.appConfig.version) {
                      
                      this.api.sendRequest('get_app_version', {app:true, version: this.api.appConfig.version}, false, false, false).then((val) => {

                          if(val.type == "success") {
                            clearTimeout(this.intervalObj);
                            navCtrl.setRoot("AppUpdatePage", {
                              version: val.data.version,
                              info: val.data.info,
                            });
                          }

                      });

                    }
                  });

              }

          });

      });

  }

  ionViewDidEnter() {
    console.log("Splashscreen Page");
    this.api.currentPage = "SplashscreenPage";
    //this.api.startLoading();

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#ffd520");
    });
  }

  ionViewDidLoad() {

    this.api.initUser().then((val) => {
      
      //this.api.stopLoading();
      
      if(this.api.isConnected === true) {
        this.intervalObj = setTimeout(() => {
          this.navCtrl.setRoot(this.api.dashboardPage);
        }, this.intervalTime);
      }
      else {
        this.intervalObj = setTimeout(() => {
          this.navCtrl.setRoot("WelcomePage");
        }, this.intervalTime);
      }
    
    });
  }

}



@Component({
  selector: 'lottie-animation-loading',
  template: ` <lottie-animation-view
                  [options]="lottieConfig"
                  (animCreated)="handleAnimation($event)">
            </lottie-animation-view>`,
  //styles: ['lottie-animation-loading { width:200px; height:200px; }']

})
export class LottieAnimationLoading {

  public lottieConfig: Object;
  private anim: any;

  constructor() {
    this.lottieConfig = {
        path: 'assets/gifs/loading-2.json',
        renderer: 'canvas',
        autoplay: true,
        loop: true
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  ionViewDidLoad() {

    this.anim.play();

    console.log('LottieAnimationLoading Load');
  }

}