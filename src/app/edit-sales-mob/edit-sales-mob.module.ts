import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSalesMobPageRoutingModule } from './edit-sales-mob-routing.module';

import { EditSalesMobPage } from './edit-sales-mob.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    EditSalesMobPageRoutingModule
  ],
  declarations: [EditSalesMobPage]
})
export class EditSalesMobPageModule {}
