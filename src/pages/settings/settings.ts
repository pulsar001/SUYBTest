import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "SettingsPage",
  segment: "settings",
  defaultHistory: ['Map1Page']
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public api: UserProvider, public statusBar: StatusBar, public platform: Platform, public menuCtrl: MenuController) {
  }

  ionViewDidEnter() {
    console.log("Settings Page");
    this.api.currentPage = "SettingsPage";
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
      
      if(this.api.isConnected !== true) {
        this.navCtrl.setRoot(this.api.loginPage);
      }

    });
  }

  itemSelected(item:any) {
    switch(item) {
      case "options":
        this.navCtrl.push("SettingsOptionsPage");
        break;
      case "profile":
        this.navCtrl.push("SettingsProfilePage");
        break;
      case "password":
        this.navCtrl.push("SettingsPasswordPage");
        break;
      case "email":
        this.navCtrl.push("SettingsEmailPage");
        break;
      case "conditions":
        //this.api.getUrl(this.api.pagesLink + "conditions.html");
        this.navCtrl.push("BrowserPage", {
          url: this.api.pagesLink + "conditions.html",
          title: "Conditions"
        });
        break;
      case "about":
        // this.api.getUrl(this.api.pagesLink + "about.html");
        this.navCtrl.push("BrowserPage", {
          url: this.api.pagesLink + "about.html",
          title: "A propos"
        });
        break;
      case "contact":
        // this.api.getUrl(this.api.pagesLink + "contactus.html");
        this.navCtrl.push("BrowserPage", {
          url: this.api.pagesLink + "contactus.html",
          title: "Contact"
        });
        break;
    }
  }

  logOut() {
    this.navCtrl.push("DisconnectPage");
  }

}
