import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchasePageRoutingModule } from './purchase-routing.module';

import { PurchasePage } from './purchase.page'; 
import { ShareModule } from '../shareModule/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    PurchasePageRoutingModule
  ],
  exports: [],
  declarations: [PurchasePage]
})
export class PurchasePageModule {}
