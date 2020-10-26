import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the DisconnectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disconnect',
  templateUrl: 'disconnect.html',
})
export class DisconnectPage {

  disconnectTime = 3;
  disconnectInterval;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider) {
  }


  ionViewDidEnter() {
    console.log("Disconnect Page");
    this.api.currentPage = "DisconnectPage";
    //this.api.startLoading();

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#fff");
    });

    this.disconnectTime = 3;
    clearInterval(this.disconnectInterval);
    this.disconnectInterval = setInterval(() => {
      this.disconnectTime--;
    },1000);

  }
  
  ionViewDidLoad() {
    this.api.initUser().then((val) => {
      
      //this.api.stopLoading();
      
      if(this.api.isConnected !== true) {
        this.navCtrl.setRoot(this.api.loginPage);
      }

    });
  }

  ionViewDidLeave() {
    clearInterval(this.disconnectInterval);
  }

  back() {
    this.navCtrl.pop();
  }

  disconnect() {

    if(this.disconnectTime <= 0) {
      this.api.sendRequest('disconnect', {app: true}, true, false, true).then((data) => {
          this.api.disconnectUser().then(() => {
              this.navCtrl.setRoot("WelcomePage");
          });
      });
    }
    
  }

}
