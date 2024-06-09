import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TswiaRecordPage } from './tswia-record.page';

const routes: Routes = [
  {
    path: '',
    component: TswiaRecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TswiaRecordPageRoutingModule {}
