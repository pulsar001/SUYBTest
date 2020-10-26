import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the WelcomePasswordLostNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome-password-lost-new',
  templateUrl: 'welcome-password-lost-new.html',
})
export class WelcomePasswordLostNewPage {


  formGroup: FormGroup;

  myNewPassword: AbstractControl;
  nextData;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider, public formBuilder: FormBuilder) {
          
    this.formGroup = this.formBuilder.group({
      myNewPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.myNewPassword = this.formGroup.controls['myNewPassword'];

    this.nextData = navParams.get('data');
    console.log('ok', this.nextData, navParams.get('token'));
    if(!this.nextData || !navParams.get('token')) {
      this.navCtrl.setRoot("WelcomePage")
    }

  }

  ionViewDidEnter() {
    console.log("WelcomePasswordLostNew Page");
    this.api.currentPage = "WelcomePasswordLostNewPage";

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

      if(this.formGroup.get("myNewPassword").value) {

        this.api.startLoading();
        this.api.passwordLost("password_lost_new", {email: this.nextData.email, password: this.formGroup.get("myNewPassword").value}, 'requestId=' + this.navParams.get('token')).then(data => {
    
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
    
        });

      }


  }

}
