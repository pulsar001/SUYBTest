import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "WelcomePage",
  segment: "welcome"
})
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  nextPage = "WelcomeEmailPage";
  nextData = {email: '', firstName: '', lastName: '', picture: '', id_facebook: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public statusBar: StatusBar,
    public api: UserProvider,
    private facebook: Facebook
    ) {
  }

  ionViewDidEnter() {
    console.log("Welcome Page");
    this.api.currentPage = "WelcomePage";

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#fff");
    });
  }

  ionViewDidLoad() {

    this.api.initUser().then((val) => {
      
      if(this.api.isConnected === true) {
        this.navCtrl.setRoot(this.api.dashboardPage);
      }
    
    });
  }

  nextStep() {

      this.navCtrl.push(this.nextPage, {
        data: this.nextData
      });

  }

  loginFacebook() {
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      console.log(': FacebookLoginResponse', response);
      this.facebook.api('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {

        this.nextData.email = profile['email'];
        this.nextData.firstName = profile['first_name'];
        this.nextData.lastName = profile['last_name'];
        this.nextData.picture = profile['picture_large']['data']['url'];
        this.nextData.id_facebook = profile['id'];

        if(!this.nextData.id_facebook)
        {
            this.api.getToast("Error with Facebook login");
        }
        else 
        {
            this.api.startLoading();
            
            this.api.loginSocial(this.nextData.id_facebook, 'facebook').then(data => {

              this.api.getToast(data.response);
              if(data.type == "success") {

                let thenPromise = [];
        
                thenPromise.push(
                    // Data
                    this.api.storage.set('dataUser', data.data).then(),
                    // Connect 
                    this.api.storage.set('isConnected', true).then()
                );
                  
                Promise.all(thenPromise).then(() => {
                    
                    // Data
                    this.api.dataUser = data.data;
                    // Connect
                    this.api.isConnected = true;

                    this.api.stopLoading();
        
                    // Redirect
                    this.navCtrl.setRoot(this.api.dashboardPage);
                    
                    
                });
        
              }
              else {
                this.api.stopLoading();
                
                this.navCtrl.push(this.nextPage, {
                  data: this.nextData
                });

              }
        
            }, error => {
              this.api.stopLoading();
              this.api.getToast("Error #APPLOGSOC");
              console.log(error);
            });
          
        }


      })
    })
  }

}
