import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the ViewProfileRankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "ViewProfileRankPage",
  segment: "profile/:id/rank",
  defaultHistory: ['Map1Page']
})
@Component({
  selector: 'page-view-profile-rank',
  templateUrl: 'view-profile-rank.html',
})
export class ViewProfileRankPage {

  id_profile;
  info;
  data;
  note;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider) {

    this.id_profile = navParams.get("id");

    if(!this.id_profile) {
      navCtrl.setRoot(this.api.dashboardPage);
    }

    this.api.sendRequest('get_profile_rank', {id_profile: this.id_profile}, true, false, true).then((data) => {

        if(data.type == "success") {
            this.data = data.data;

            this.note = api.getRank(this.data.stats.exp, this.data.stats.nbr_missions);
            if(this.data.stats.nbr_missions == 0) this.note = "...";

        }
        else {
          navCtrl.setRoot(this.api.dashboardPage);
        }

    });

  }

  ionViewDidEnter() {
    console.log("ViewProfileRank Page");
    this.api.currentPage = "ViewProfileRankPage";
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


}
