import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Cash2PageRoutingModule } from './cash2-routing.module'; 
import { Cash2Page } from './cash2.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    Cash2PageRoutingModule
  ],
  declarations: [Cash2Page]
})
export class Cash2PageModule {}
