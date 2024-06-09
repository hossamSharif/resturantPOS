import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemModalPage } from './item-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ItemModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemModalPageRoutingModule {}
