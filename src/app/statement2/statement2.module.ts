import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Statement2PageRoutingModule } from './statement2-routing.module';

import { Statement2Page } from './statement2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Statement2PageRoutingModule
  ],
  declarations: [Statement2Page]
})
export class Statement2PageModule {}
