import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrchOrderPageRoutingModule } from './prch-order-routing.module';

import { PrchOrderPage } from './prch-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrchOrderPageRoutingModule
  ],
  declarations: [PrchOrderPage]
})
export class PrchOrderPageModule {}
