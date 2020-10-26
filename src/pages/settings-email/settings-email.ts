import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';

/**
 * Generated class for the EmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "SettingsEmailPage",
  segment: "settings/email",
  defaultHistory: ['SettingsPage']
})
@Component({
  selector: 'page-settings-email',
  templateUrl: 'settings-email.html',
})
export class SettingsEmailPage {

  
  formGroup: FormGroup;
  myEmail: AbstractControl;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: UserProvider, public statusBar: StatusBar, public platform: Platform, public formBuilder: FormBuilder) {
    
    this.formGroup = this.formBuilder.group({
      myEmail: ['', [Validators.required, Validators.minLength(2)]],
    });

    if(api.dataUser.info) {
        this.formGroup = this.formBuilder.group({
          myEmail: [api.dataUser.info.email, [Validators.required, Validators.minLength(2)]],
        });
    }

    this.myEmail = this.formGroup.controls['myEmail'];
  }

  ionViewDidEnter() {
    console.log("SettingsEmail Page");
    this.api.currentPage = "SettingsEmailPage";

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

        // this.api.editEmail(this.formGroup.get("myEmail").value).then(data => {
        //   console.log('data', data);
        //   this.api.getToast(data.response);
        //   if(data.type == "success") {

        //       this.api.dataUser.info = data.data.info;
        //       this.api.storage.set('dataUser', this.api.dataUser);
              
        //       this.formGroup = this.formBuilder.group({
        //         myEmail: [this.api.dataUser.info.email, [Validators.required, Validators.minLength(2)]],
        //       });
        //   }
          
        // }, error => {
        //   this.api.getToast("Error #APPSETPRO");
        //   console.log(error);
        // });    
                
    }

  }

}
