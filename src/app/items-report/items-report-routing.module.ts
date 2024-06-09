import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsReportPage } from './items-report.page';

const routes: Routes = [
  {
    path: '',
    component: ItemsReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsReportPageRoutingModule {}
