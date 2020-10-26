import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
//import Real Time fierpase
import{AngularFireDatabaseModule}from'@angular/fire/database';
//import Fierbase storage 
import { AngularFireStorageModule } from '@angular/fire/storage';
//Ionic Storage 
import { IonicStorageModule } from '@ionic/storage';
//Atho import
import {AngularFireAuthModule} from '@angular/fire/auth';
//import camera
import { Camera } from '@ionic-native/camera/ngx';
import {  IonTabs } from '@ionic/angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    AngularFireModule, //new for firebases
    AngularFireModule.initializeApp(environment.key),
    AngularFireDatabaseModule,//for DB
     AngularFireStorageModule, //for storage
    AngularFireAuthModule,//for Atho
    IonicModule.forRoot(), AppRoutingModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
     IonTabs,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
