import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the OptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "SettingsOptionsPage",
  segment: "settings/options",
  defaultHistory: ['SettingsPage']
})
@Component({
  selector: 'page-settings-options',
  templateUrl: 'settings-options.html',
})
export class SettingsOptionsPage {

  formGroup: FormGroup;
  myLang: AbstractControl;
  myNotificationsPush: AbstractControl;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: UserProvider, public statusBar: StatusBar, public platform: Platform, public formBuilder: FormBuilder, private translate: TranslateService) {

    this.formGroup = this.formBuilder.group({
      myLang: ['', [Validators.required]],
      myNotificationsPush: ['', [Validators.required]],
    });

    if(api.dataUser.options) {
        this.formGroup = this.formBuilder.group({
          myLang: [api.dataUser.options.lang, [Validators.required]],
          myNotificationsPush: [(api.dataUser.options.notifications_push == 1 ? true:false), [Validators.required]],
        });
    }

    this.myLang = this.formGroup.controls['myLang'];
    this.myNotificationsPush = this.formGroup.controls['myNotificationsPush'];

  }

  ionViewDidEnter() {
    console.log("SettingsOptions Page");
    this.api.currentPage = "SettingsOptionsPage";
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

  doSave() {

      if (this.formGroup.valid) {

          this.api.editOptions(this.formGroup.get("myLang").value, this.formGroup.get("myNotificationsPush").value).then(data => {
            console.log('data', data);
            this.api.getToast(data.response);
            if(data.type == "success") {

                this.api.dataUser.options = data.data.options;
                this.api.storage.set('dataUser', this.api.dataUser);
                
                this.formGroup = this.formBuilder.group({
                  myLang: [this.api.dataUser.options.lang, [Validators.required]],
                  myNotificationsPush: [(this.api.dataUser.options.notifications_push == 1 ? true:false), [Validators.required]],
                });

                // Lang
                if(this.formGroup.get("myLang").value == "en" || this.formGroup.get("myLang").value == "fr") {
                  this.translate.setDefaultLang(this.formGroup.get("myLang").value);
                  this.translate.use(this.formGroup.get("myLang").value);
                  this.api.storage.set('lang', this.formGroup.get("myLang").value);
                }

            }
            
          }, error => {
            this.api.getToast("Error #APPSETSET");
            console.log(error);
          });    
                  
      }

  }

}
