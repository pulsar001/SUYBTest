import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { ToastController, AlertController, Alert, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import CryptoJS from 'crypto-js';

interface AppConfigResponse {
  version:string;
}

interface UserResponse {
  type: string;
  response: string;
  data: any;
}

interface DataUserResponse {
  info: any;
  options: any;
  photos: any;
  position: any;
  profile: any;
  stats: any;
  helper: any;
  push_notifications:any;
}


@Injectable()
export class UserProvider {

  isConnected:boolean;
  isApp:boolean = true;
  hashPassword:string;

  currentPage:string;
  dashboardPage:string = "DashboardPage"; // page after connect
  loginPage:string = "WelcomePage"; // login

  apiKey:string = '';

  // apiLink:string = 'http://192.168.1.100/HelpersApi/';
  // avatarLink:string = 'http://192.168.1.100/HelpersApi/imgs/avatars/';
  // updateLink:string = 'http://192.168.1.100/HelpersApi/update_app/update.xml';
  // pagesLink:string = 'http://192.168.1.100/HelpersApi/pages/';

  apiLink:string = 'https://api.becomehelper.com/';
  avatarLink:string = 'https://api.becomehelper.com/imgs/avatars/';
  updateLink:string = 'https://api.becomehelper.com/update_app/update.xml';
  pagesLink:string = 'https://api.becomehelper.com/pages/';

  dataUser:DataUserResponse;

  loader:any;

  appConfig:AppConfigResponse;

  httpHeaders = new HttpHeaders();

  constructor(private http: HttpClient,
              public https: HTTP,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public storage: Storage,
              private inAppBrowser: InAppBrowser,
              public ga: GoogleAnalytics,
              public loadingCtrl: LoadingController,
              public platform: Platform,
              ) {

                if(this.platform.is('core') || this.platform.is('mobileweb')) {
                  this.isApp = false;
                } else {
                  this.isApp = true;
                }

                // https.setSSLCertMode('pinned').then(function() {
                //   console.log('SSL', 'success!');
                // })
                // .catch(e => console.log('Error SSL', e));

                console.log('Api Provider');

                this.httpHeaders.set('Access-Control-Allow-Origin', '*');


  }

  // Google Analytics
  GA(page:string, user:string='') {
    this.ga.startTrackerWithId('UA-125030441-1')
   .then(() => {
     console.log('Google analytics is ready now');
      this.ga.trackView(page, user);
      this.ga.setUserId(user);
     // Tracker is ready
     // You can now track pages or set additional information such as AppVersion or UserId
   })
   .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  // Sha256
  SHA1(text:string) {
    return CryptoJS.SHA256(text).toString();
  }

  // // Storage User is connected
  // connectUser() {
  //   return new Promise(resolve => {
  //       this.isConnected = true;
  //       this.storage.set('isConnected', true);
  //       resolve();
  //   });
  // }

  // // Storage user is not connected
  // disconnectUser() {
  //   return new Promise(resolve => {
  //       this.isConnected = false;
  //       this.storage.set('isConnected', false);
  //       resolve();
  //   });
  // }



  // Toast
  getToast(data:string) {
    const toast = this.toastCtrl.create({
      message: data,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  // Loader
  startLoading(text:string="Loading Please Wait...", timer:number=60000) {
    this.loader = this.loadingCtrl.create({
      content: text,
      duration: timer,
      enableBackdropDismiss: true
    });
    this.loader.present();
  }
  stopLoading() {
    this.loader.dismiss();
  }

  // Copy input
  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.getToast("Copied");
  }

  // Popup alert
  getAlert(title:string, data:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: data,
      buttons: ['Close']
    });
    alert.present();
  }

  // Browser url
  getUrl(url:string) {

    if(this.isApp == true) {
      const options: InAppBrowserOptions = {
        zoom: 'no',
        hideurlbar: 'yes',
        hidenavigationbuttons: 'yes',
        toolbarcolor: '#ffd520',
        closebuttoncolor: '#000000',

      }

      const browser = this.inAppBrowser.create(url, '_self', options);
    }
    else {
      var win = window.open(url, '_blank');
      win.focus();
    }

  }

  // Init App
  initApp() {

    return new Promise(resolve => {

      // Data
      this.storage.get('appConfig').then((val) => {
        this.appConfig = val;
        resolve();
      },
      error => {
      });

    });

  }

  // Init user
  initUser() {

    return new Promise(resolve => {
      let thenPromise = [];
      let thenData = [];

      thenPromise.push(
        // Data
        this.storage.get('dataUser').then((val) => {
          thenData['dataUser'] = val;
        }),
        // Connect 
        this.storage.get('isConnected').then((val) => {
          thenData['isConnected'] = val;
        })
      );
      
      Promise.all(thenPromise).then(() => {

        this.dataUser = thenData['dataUser'];
        
        if(thenData['dataUser']) this.isConnected = true;
        else this.isConnected = false;

        // error formatage: reinitialise
        if(this.isConnected === true && typeof this.dataUser.info === 'undefined') {
          console.log("REINIT");
            this.disconnectUser();
            this.isConnected = false;
        }
        
        resolve();
        return true;
      },
      error => {
        return false;
      });

    });
  
  }

  // disconnect user
  disconnectUser() {

    return new Promise(resolve => {
      let thenPromise = [];

      thenPromise.push(
        // Data
        this.storage.set('isConnected', false).then(),
        // Connect 
        this.storage.set('dataUser', "").then()
      );
      
      Promise.all(thenPromise).then(() => {

        this.isConnected = false;
        
        resolve();
        return true;
      },
      error => {
        return false;
      });

    });

  }

  getRank(exp, total) {
    return +((((+exp / 20) * 100) / (+total)) / 10).toFixed(1);
  }

  // API
  // ----------------------------------------------------



  // Edit profile
  editProfile(firstName:string='', lastName:string='', phone:string='', bday:string, info:string, id_avatar:string='') {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=edit_profile&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "first_name": firstName,
          "last_name": lastName,
          "phone": phone,
          "bday": bday,
          "info": info,
          "id_avatar": id_avatar
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Edit helper
  editHelper(active:string='', info:string='') {

    this.startLoading();
    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=edit_helper&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "active": active,
          "info": info,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
        this.stopLoading();
      }, err => {
        console.log(err);
      });
    });
  }

  // Edit needer
  editNeeder(active:string='', info:string='') {

    this.startLoading();
    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=edit_needer&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "active": active,
          "info": info,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
        this.stopLoading();
      }, err => {
        console.log(err);
      });
    });
  }

  // New user
  register(email:string, password:string, social={}) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=register&app=1',
        {
          "timestamp": Date.now(),
          "email": email,
          "pwd": password,
          "social": social
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  // Login
  login(email:string, password:string) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=login&app=1',
        {
          "timestamp": Date.now(),
          "email": email,
          "pwd": password
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Login with Social
  loginSocial(id:string, type:string) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=login_social&app=1',
        {
          "timestamp": Date.now(),
          "id": id,
          "type": type
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Check if user exist
  checkIfExist(email:string) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=check_if_exist&app=1',
        {
          "timestamp": Date.now(),
          "email": email,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Password Lost
  passwordLost(type:string, data:object, params:string='') {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=' + type + (params ? '&' + params:'') + '&app=1',
        {
          "timestamp": Date.now(),
          "data": data,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  

  // Update Push Notifications
  updatePushNotifications(id_push_os) {

      return new Promise<UserResponse>(resolve => {
        this.http.post<UserResponse>(
          this.apiLink + '?requestAction=update_push_notifications&requestId=' + this.dataUser.info.key_pub + '&app=1',
          {
            "timestamp": Date.now(),
            "id_push_os": id_push_os
          },
          { headers: this.httpHeaders }
        )
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
      });
  
  }


  // Update GEO position
  updatePosition(lat, lng) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=update_position&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "lat": lat,
          "lng": lng
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  // Get users position radius 20km (config)
  getUsersPosition(lat, lng) {

    
    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=get_users_position&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "lat": lat,
          "lng": lng
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getUserProfile(id_profile) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=get_user_profile&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "id_profile": id_profile
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  newMission(id_profile, type, message) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=new_mission&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          id_profile: id_profile,
          type: type,
          message: message,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  checkMission(id_profile, id_mission='') {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=check_mission&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          id_profile: id_profile,
          id_mission: id_mission,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  editMission(id_mission, option) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=options_mission&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          id_mission: id_mission,
          option: option,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getMissions() {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=get_missions&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getNotifications() {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=get_notifications&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getMessages(type, id_type) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=get_messages&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "type": type,
          "id_type": id_type
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  sendMessageMission(id_mission, message) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=send_message_mission&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "message": message,
          "id_mission": id_mission,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  sendMessage(message, id_receiver, id_type, type) {

      return new Promise<UserResponse>(resolve => {
        this.http.post<UserResponse>(
          this.apiLink + '?requestAction=send_message&requestId=' + this.dataUser.info.key_pub + '&app=1',
          {
            "timestamp": Date.now(),
            "message": message,
            "id_receiver": id_receiver,
            "id_type": id_type,
            "type": type
          },
          { headers: this.httpHeaders }
        )
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
      });
  
  }

  getStats() {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=get_stats&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  // Edit Options
  editOptions(lang, notifications_push) {

    this.startLoading();
    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=edit_options&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "lang": lang,
          "notifications_push": notifications_push,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
        this.stopLoading();
      }, err => {
        console.log(err);
      });
    });
  }

  // Update User Data
  updateUserData(lat, lng) {

    return new Promise<UserResponse>(resolve => {
      this.http.post<UserResponse>(
        this.apiLink + '?requestAction=update_user_data&requestId=' + this.dataUser.info.key_pub + '&app=1',
        {
          "timestamp": Date.now(),
          "lat": lat,
          "lng": lng,
        },
        { headers: this.httpHeaders }
      )
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

    // Send Request
    sendRequest(action, data = {}, loading=false, confirmation=false, login=true) {

      var timestamp = Date.now();
      if(loading) this.startLoading();
 
      return new Promise<any>(resolve => {

        if(confirmation === true) 
        {

          let alert = this.alertCtrl.create({
              title: 'Confirmation',
              message: 'Es-tu sur de vouloir continuer ?',
              buttons: [
                  {
                      text: 'Non',
                      handler: () => {
                            if(loading) this.stopLoading();
                      }
                  },
                  {
                      text: 'Oui',
                      handler: () => {

                          this.http.post<any>(
                            this.apiLink + '?requestAction=' + action + (login === true ? '&requestId=' + this.dataUser.info.key_pub : '') + '&app=1&timestamp=' + timestamp, data,
                            { headers: this.httpHeaders }
                          )
                          .subscribe(data => {
                            if(loading) this.stopLoading();
                            resolve(data);
                          }, err => {
                            if(loading) this.stopLoading();
                            console.log(err);
                          });
                        
                      }
                  }
              ]
          });
          alert.present();

        }
        else 
        {

              this.http.post<any>(
                this.apiLink + '?requestAction=' + action + (login === true ? '&requestId=' + this.dataUser.info.key_pub : '') + '&app=1&timestamp=' + timestamp, data,
                { headers: this.httpHeaders }
              )
              .subscribe(data => {
                if(loading) this.stopLoading();
                resolve(data);
              }, err => {
                if(loading) this.stopLoading();
                console.log(err);
              });

        }

      });


    }

    
}

