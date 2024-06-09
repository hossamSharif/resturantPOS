import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPerchPage } from './edit-perch.page';

const routes: Routes = [
  {
    path: '',
    component: EditPerchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPerchPageRoutingModule {}
