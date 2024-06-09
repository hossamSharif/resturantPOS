import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountModalPageRoutingModule } from './account-modal-routing.module';

import { AccountModalPage } from './account-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountModalPageRoutingModule
  ],
  declarations: [AccountModalPage]
})
export class AccountModalPageModule {}
