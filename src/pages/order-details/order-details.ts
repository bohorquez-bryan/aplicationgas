import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {

  distriUid:any
  orderDetail:any
  userOrder:UserModel
  zone:any
  zoom:any
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,public afDb : GasFirebaseProvider) {

    this.zoom = 16;
    this.distriUid = this.navParams.get("uidDist");
    this.orderDetail = this.navParams.get("order");
    this.zone = this.navParams.get("zone");
    this.afDb.getUserDataByUid(this.orderDetail.userUid).subscribe((user:UserModel)=>{
      this.userOrder = user
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailsPage');
    this.afDb.getOrderById(this.orderDetail,this.zone).subscribe((orderShow:Order)=>{
      if(orderShow.state == "Cancelado"){
        this.viewCtrl.dismiss({"response":"Cancelado"})
      }
    })
  }

  ignoreOrder(){
    this.viewCtrl.dismiss()
  } 

  acceptOrder(orderAccepted:any){
    orderAccepted.state = "Aceptado"
    orderAccepted.acceptedBy = this.distriUid
    delete orderAccepted.userData
    console.log(orderAccepted)
    this.afDb.acceptOrder(orderAccepted)
    .then(()=>{
      this.viewCtrl.dismiss({"response":"Aceptado"})
    })
    .catch((error)=>{
      console.log(error)
    })
  }

}
