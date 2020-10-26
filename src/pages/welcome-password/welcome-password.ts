import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the WelcomePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "WelcomePasswordPage",
  segment: "welcome-password",
  defaultHistory: ['WelcomeEmailPage']
})
@Component({
  selector: 'page-welcome-password',
  templateUrl: 'welcome-password.html',
})
export class WelcomePasswordPage {

  
  formGroup: FormGroup;

  myPassword: AbstractControl;
  nextData;

  nextPage = "WelcomeProfilePage";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public statusBar: StatusBar,
    public api: UserProvider, public formBuilder: FormBuilder) {

      
      this.formGroup = this.formBuilder.group({
        myPassword: ['', [Validators.required, Validators.minLength(8)]],
      });
  
      this.myPassword = this.formGroup.controls['myPassword'];

      this.nextData = navParams.get('data');
      if(!this.nextData) {
        this.navCtrl.setRoot("WelcomePage")
      }

      console.log("nextData", this.nextData);

  }


  ionViewDidEnter() {
    console.log("WelcomePassword Page");
    this.api.currentPage = "WelcomePasswordPage";

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

      this.nextData.password = this.formGroup.get("myPassword").value;

      if(!this.nextData.email && !this.nextData.password)
      {
          this.navCtrl.push("WelcomeEmailPage");
      }
      else 
      {

          this.api.startLoading();

          this.api.checkIfExist(this.nextData.email).then((data) => {

              if(data.type == "error") {

                this.api.stopLoading();
                
                this.navCtrl.push(this.nextPage, {
                  data: this.nextData
                });

              }
              else if(data.type == "success") {

                  this.api.login(this.nextData.email, this.nextData.password).then(data => {

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

                      this.navCtrl.push("WelcomeEmailPage", {
                        data: this.nextData
                      });

                    }
              
                  }, error => {
                    this.api.stopLoading();
                    this.api.getToast("Error #APPLOG");
                    console.log(error);
                  });
            
              }

          });


      }

  }

  lostPassword() {

      this.navCtrl.push("WelcomePasswordLostPage", {
        data: this.nextData
      });

  }

}
