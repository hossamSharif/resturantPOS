import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FilterPipe } from "./pipe";
import { FilterPipe2 } from "./pipe2";
import { FilterPipe3 } from "./pipe3";
import { SalesPageRoutingModule } from './sales-routing.module';
import { ShareModule } from "../shareModule/share-module/share-module.module";
import { SalesPage } from './sales.page'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    SalesPageRoutingModule
  ],
  declarations: 
  [
    SalesPage,
    FilterPipe,
    FilterPipe2,
    FilterPipe3
  ] ,
exports: [
  FilterPipe,
  FilterPipe2,
  FilterPipe3 
]
})
export class SalesPageModule {}
