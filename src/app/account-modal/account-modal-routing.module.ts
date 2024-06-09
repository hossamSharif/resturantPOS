import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountModalPage } from './account-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AccountModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountModalPageRoutingModule {}
