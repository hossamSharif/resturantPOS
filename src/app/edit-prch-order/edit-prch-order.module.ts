import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPrchOrderPageRoutingModule } from './edit-prch-order-routing.module';

import { EditPrchOrderPage } from './edit-prch-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPrchOrderPageRoutingModule
  ],
  declarations: [EditPrchOrderPage]
})
export class EditPrchOrderPageModule {}
