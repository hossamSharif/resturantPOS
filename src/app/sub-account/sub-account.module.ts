import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubAccountPageRoutingModule } from './sub-account-routing.module';

import { SubAccountPage } from './sub-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubAccountPageRoutingModule
  ],
  declarations: [SubAccountPage]
})
export class SubAccountPageModule {}
