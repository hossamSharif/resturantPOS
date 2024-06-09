import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule  } from '@angular/common/http'; 
import { DatePipe } from '@angular/common';
import { AuthGaurdService} from './auth/auth-gaurd.service';
import { AuthServiceService } from './auth/auth-service.service';
import {IonicStorageModule  } from '@ionic/storage-angular';
import { SelectAllDirective } from './select-all.directive'; 
import { CommonModule } from '@angular/common'; 
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { ShareModule } from './shareModule/share-module/share-module.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [AppComponent, SelectAllDirective ],
  entryComponents: [],
  imports: [BrowserModule,CommonModule,ShareModule,HttpClientModule, IonicModule.forRoot(),IonicStorageModule.forRoot(), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the app is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
  })], 
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },DatePipe,AuthServiceService,AuthGaurdService,FileOpener ,File],
  bootstrap: [AppComponent],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
