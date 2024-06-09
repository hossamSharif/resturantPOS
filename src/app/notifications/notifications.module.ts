import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular'; 
import { NotificationsPageRoutingModule } from './notifications-routing.module'; 
import { NotificationsPage } from './notifications.page';
import { ShareModule } from '../shareModule/share-module/share-module.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    ShareModule,
    NotificationsPageRoutingModule
  ],
  declarations: [NotificationsPage],
  exports:[]
})
export class NotificationsPageModule {}
