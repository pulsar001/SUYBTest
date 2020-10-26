import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';

/**
 * Generated class for the WelcomePasswordLostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "WelcomePasswordLostPage",
  segment: "welcome-password-lost",
  defaultHistory: ['WelcomePasswordPage']
})
@Component({
  selector: 'page-welcome-password-lost',
  templateUrl: 'welcome-password-lost.html',
})
export class WelcomePasswordLostPage {

  formGroup: FormGroup;

  myCode: AbstractControl;
  nextData;

  resendTimerDefault:number = 60;
  resendTimer:number = this.resendTimerDefault;
  resendTimerInterval:any;

  codeLength:number = 10;

  nextPage = "WelcomePasswordLostNewPage";

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider, public formBuilder: FormBuilder) {
          
    this.formGroup = this.formBuilder.group({
      myCode: ['', [Validators.required, Validators.minLength(this.codeLength)]],
    });

    this.myCode = this.formGroup.controls['myCode'];

    this.nextData = navParams.get('data');
    if(!this.nextData) {
      this.navCtrl.setRoot("WelcomePage")
    }

    this.api.storage.get("sendCodeTimer").then((val) => {

      if(val) this.resendTimer = val;
      else  this.resendTimer = 0;

      console.log("ok", val, this.resendTimer);
      this.sendCode();
    });


  }

  ionViewDidEnter() {
    console.log("WelcomePasswordLost Page");
    this.api.currentPage = "WelcomePasswordLostPage";

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

  initCode() {
    clearInterval(this.resendTimerInterval);
    this.resendTimerInterval = setInterval(() => {
      if(this.resendTimer > 0) {
        this.resendTimer--;
        this.api.storage.set("sendCodeTimer", this.resendTimer);
      }
      else 
        clearInterval(this.resendTimerInterval);
    }, 1000);
  }

  sendCode() 
  {
    if(this.resendTimer <= 0) 
    {
      this.resendTimer = this.resendTimerDefault;
      
      this.api.startLoading();
      this.api.passwordLost("password_lost", {email: this.nextData.email}).then(data => {
        
        this.api.stopLoading();
        this.api.getToast(data.response);
        if(data.type == "error") {
          this.navCtrl.push("WelcomeEmailPage", {
            data: this.nextData,
          });
        }
        
      });
    }

    this.initCode();
  }

  nextStep() {


      if(this.formGroup.get("myCode").value.length != this.codeLength) {
        this.api.getToast("Enter your code");
      }
      else {

        this.api.startLoading();
        this.api.passwordLost("password_lost_verify", {email: this.nextData.email, code: this.formGroup.get("myCode").value}).then(data => {
    
          this.api.stopLoading();
          this.api.getToast(data.response);
          if(data.type == "success") {
    
            this.navCtrl.push("WelcomePasswordLostNewPage", {
              data: this.nextData,
              code: this.formGroup.get("myCode").value,
              token: data.data.token
            });
    
          }
    
        });

      }


  }

}
