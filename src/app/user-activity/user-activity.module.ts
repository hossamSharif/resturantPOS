import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 
import { UserActivityPageRoutingModule } from './user-activity-routing.module';
import { ShareModule } from '../shareModule/share-module/share-module.module';
import { UserActivityPage } from './user-activity.page';
import { FilterPipe } from './pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareModule,
    UserActivityPageRoutingModule
  ],
  declarations: [UserActivityPage,  FilterPipe],
  exports:[FilterPipe]
})
export class UserActivityPageModule {}
