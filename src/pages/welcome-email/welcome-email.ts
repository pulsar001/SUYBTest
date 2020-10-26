import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the WelcomeEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "WelcomeEmailPage",
  segment: "welcome-email",
  defaultHistory: ['WelcomePage']
})
@Component({
  selector: 'page-welcome-email',
  templateUrl: 'welcome-email.html',
})
export class WelcomeEmailPage {

  formGroup: FormGroup;

  myEmail: AbstractControl;
  nextData;

  nextPage = "WelcomePasswordPage";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public statusBar: StatusBar,
    public api: UserProvider, public formBuilder: FormBuilder
    ) {

      this.formGroup = this.formBuilder.group({
        myEmail: ['', [Validators.required, Validators.minLength(2)]],
      });
  
      this.myEmail = this.formGroup.controls['myEmail'];

      this.nextData = navParams.get('data');
      if(this.nextData) {

        this.formGroup = this.formBuilder.group({
          myEmail: [this.nextData.email, [Validators.compose([Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]],
        });

      }

      console.log("nextData", this.nextData);

  }

  ionViewDidEnter() {
    console.log("WelcomeEmail Page");
    this.api.currentPage = "WelcomeEmailPage";

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

      this.nextData.email = this.formGroup.get("myEmail").value;

      this.navCtrl.push(this.nextPage, {
        data: this.nextData
      });

  }



}
