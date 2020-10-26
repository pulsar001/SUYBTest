import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsOptionsPage } from './settings-options';

@NgModule({
  declarations: [
    SettingsOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsOptionsPage),
  ],
})
export class SettingsOptionsPageModule {}
