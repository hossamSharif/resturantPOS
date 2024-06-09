import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrchOrderRecordPage } from './prch-order-record.page';

const routes: Routes = [
  {
    path: '',
    component: PrchOrderRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrchOrderRecordPageRoutingModule {}
