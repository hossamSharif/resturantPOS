import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesMobPage } from './sales-mob.page';

const routes: Routes = [
  {
    path: '',
    component: SalesMobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesMobPageRoutingModule {}
