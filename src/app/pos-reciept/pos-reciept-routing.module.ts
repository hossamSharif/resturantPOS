import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosRecieptPage } from './pos-reciept.page';

const routes: Routes = [
  {
    path: '',
    component: PosRecieptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosRecieptPageRoutingModule {}
