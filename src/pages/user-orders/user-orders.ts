import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
import { GasFirebaseProvider } from '../../providers/gas-firebase/gas-firebase';

/**
 * Generated class for the UserOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-orders',
  templateUrl: 'user-orders.html',
})
export class UserOrdersPage {
  zone:any

  uidUser:any
  userData:UserModel;

  OrdersNorth:any;
  OrdersSouth:any;
  OrdersCenter:any;

  iconSoliN:any = 'ios-arrow-down';
  northShow:boolean = false;

  iconSoliC:any = 'ios-arrow-down';
  centerShow:boolean = false;
  

  iconSoliS:any = 'ios-arrow-down';
  southShow:boolean = false;

  constructor(public menuCtrl: MenuController,public afDb : GasFirebaseProvider, 
    public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.menuCtrl.enable(true, "menuGas");

    this.afDb.getSessionUser()
    .then((user)=>{
      this.uidUser = user.uid
        this.afDb.getUserDataByUid(user.uid)
        .subscribe((userData:any)=>{
          this.userData = userData;
        },(error)=>{
          console.log(error);
        })
        this.getAllOrders();
    }).catch((error)=>{
      console.log(error);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserOrdersPage');
  }

  getAllOrders(){
    console.log('Cargando ordenes');
    this.afDb.getOrdersUsersAccepted("Norte",this.uidUser).subscribe((ordersN)=>{
      ordersN.map((order:any)=>{
        this.afDb.getDistribuitorDataByUid(order.acceptedBy).subscribe((distri)=>{
          order.distriData = distri
        })
      })
      // funcion para ordenar de forma descendente 
      ordersN.sort((a, b) => Number(b.id) - Number(a.id))
      this.OrdersNorth = ordersN;
      console.log(this.OrdersNorth)
      this.northShow = true
    } ,(error)=>{
      console.log(error);
    })

    this.afDb.getOrdersUsersAccepted("Centro",this.uidUser).subscribe((ordersC)=>{
      ordersC.map((order:any)=>{
        this.afDb.getDistribuitorDataByUid(order.acceptedBy).subscribe((distri)=>{
          order.distriData = distri
        })
      })
      // funcion para ordenar de forma descendente 
      ordersC.sort((a, b) => Number(b.id) - Number(a.id))
      this.OrdersCenter = ordersC;
      this.centerShow = true
      console.log(this.OrdersCenter)
    } ,(error)=>{
      console.log(error);
    })

    this.afDb.getOrdersUsersAccepted("Sur",this.uidUser).subscribe((ordersS)=>{
      ordersS.map((order:any)=>{
        this.afDb.getDistribuitorDataByUid(order.acceptedBy).subscribe((distri)=>{
          order.distriData = distri
        })
      })
      // funcion para ordenar de forma descendente 
      ordersS.sort((a, b) => Number(b.id) - Number(a.id))
      this.OrdersSouth = ordersS
      this.southShow = true
      console.log(this.OrdersSouth)
    } ,(error)=>{
      console.log(error);
    })
  }

  showNorthOrder(){
    if(this.northShow){
      this.iconSoliN = "ios-arrow-up"
      this.northShow = false
    }else{
      this.iconSoliN = "ios-arrow-down"
      this.northShow = true
    }
  }


  showSouthOrder(){
    if(this.southShow){
      this.iconSoliS = "ios-arrow-up"
      this.southShow = false
    }else{
      this.iconSoliS = "ios-arrow-down"
      this.southShow = true
    }
  }

  showCenterOrder(){
    if(this.centerShow){
      this.iconSoliC = "ios-arrow-up"
      this.centerShow = false
    }else{
      this.iconSoliC = "ios-arrow-down"
      this.centerShow = true
    }
  }

}
