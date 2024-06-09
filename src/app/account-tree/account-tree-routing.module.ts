import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountTreePage } from './account-tree.page';

const routes: Routes = [
  {
    path: '',
    component: AccountTreePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountTreePageRoutingModule {}
