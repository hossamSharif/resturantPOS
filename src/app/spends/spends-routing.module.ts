import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpendsPage } from './spends.page';

const routes: Routes = [
  {
    path: '',
    component: SpendsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpendsPageRoutingModule {}
