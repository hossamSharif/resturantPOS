import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceSheetPage } from './balance-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: BalanceSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceSheetPageRoutingModule {}
