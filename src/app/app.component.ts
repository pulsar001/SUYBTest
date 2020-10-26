import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';

import { OneSignal } from '@ionic-native/onesignal';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage:any = "SplashscreenPage";

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    public api: UserProvider, 
    public menuCtrl: MenuController, 
    private oneSignal: OneSignal, 
    ) {

    console.log("App Page");

    // Init user
    this.api.initUser();
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
      if(platform.is('cordova'))
      {

          // Onesignal
          this.oneSignal.startInit('0d0eade4-e21f-4e1c-957a-03ba596366fc', '175233113639');
          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        
          this.oneSignal.handleNotificationReceived().subscribe(() => {
          // do something when notification is received
          });
        
          this.oneSignal.handleNotificationOpened().subscribe(() => {
            // do something when a notification is opened

            // Redirect notification
            if(this.api.isConnected === true) this.nav.push("NotificationsPage");
            else this.nav.push("LoginPage");

          });
        
          this.oneSignal.endInit();

      }    

    });


  }
  
  

  // Menu Choose
  menu(type:string) {

    this.menuCtrl.close();

    switch(type) {
      
      case "helper":
        this.nav.push("DashboardHelperPage");
      break;

      case "my-missions":
        this.nav.push("MyMissionsNewPage");
      break;

      case "profile":
        this.nav.push("SettingsProfilePage");
      break;

      case "missions":
        this.nav.push("MissionsListPage");
      break;

      case "settings":
        this.nav.push("SettingsPage");
      break;

      case "notifications":
        this.nav.push("NotificationsPage");
      break;

      case "disconnect":
      this.nav.push("DisconnectPage");
      break;


    }

  }

  viewProfile() {
    this.menuCtrl.close();
    this.nav.push("ViewProfilePage", {
      id: this.api.dataUser.profile.id_profile,
      info: {data: this.api.dataUser},
    });
  }

}

