import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSalesPageRoutingModule } from './edit-sales-routing.module';

import { EditSalesPage } from './edit-sales.page'; 
import { ShareModule } from '../shareModule/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareModule, 
    EditSalesPageRoutingModule
  ],
  exports: [ ],
  declarations: [EditSalesPage]
})
export class EditSalesPageModule {}
