import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Cash3PageRoutingModule } from './cash3-routing.module';

import { Cash3Page } from './cash3.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    Cash3PageRoutingModule
  ],
  declarations: [Cash3Page]
})
export class Cash3PageModule {}
