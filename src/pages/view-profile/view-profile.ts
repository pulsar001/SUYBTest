import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "ViewProfilePage",
  segment: "profile/:id",
  defaultHistory: ['Map1Page']
})
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

  id_profile;
  info;

  toggleView = {helper:true, needer:false};

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider) {
    
    this.id_profile = navParams.get("id");

    if(!this.id_profile) {
      navCtrl.setRoot(this.api.dashboardPage);
    }
    else 
    {
        // If not info
        if(navParams.get("info"))
        {
          this.info = navParams.get("info").data;

          // Auto Ask Mission
          if(navParams.get("autoAsk")) this.ask(navParams.get("autoAsk"));
        }
        else 
        {
          this.api.getUserProfile(this.id_profile).then((data) => {
              this.info = data.data;
          },
          error => {
              console.log("profile error", error);
              navCtrl.setRoot(this.api.dashboardPage);
          });
        }
    }
    
  }

  ionViewDidEnter() {
    console.log("ViewProfile Page");
    this.api.currentPage = "ViewProfilePage";
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


  ask(type) {

    // Check If exist
    this.api.startLoading();
    this.api.checkMission(this.id_profile).then((data) => {
        this.api.stopLoading();

        if(data.type == "success") {

            this.navCtrl.push("MissionsPage", {
              id: data.data.id_mission,
              mission: data.data.mission,
              id_profile: this.id_profile,
              type: type,
              info: this.info
            });    

        }
        else {

            this.navCtrl.push("MissionsNewPage", {
              id_profile: this.id_profile,
              info: this.info,
              type: type,
            });

        }

    });

  }

  toggleInfo(type) {

      if(type == 'helper') {
        if(this.toggleView.helper === true) this.toggleView.helper = false;
        else this.toggleView.helper = true;
      }
      else if(type == 'needer') {
        if(this.toggleView.needer === true) this.toggleView.needer = false;
        else this.toggleView.needer = true;
      }

  }

  viewRank() {

      this.navCtrl.push("ViewProfileRankPage", {
          id: this.id_profile,
          info: this.info
      });

  }

  callPhone() {
    if(this.info.profile.phone) document.location.href = "tel:" + this.info.profile.phone;
  }

}
