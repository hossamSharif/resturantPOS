import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchsndPageRoutingModule } from './purchsnd-routing.module';

import { PurchsndPage } from './purchsnd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchsndPageRoutingModule
  ],
  declarations: [PurchsndPage]
})
export class PurchsndPageModule {}
