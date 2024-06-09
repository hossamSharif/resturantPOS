import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPurchaseMobPage } from './edit-purchase-mob.page';

const routes: Routes = [
  {
    path: '',
    component: EditPurchaseMobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPurchaseMobPageRoutingModule {}
