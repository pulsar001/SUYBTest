import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { AppUpdate } from '@ionic-native/app-update';

/**
 * Generated class for the AppUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "AppUpdatePage",
  segment: "app-update",
  defaultHistory: ['WelcomePage']
})
@Component({
  selector: 'page-app-update',
  templateUrl: 'app-update.html',
})
export class AppUpdatePage {

  info;
  version;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider, private appUpdate: AppUpdate) {
    this.info = navParams.get("info");
    this.version = navParams.get("version");

    //this.update();
  }

  ionViewDidEnter() {
    console.log("AppUpdate Page");
    this.api.currentPage = "AppUpdatePage";

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#fff");
    });
  }

  update() {
    this.appUpdate.checkAppUpdate(this.api.updateLink).then(() => { 
      
        // this.api.initUser().then((val) => {
          
        //   if(this.api.isConnected === true) {
        //       this.navCtrl.setRoot(this.api.dashboardPage);
        //   }
        //   else {
        //       this.navCtrl.setRoot("WelcomePage");
        //   }
        
        // });

    });
  }

  store() {

  }

}
