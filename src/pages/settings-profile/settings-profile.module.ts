import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsProfilePage } from './settings-profile';

// import { ImagePicker } from '@ionic-native/image-picker';
// import { Crop } from '@ionic-native/crop';
// import { FileTransfer } from '@ionic-native/file-transfer';

import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/Camera';

@NgModule({
  declarations: [
    SettingsProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsProfilePage),
  ],
  providers: [
    // ImagePicker,
    // Crop,
    // FileTransfer
    Crop,
    Camera,
    File,
  ]
})
export class SettingsProfilePageModule {}
