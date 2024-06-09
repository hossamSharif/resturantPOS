import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalessndPage } from './salessnd.page';

const routes: Routes = [
  {
    path: '',
    component: SalessndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalessndPageRoutingModule {}
