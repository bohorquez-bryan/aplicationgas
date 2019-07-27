import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRegisterPage } from './user-register';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    UserRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRegisterPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4gmYz_ugqt2QSlw3EBBeYRWIJYI_ZK0o'
    })
  ],
})
export class UserRegisterPageModule {}
