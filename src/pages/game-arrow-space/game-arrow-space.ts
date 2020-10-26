import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the GameArrowSpacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-arrow-space',
  templateUrl: 'game-arrow-space.html',
})
export class GameArrowSpacePage {

  arrowStat:number;

  gameTuto:number = 1;
  gameTimer:number;
  gameScore:number = 0;
  gameInterval1:any;
  gameMessage:string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider) {
  }

  ionViewDidEnter() {
    console.log("ViewProfile Page");
    this.api.currentPage = "ViewProfilePage";
    //this.api.startLoading();

    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#222");
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

  gameExitTuto() {
    this.gameTuto = 0;
    this.gameInit();
  }

  randomArrow() {
    console.log('rand', (Math.floor(Math.random() * 2) + 1));
    return (Math.floor(Math.random() * 4) + 1);  
  }

  gameInit() {

    /*
    1: Left green
    2: Left red
    3: Right green
    4: Right red
    */

    // Timer speed
    if(this.gameScore <= 100)
      this.gameTimer = 3;
    else if(this.gameScore <= 200)
      this.gameTimer = 2;
    else
      this.gameTimer = 1;

    this.arrowStat = this.randomArrow();
    clearInterval(this.gameInterval1);
    this.gameInterval1 = setInterval(() => {
      this.arrowStat = this.randomArrow();
    }, this.gameTimer * 1000);

  }

  choseArrow(type:string) {
      let typeArrow:string;
      if(this.arrowStat == 1 || this.arrowStat == 2) typeArrow = 'l';
      else typeArrow = 'r';

      if(type == typeArrow)  {
        this.gameScore = this.gameScore + 10;
        this.gameMessage = "Win +10 points";
      }
      else {
        this.gameScore = this.gameScore - 10;
        if(this.gameScore <= 0) this.gameScore = 0;
        this.gameMessage = "Lose";
      }

      this.gameInit();
  }

}
