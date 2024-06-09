import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Statement2Page } from './statement2.page';

const routes: Routes = [
  {
    path: '',
    component: Statement2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Statement2PageRoutingModule {}
