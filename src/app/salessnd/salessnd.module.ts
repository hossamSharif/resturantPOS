import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalessndPageRoutingModule } from './salessnd-routing.module';

import { SalessndPage } from './salessnd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalessndPageRoutingModule
  ],
  declarations: [SalessndPage]
})
export class SalessndPageModule {}
