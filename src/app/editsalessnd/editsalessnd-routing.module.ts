import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditsalessndPage } from './editsalessnd.page';

const routes: Routes = [
  {
    path: '',
    component: EditsalessndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditsalessndPageRoutingModule {}
