import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FristqPageRoutingModule } from './fristq-routing.module';

import { FristqPage } from './fristq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FristqPageRoutingModule
  ],
  declarations: [FristqPage]
})
export class FristqPageModule {}
