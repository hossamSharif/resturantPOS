import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubAccount2Page } from './sub-account2.page';

const routes: Routes = [
  {
    path: '',
    component: SubAccount2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubAccount2PageRoutingModule {}
