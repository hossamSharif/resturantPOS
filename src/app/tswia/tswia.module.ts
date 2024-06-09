import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { TswiaPageRoutingModule } from './tswia-routing.module'; 
import { TswiaPage } from './tswia.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    IonicModule,
    TswiaPageRoutingModule
  ],
  declarations: [TswiaPage]
})
export class TswiaPageModule {}
