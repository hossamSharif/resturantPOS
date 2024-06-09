import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "./pipe";
import { IonicModule } from '@ionic/angular'; 
import { SpendRecord2PageRoutingModule } from './spend-record2-routing.module'; 
import { SpendRecord2Page } from './spend-record2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpendRecord2PageRoutingModule
  ],
  declarations: [SpendRecord2Page,  FilterPipe],
  exports:[FilterPipe]

})
export class SpendRecord2PageModule {}
