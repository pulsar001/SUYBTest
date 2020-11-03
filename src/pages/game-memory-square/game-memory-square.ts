import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the GameMemorySquarePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-memory-square',
  templateUrl: 'game-memory-square.html',
})
export class GameMemorySquarePage {

  matrix = [];

  matrixX:number = 2;
  matrixY:number = 2;
  matrixMin:number = 2;
  matrixWidth:number = 100;

  gameTuto:number = 1;
  gameTimer:number;
  gameScore:number = 0;
  gameInterval1:any;
  gameMessage:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public statusBar: StatusBar, public api: UserProvider) {
  }

  ionViewDidEnter() {
    console.log("GameMemorySquare Page");
    this.api.currentPage = "GameMemorySquarePage";
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

  
  gameInit() {

    this.newMatrix();
    console.log("matrix", this.matrix);

  }

  newMatrix() {

    let matrixTotal = 0;
    for(var x = 0; x <= this.matrixX; x++) {

        this.matrix[x] = [];

        for(var y = 0; y < this.matrixY; y++) {

            this.matrix[x][y] = ((Math.floor(Math.random() * 2) + 1) - 1);
            matrixTotal += this.matrix[x][y];

        }

    }

    if(matrixTotal < this.matrixMin) this.newMatrix();

    this.matrixWidth = parseFloat((99/this.matrixX).toFixed(3));

  }

  levelUp() {

    if(this.matrixY > this.matrixX) this.matrixX++;
    else this.matrixY++;

  }

  levelDown() {

    if(this.matrixY > this.matrixX) this.matrixY--;
    else this.matrixX--;

  }


}
