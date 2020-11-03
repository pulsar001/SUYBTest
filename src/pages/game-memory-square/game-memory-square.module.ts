import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameMemorySquarePage } from './game-memory-square';

@NgModule({
  declarations: [
    GameMemorySquarePage,
  ],
  imports: [
    IonicPageModule.forChild(GameMemorySquarePage),
  ],
})
export class GameMemorySquarePageModule {}
