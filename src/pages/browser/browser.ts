import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';
import { DomSanitizer } from '@angular/platform-browser';



/**
 * Generated class for the BrowserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-browser',
  templateUrl: 'browser.html',
})
export class BrowserPage {

  url;
  title;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: UserProvider, public platform: Platform, public statusBar: StatusBar, public sanitizer: DomSanitizer) {
  
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(navParams.get("url"));
      this.title = navParams.get("title");
  
      if(!navParams.get("url")) {
        navCtrl.pop();
      }
      
  }

  ionViewDidEnter() {
    console.log("Browser Page");
    this.api.currentPage = "BrowserPage";

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#ffd520");
    });

  }
}
