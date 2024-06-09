import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchsndPage } from './purchsnd.page';

const routes: Routes = [
  {
    path: '',
    component: PurchsndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchsndPageRoutingModule {}
