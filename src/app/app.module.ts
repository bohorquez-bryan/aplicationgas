import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {GooglePlus} from '@ionic-native/google-plus';
import {AngularFireModule} from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Facebook } from '@ionic-native/facebook';
import { Firebase } from '@ionic-native/firebase';

import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GasFirebaseProvider } from '../providers/gas-firebase/gas-firebase';

import { UserRegisterPageModule } from './../pages/user-register/user-register.module';
import { UserHomePageModule } from './../pages/user-home/user-home.module';
import { RegisterPageModule } from './../pages/register/register.module';
import { UserProfilePageModule } from '../pages/user-profile/user-profile.module';
import { OrderDetailsPageModule } from './../pages/order-details/order-details.module';
import { DistribuidorPageModule } from './../pages/distribuidor/distribuidor.module';
import { UserOrdersPageModule } from '../pages/user-orders/user-orders.module';

export const firebaseConfig = {
  /*
  apiKey: "AIzaSyA8_3_dFc0w1VWtPbJEfLyR041qwiq9tOg",
  authDomain: "appgas-a01de.firebaseapp.com",
  databaseURL: "https://appgas-a01de.firebaseio.com",
  projectId: "appgas-a01de",
  storageBucket: "appgas-a01de.appspot.com",
  messagingSenderId: "697976661645"*/

  apiKey: "AIzaSyA19XXcMRDBoTp1Ob8adKEBeDssB_YZ0bY",
  authDomain: "tesisappgas.firebaseapp.com",
  databaseURL: "https://tesisappgas.firebaseio.com",
  projectId: "tesisappgas",
  storageBucket: "tesisappgas.appspot.com",
  messagingSenderId: "800966370931"

}

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    UserHomePageModule,
    UserRegisterPageModule,
    RegisterPageModule,
    DistribuidorPageModule,
    OrderDetailsPageModule,
    UserOrdersPageModule,
    UserProfilePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    AngularFireAuth,
    Facebook,
    GasFirebaseProvider,
    Geolocation,
    Diagnostic,
    LocationAccuracy,
    Firebase,
    LocalNotifications
  ]
})
export class AppModule {}

