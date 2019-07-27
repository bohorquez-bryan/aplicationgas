import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistribuidorPage } from './distribuidor';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    DistribuidorPage,
  ],
  imports: [
    IonicPageModule.forChild(DistribuidorPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4gmYz_ugqt2QSlw3EBBeYRWIJYI_ZK0o'
    })
  ],
})
export class DistribuidorPageModule {}
