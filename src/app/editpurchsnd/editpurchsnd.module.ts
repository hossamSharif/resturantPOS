import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditpurchsndPageRoutingModule } from './editpurchsnd-routing.module';

import { EditpurchsndPage } from './editpurchsnd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditpurchsndPageRoutingModule
  ],
  declarations: [EditpurchsndPage]
})
export class EditpurchsndPageModule {}
