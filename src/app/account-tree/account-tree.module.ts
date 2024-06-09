import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountTreePageRoutingModule } from './account-tree-routing.module';

import { AccountTreePage } from './account-tree.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountTreePageRoutingModule
  ],
  declarations: [AccountTreePage]
})
export class AccountTreePageModule {}
