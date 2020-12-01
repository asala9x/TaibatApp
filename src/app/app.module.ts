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
import { AngularFireDatabaseModule } from '@angular/fire/database';
//import Fierbase storage 
import { AngularFireStorageModule } from '@angular/fire/storage';
//Ionic Storage 
//Atho import
import { AngularFireAuthModule } from '@angular/fire/auth';
//import camera
import { Camera } from '@ionic-native/camera/ngx';
import { IonTabs } from '@ionic/angular';
//map
import { Geolocation } from '@ionic-native/geolocation/ngx';
//sms
import { SMS } from '@ionic-native/sms/ngx';
import { HttpClientModule } from '@angular/common/http';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { PopoverComponentPageModule } from './../app/pages/popover/popover-component/popover-component.module';
import { CustomerPopoverPageModule } from './pages/popover/customer-popover/customer-popover.module';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule, 
        HttpClientModule,
        IonicModule.forRoot(), 
        AppRoutingModule,
        PopoverComponentPageModule,
        CustomerPopoverPageModule,
        AngularFireModule, //new for firebases
        AngularFireModule.initializeApp(environment.key),
        AngularFireDatabaseModule,//for DB
        AngularFireStorageModule, //for storage
        AngularFireAuthModule,//for Atho
        
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        Camera,
        SpeechRecognition,
        IonTabs,
        SMS,
        EmailComposer,
        NativeStorage,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
