import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseRecordPage } from './purchase-record.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRecordPageRoutingModule {}
