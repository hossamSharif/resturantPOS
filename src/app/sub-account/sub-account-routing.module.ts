import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubAccountPage } from './sub-account.page';

const routes: Routes = [
  {
    path: '',
    component: SubAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubAccountPageRoutingModule {}
