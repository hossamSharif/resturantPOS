import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseMobPage } from './purchase-mob.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseMobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseMobPageRoutingModule {}
