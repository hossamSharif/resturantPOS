import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsSerarchPageRoutingModule } from './items-serarch-routing.module';

import { ItemsSerarchPage } from './items-serarch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsSerarchPageRoutingModule
  ],
  declarations: [ItemsSerarchPage]
})
export class ItemsSerarchPageModule {}
