import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsSerarchPage } from './items-serarch.page';

const routes: Routes = [
  {
    path: '',
    component: ItemsSerarchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsSerarchPageRoutingModule {}
