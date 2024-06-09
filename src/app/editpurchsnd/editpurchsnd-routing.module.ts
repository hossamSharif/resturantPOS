import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditpurchsndPage } from './editpurchsnd.page';

const routes: Routes = [
  {
    path: '',
    component: EditpurchsndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditpurchsndPageRoutingModule {}
