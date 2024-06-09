import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstqModalPageRoutingModule } from './firstq-modal-routing.module';

import { FirstqModalPage } from './firstq-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirstqModalPageRoutingModule
  ],
  declarations: [FirstqModalPage]
})
export class FirstqModalPageModule {}
