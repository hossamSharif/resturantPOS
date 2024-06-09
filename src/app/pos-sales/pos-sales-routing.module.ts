import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosSalesPage } from './pos-sales.page';

const routes: Routes = [
  {
    path: '',
    component: PosSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosSalesPageRoutingModule {}
