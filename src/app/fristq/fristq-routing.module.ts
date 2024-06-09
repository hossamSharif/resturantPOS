import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FristqPage } from './fristq.page';

const routes: Routes = [
  {
    path: '',
    component: FristqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FristqPageRoutingModule {}
