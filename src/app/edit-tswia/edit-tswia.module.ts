import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTswiaPageRoutingModule } from './edit-tswia-routing.module';

import { EditTswiaPage } from './edit-tswia.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    EditTswiaPageRoutingModule
  ],
  declarations: [EditTswiaPage]
})
export class EditTswiaPageModule {}
