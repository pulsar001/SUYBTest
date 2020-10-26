import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameArrowSpacePage } from './game-arrow-space';

@NgModule({
  declarations: [
    GameArrowSpacePage,
  ],
  imports: [
    IonicPageModule.forChild(GameArrowSpacePage),
  ],
})
export class GameArrowSpacePageModule {}
