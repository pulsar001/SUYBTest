import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "NotificationsPage",
  segment: "notifications",
  defaultHistory: ['Map1Page']
})
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notifications:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider) {

  }

  ionViewDidEnter() {
    console.log("Notifications Page");
    this.api.currentPage = "NotificationsPage";
    //this.api.startLoading();

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#ffd520");
    });

    this.api.getNotifications().then((data) => {
        if(data.type == "success") {
          this.notifications = data.data;
          this.api.dataUser.stats.nbr_notifications = 0;
        }
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

  toggleNotification(notification) {

    if(notification.type == "mission") {
      this.navCtrl.push("MissionsPage", {
        id: notification.id_type
      });
    }

  }


}
