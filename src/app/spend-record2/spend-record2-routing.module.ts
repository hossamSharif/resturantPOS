import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpendRecord2Page } from './spend-record2.page';

const routes: Routes = [
  {
    path: '',
    component: SpendRecord2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpendRecord2PageRoutingModule {}
