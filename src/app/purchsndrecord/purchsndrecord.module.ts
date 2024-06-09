import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchsndrecordPageRoutingModule } from './purchsndrecord-routing.module';

import { PurchsndrecordPage } from './purchsndrecord.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchsndrecordPageRoutingModule
  ],
  declarations: [PurchsndrecordPage]
})
export class PurchsndrecordPageModule {}
