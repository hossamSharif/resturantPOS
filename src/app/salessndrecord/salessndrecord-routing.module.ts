import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalessndrecordPage } from './salessndrecord.page';

const routes: Routes = [
  {
    path: '',
    component: SalessndrecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalessndrecordPageRoutingModule {}
