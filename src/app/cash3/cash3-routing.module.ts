import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Cash3Page } from './cash3.page';

const routes: Routes = [
  {
    path: '',
    component: Cash3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Cash3PageRoutingModule {}
