import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, ModalController} from 'ionic-angular';
import { OrderDetailsPage } from '../order-details/order-details';

/**
 * Generated class for the DistribuidorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-distribuidor',
  templateUrl: 'distribuidor.html',
})


export class DistribuidorPage {

  distribuitorUid:any

  distribuitorData:DistribuitorModel;

  ordersUsers:any
  ordersAcepted:any

  accepted:boolean = false;
  solicitud:boolean = true;

  iconSoli:string = "ios-arrow-down"

  iconAccep:string = "ios-arrow-up"

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public afDb : GasFirebaseProvider,
    public events: Events, public menuCtrl: MenuController, public modalCtrl: ModalController) {
    this.menuCtrl.enable(true, "menuGas");

    this.afDb.getSessionUser()
    .then((user)=>{
      this.distribuitorUid = user.uid
          // Get a FCM token
      afDb.getToken(user.uid)
      this.afDb.getDistribuitorDataByUid(user.uid).subscribe((distribuitorData:any)=>{
        this.distribuitorData = distribuitorData;
        this.events.publish('distribuitor:logged', distribuitorData, this.distribuitorUid);
        console.log(this.distribuitorData)
        this.getOrders(this.distribuitorData.zone)
      },(error)=>{
        console.log(error);
      })
    }).catch((error)=>{
      console.log(error);
    })

    events.subscribe('orderNoti:show', (id:any) => {
      this.ordersUsers.map((order:any)=>{
        if(order.id = id){
          this.reviewOrder(order)
          return;
        }
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistribuidorPage');
  }

  getOrders(zone:string){
    this.afDb.getOrdersDistribuitor(zone).subscribe((orders:any)=>{
      console.log(orders)
      orders.map((order:any)=>{
        this.afDb.getUserDataByUid(order.userUid).subscribe((user)=>{
          order.userData = user
        })
      })
      
      // funcion para ordenar de forma descendente 
      orders.sort((a, b) => Number(b.id) - Number(a.id))

      this.ordersUsers = orders
      if(this.ordersUsers.length != 0 && this.accepted ){
        this.accepted = false;
        this.iconAccep = "ios-arrow-up"
      }
      console.log(orders)
    },(error)=>{
      console.log(JSON.stringify(error));
      this.ordersUsers = []
      if(this.ordersUsers.length != 0 && this.accepted ){
        this.accepted = false;
        this.iconAccep = "ios-arrow-up"
      }
    })
  }

  getAcceptedOrders(zone:string, uid:string){
    console.log(zone,uid,"hola");
    this.afDb.getOrderDistruitorAccepted(zone,uid)
    .subscribe((resp)=>{
      console.log(resp)
      resp.map((order:any)=>{
        this.afDb.getUserDataByUid(order.userUid).subscribe((user)=>{
          order.userData = user
        })
      })
      // funcion para ordenar de forma descendente 
      resp.sort((a, b) => Number(b.id) - Number(a.id))

      this.ordersAcepted = resp
    },(error)=>{
      console.log(JSON.stringify(error));
      this.ordersAcepted = []
    })
  }

  reviewOrder(orderSelected:any){
    const modal = this.modalCtrl.create(OrderDetailsPage,
      {order: orderSelected, zone: this.distribuitorData.zone, uidDist:this.distribuitorUid})
      
    modal.onDidDismiss(data => {
      if(data){
        console.log(data);
      }
    });
    modal.present()
  }

  showAccepted(){
    if(!this.accepted){
      this.iconAccep = "ios-arrow-down"
      this.accepted = true
      console.log(this.distribuitorData.zone,this.distribuitorUid)
      this.getAcceptedOrders(this.distribuitorData.zone,this.distribuitorUid)
    }else{
      this.accepted = false
      this.iconAccep = "ios-arrow-up"
    }
  }

  showSolicit(){
    if(this.solicitud){
      this.iconSoli = "ios-arrow-up"
      this.solicitud = false
    }else{
      this.iconSoli = "ios-arrow-down"
      this.solicitud = true
    }
  }

}
