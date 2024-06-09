import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpendsRecodPageRoutingModule } from './spends-recod-routing.module';

import { SpendsRecodPage } from './spends-recod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpendsRecodPageRoutingModule
  ],
  declarations: [SpendsRecodPage]
})
export class SpendsRecodPageModule {}
