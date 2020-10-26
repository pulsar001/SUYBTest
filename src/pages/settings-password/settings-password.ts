import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "SettingsPasswordPage",
  segment: "settings/password",
  defaultHistory: ['SettingsPage']
})
@Component({
  selector: 'page-settings-password',
  templateUrl: 'settings-password.html',
})
export class SettingsPasswordPage {


  formGroup: FormGroup;

  myPassword: AbstractControl;
  myNewPassword: AbstractControl;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: UserProvider, public statusBar: StatusBar, public platform: Platform, public formBuilder: FormBuilder) {
    
    this.formGroup = this.formBuilder.group({
      myPassword: ['', [Validators.required, Validators.minLength(8)]],
      myNewPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.myPassword = this.formGroup.controls['myPassword'];
    this.myNewPassword = this.formGroup.controls['myNewPassword'];
  }

  ionViewDidEnter() {
    console.log("SettingsPassword Page");
    this.api.currentPage = "SettingsPasswordPage";

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#ffd520");
    });
  }
  
  ionViewDidLoad() {
    this.api.initUser().then((val) => {
      
      if(this.api.isConnected !== true) {
        this.navCtrl.setRoot(this.api.loginPage);
      }

    });
  }


  
  doSave() {

    if (this.formGroup.valid) {

        this.api.sendRequest('edit_password', {
          password: this.formGroup.get("myPassword").value,
          new_password: this.formGroup.get("myNewPassword").value,
        }, true, true).then(data => {
          console.log('data', data);
          this.api.getToast(data.response);
          if(data.type == "success") {

              this.formGroup = this.formBuilder.group({
                myPassword: ['', [Validators.required, Validators.minLength(8)]],
                myNewPassword: ['', [Validators.required, Validators.minLength(8)]],
              });
          }
          
        }, error => {
          this.api.getToast("Error #APPSETPRO");
          console.log(error);
        });    
                
    }

  }

}
