import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsEmailPage } from './settings-email';

@NgModule({
  declarations: [
    SettingsEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsEmailPage),
  ],
})
export class SettingsEmailPageModule {}
