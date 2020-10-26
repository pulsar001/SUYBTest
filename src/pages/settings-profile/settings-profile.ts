import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { StatusBar } from '@ionic-native/status-bar';

// import { ImagePicker } from '@ionic-native/image-picker';
// import { Crop } from '@ionic-native/crop';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { Camera, CameraOptions } from '@ionic-native/Camera';
import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';

interface UserResponse {
  type: string;
  response: string;
  data: any;
}

@IonicPage({
  name: "SettingsProfilePage",
  segment: "settings/profile",
  defaultHistory: ['SettingsPage']
})
@Component({
  selector: 'page-settings-profile',
  templateUrl: 'settings-profile.html',
})
export class SettingsProfilePage {

  formGroup: FormGroup;

  myFirstName: AbstractControl;
  myLastName: AbstractControl;
  myPhone: AbstractControl;
  myBday: AbstractControl;
  myInfo: AbstractControl;

  public event = {
    bday: '1990-02-19',
  }

  editInformationView = false;


  croppedImagepath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, 
    public platform: Platform, public statusBar: StatusBar, public api: UserProvider,
    // private imagePicker: ImagePicker,
    // private crop: Crop,
    // private transfer: FileTransfer,
    private camera: Camera,
    private crop: Crop,
    public actionSheetController: ActionSheetController,
    private file: File
    ) {

    this.formGroup = this.formBuilder.group({
      myFirstName: ['', [Validators.required, Validators.minLength(2)]],
      myLastName: [''],
      myPhone: [''],
      myBday: [''],
      myInfo: [''],
    });

    if(api.dataUser.profile) {
        this.formGroup = this.formBuilder.group({
          myFirstName: [api.dataUser.profile.first_name, [Validators.required, Validators.minLength(2)]],
          myLastName: [api.dataUser.profile.last_name],
          myPhone: [api.dataUser.profile.phone],
          myBday: [api.dataUser.profile.bday],
          myInfo: [api.dataUser.profile.info],
        });
    }

    this.myFirstName = this.formGroup.controls['myFirstName'];
    this.myLastName = this.formGroup.controls['myLastName'];
    this.myPhone = this.formGroup.controls['myPhone'];
    this.myBday = this.formGroup.controls['myBday'];
    this.myInfo = this.formGroup.controls['myInfo'];

  }

  
  ionViewDidEnter() {
    console.log("SettingsProfile Page");
    this.api.currentPage = "SettingsProfilePage";
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

        this.api.editProfile(this.formGroup.get("myFirstName").value, this.formGroup.get("myLastName").value, this.formGroup.get("myPhone").value, this.formGroup.get("myBday").value, this.formGroup.get("myInfo").value).then(data => {
          console.log('data', data);
          this.api.getToast(data.response);
          if(data.type == "success") {

              this.api.dataUser.profile = data.data.profile;
              this.api.storage.set('dataUser', this.api.dataUser);
              
              this.formGroup = this.formBuilder.group({
                myFirstName: [this.api.dataUser.profile.first_name, [Validators.required, Validators.minLength(2)]],
                myLastName: [this.api.dataUser.profile.last_name],
                myPhone: [this.api.dataUser.profile.phone],
                myBday: [this.api.dataUser.profile.bday],
                myInfo: [this.api.dataUser.profile.info],
              });
          }
          
        }, error => {
          this.api.getToast("Error #APPSETPRO");
          console.log(error);
        });    
                
    }

  }
  
  editInformation() {
   
      if(this.editInformationView === true) this.editInformationView = false;
      else this.editInformationView = true;
    
  }

  // cropUpload() {
  //   this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
  //     for (let i = 0; i < results.length; i++) {
  //         console.log('Image URI: ' + results[i]);
  //         this.crop.crop(results[i], { quality: 100 })
  //           .then(
  //             newImage => {
  //               console.log('new image path is: ' + newImage);
  //               const fileTransfer: FileTransferObject = this.transfer.create();
  //               const uploadOpts: FileUploadOptions = {
  //                  fileKey: 'file',
  //                  //fileName: newImage.substr(newImage.lastIndexOf('/') + 1)
  //               };
  
  //               fileTransfer.upload(newImage, this.api.apiLink + '?requestAction=upload_avatar&requestId=' + this.api.dataUser.info.key_pub + '&app=1', uploadOpts)
  //                .then(<UserResponse>(data) => {
  //                  console.log("DATA OK", data);
                   
  //                  var resp = JSON.parse(data.response);
  //                  this.api.getToast(resp.response);
  //                  console.log("DATA OK", resp);

  //                  if(resp.data.path) {
  //                    this.api.dataUser.photos.profile_picture = resp.data.path;
  //                    this.api.storage.set('dataUser', this.api.dataUser);
  //                  }

  //                }, (err) => {
  //                  console.log(err);
  //                });
  //             },
  //             error => console.error('Error cropping image', error)
  //           );
  //     }
  //   }, (err) => { console.log(err); });
  // }


  
  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cropImage(imageData)
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {

    this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);

    // const actionSheet = await this.actionSheetController.create({
    //   title: "Select Image source",
    //   buttons: [{
    //     text: 'Load from Library',
    //     handler: () => {
    //       this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
    //     }
    //   },
    //   {
    //     text: 'Use Camera',
    //     handler: () => {
    //       this.pickImage(this.camera.PictureSourceType.CAMERA);
    //     }
    //   },
    //   {
    //     text: 'Cancel',
    //     role: 'cancel'
    //   }
    //   ]
    // });
    // await actionSheet.present();
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath = base64;
      this.isLoading = false;

      this.api.sendRequest('upload_avatar', {base64: base64}, true, false, true).then((data) => {
                    
                   console.log("DATA OK", data);
                   
                   this.api.getToast(data.response);
                   console.log("DATA OK", data);

                   if(data.data.path) {
                     this.api.dataUser.photos.profile_picture = data.data.path;
                     this.api.storage.set('dataUser', this.api.dataUser);
                   }

      })

    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

}
