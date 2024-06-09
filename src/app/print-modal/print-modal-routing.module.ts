import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintModalPage } from './print-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PrintModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintModalPageRoutingModule {}
