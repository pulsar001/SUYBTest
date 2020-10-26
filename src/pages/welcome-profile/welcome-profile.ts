import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the WelcomeProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "WelcomeProfilePage",
  segment: "welcome-profile",
  defaultHistory: ['WelcomePasswordPage']
})
@Component({
  selector: 'page-welcome-profile',
  templateUrl: 'welcome-profile.html',
})
export class WelcomeProfilePage {

  formGroup: FormGroup;

  myFirstName: AbstractControl;
  myLastName: AbstractControl;
  nextData;

  nextPage = "WelcomeSuccessPage";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public statusBar: StatusBar,
    public api: UserProvider, public formBuilder: FormBuilder) {

      this.formGroup = this.formBuilder.group({
        myFirstName: ['', [Validators.required, Validators.minLength(2)]],
        myLastName: ['', []],
      });

      this.myFirstName = this.formGroup.controls['myFirstName'];
      this.myLastName = this.formGroup.controls['myLastName'];

      this.nextData = navParams.get('data');
      if(!this.nextData) {
        this.navCtrl.setRoot("WelcomePage")
      }
      else {

        this.formGroup = this.formBuilder.group({
          myFirstName: [this.nextData.firstName, [Validators.required, Validators.minLength(2)]],
          myLastName: [this.nextData.lastName, []],
        });

      }

      console.log("nextData", this.nextData);

  }

  ionViewDidEnter() {
    console.log("WelcomeProfile Page");
    this.api.currentPage = "WelcomeProfilePage";

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

      this.nextData.firstName = this.formGroup.get("myFirstName").value;
      this.nextData.lastName = this.formGroup.get("myLastName").value;


      if(!this.nextData.email && !this.nextData.password && !this.nextData.firstName)
      {
          this.navCtrl.push("WelcomeEmailPage");
      }
      else 
      {

          this.api.startLoading();

          let arrSocial = {id_facebook:'', id_google:'', id_other:''};
          if(this.nextData.id_facebook) arrSocial.id_facebook = this.nextData.id_facebook;

          this.api.register(this.nextData.email, this.nextData.password, arrSocial).then(data => {

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

                  // Profile
                  this.api.editProfile(this.nextData.firstName, this.nextData.lastName, '', '', '', this.nextData.id_facebook).then((data) => {
                    this.api.dataUser.profile = data.data.profile;
                    if(this.nextData.id_facebook) this.api.dataUser.photos.profile_picture = data.data.photos.profile_picture;
                    this.api.storage.set('dataUser', this.api.dataUser);
                  });

                  this.api.stopLoading();
      
                  // Redirect
                  this.navCtrl.setRoot("WelcomeSuccessPage");
                  
                  
              });
      
            }
            else {
              
              this.api.stopLoading();
              this.api.getToast(data.response);

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

  }

}
