import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserHomePage } from './user-home';

import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    UserHomePage,
  ],
  imports: [
    IonicPageModule.forChild(UserHomePage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4gmYz_ugqt2QSlw3EBBeYRWIJYI_ZK0o'
    })
  ],
})
export class UserHomePageModule {}
