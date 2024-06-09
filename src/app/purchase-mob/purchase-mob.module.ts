import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseMobPageRoutingModule } from './purchase-mob-routing.module';

import { PurchaseMobPage } from './purchase-mob.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    PurchaseMobPageRoutingModule
  ],
  declarations: [PurchaseMobPage]
})
export class PurchaseMobPageModule {}
