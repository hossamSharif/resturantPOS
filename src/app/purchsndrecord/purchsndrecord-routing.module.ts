import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchsndrecordPage } from './purchsndrecord.page';

const routes: Routes = [
  {
    path: '',
    component: PurchsndrecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchsndrecordPageRoutingModule {}
