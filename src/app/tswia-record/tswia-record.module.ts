import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TswiaRecordPageRoutingModule } from './tswia-record-routing.module';

import { TswiaRecordPage } from './tswia-record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TswiaRecordPageRoutingModule
  ],
  declarations: [TswiaRecordPage]
})
export class TswiaRecordPageModule {}
