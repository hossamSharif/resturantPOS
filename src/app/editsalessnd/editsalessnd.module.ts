import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditsalessndPageRoutingModule } from './editsalessnd-routing.module';

import { EditsalessndPage } from './editsalessnd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditsalessndPageRoutingModule
  ],
  declarations: [EditsalessndPage]
})
export class EditsalessndPageModule {}
