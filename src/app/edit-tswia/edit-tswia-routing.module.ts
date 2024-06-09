import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTswiaPage } from './edit-tswia.page';

const routes: Routes = [
  {
    path: '',
    component: EditTswiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTswiaPageRoutingModule {}
