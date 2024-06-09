import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Cash2Page } from './cash2.page';

const routes: Routes = [
  {
    path: '',
    component: Cash2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Cash2PageRoutingModule {}
