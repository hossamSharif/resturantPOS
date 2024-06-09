import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BalanceSheetPageRoutingModule } from './balance-sheet-routing.module';

import { BalanceSheetPage } from './balance-sheet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceSheetPageRoutingModule
  ],
  declarations: [BalanceSheetPage]
})
export class BalanceSheetPageModule {}
