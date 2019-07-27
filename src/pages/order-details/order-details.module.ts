import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailsPage } from './order-details';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    OrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailsPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA4gmYz_ugqt2QSlw3EBBeYRWIJYI_ZK0o'
    })
  ],
})
export class OrderDetailsPageModule {}
