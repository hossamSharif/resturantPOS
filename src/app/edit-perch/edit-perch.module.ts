import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPerchPageRoutingModule } from './edit-perch-routing.module';

import { EditPerchPage } from './edit-perch.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    EditPerchPageRoutingModule
  ],
  declarations: [EditPerchPage]
})
export class EditPerchPageModule {}
