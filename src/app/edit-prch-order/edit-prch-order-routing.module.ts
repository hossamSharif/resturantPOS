import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPrchOrderPage } from './edit-prch-order.page';

const routes: Routes = [
  {
    path: '',
    component: EditPrchOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPrchOrderPageRoutingModule {}
