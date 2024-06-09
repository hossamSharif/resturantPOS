import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesRecordPageRoutingModule } from './sales-record-routing.module';

import { SalesRecordPage } from './sales-record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesRecordPageRoutingModule
  ],
  declarations: [SalesRecordPage]
})
export class SalesRecordPageModule {}
