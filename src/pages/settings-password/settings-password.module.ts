import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPasswordPage } from './settings-password';

@NgModule({
  declarations: [
    SettingsPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPasswordPage),
  ],
})
export class SettingsPasswordPageModule {}
