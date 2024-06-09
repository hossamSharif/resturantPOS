import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PosRecieptPageRoutingModule } from './pos-reciept-routing.module';

import { PosRecieptPage } from './pos-reciept.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PosRecieptPageRoutingModule
  ],
  declarations: [PosRecieptPage]
})
export class PosRecieptPageModule {}
