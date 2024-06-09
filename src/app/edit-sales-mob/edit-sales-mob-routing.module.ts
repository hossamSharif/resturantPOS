import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSalesMobPage } from './edit-sales-mob.page';

const routes: Routes = [
  {
    path: '',
    component: EditSalesMobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSalesMobPageRoutingModule {}
