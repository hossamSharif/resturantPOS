import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceSheet2PageRoutingModule } from './balance-sheet2-routing.module';

import { BalanceSheet2Page } from './balance-sheet2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceSheet2PageRoutingModule
  ],
  declarations: [BalanceSheet2Page]
})
export class BalanceSheet2PageModule {}
