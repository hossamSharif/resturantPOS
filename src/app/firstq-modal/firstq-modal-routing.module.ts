import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstqModalPage } from './firstq-modal.page';

const routes: Routes = [
  {
    path: '',
    component: FirstqModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstqModalPageRoutingModule {}
