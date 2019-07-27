import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, AlertController, ToastController } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


/**
 * Generated class for the UserHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-home',
  templateUrl: 'user-home.html',
})
export class UserHomePage {

  zone:any

  uidUser:any
  userData:UserModel;

  alertOrderGas:any

  coordenatesDef:Coordenates = {
    lat:-0.1795126,
    long:-78.4802445,
    zoom: 10
  }
  orderUser:Order = {
    id: 0,
    zone:"",
    date:"",
    latitude:0,
    longitude:0,
    state:"",
    userUid: "",
    numberGas:0,
    reference:""
  }

  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    private diagnostic: Diagnostic,
    public afDb : GasFirebaseProvider, 
    public geolocation:Geolocation,
    public toastCtrl: ToastController,
    private locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController) {
      this.getActualLocation();

      this.menuCtrl.enable(true, "menuGas");

      this.afDb.getSessionUser()
      .then((user)=>{
        this.uidUser = user.uid
        afDb.getToken(user.uid)
        this.afDb.getUserDataByUid(user.uid)
        .subscribe((userData:any)=>{
          this.userData = userData;
          this.events.publish('user:logged', userData);
          this.getLocation()
          console.log(this.userData)

          if(localStorage.getItem('hasOrder')){
            console.log(JSON.parse(atob(localStorage.getItem('hasOrder'))));
            this.orderUser = JSON.parse(atob(localStorage.getItem('hasOrder')));
            this.orderGas()
          }
        },(error)=>{
          console.log(error);
        })
      }).catch((error)=>{
        console.log(error);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserHomePage');
  }

  orderGas(){
    this.orderUser.id = new Date().getTime();
    this.orderUser.latitude = (this.orderUser.latitude == 0)? this.coordenatesDef.lat : this.orderUser.latitude;
    this.orderUser.longitude = (this.orderUser.longitude == 0)? this.coordenatesDef.long : this.orderUser.longitude;
    this.orderUser.userUid = this.uidUser
    this.orderUser.state = (this.orderUser.state == "")? "Solicitado": this.orderUser.state
    this.orderUser.date = (this.orderUser.date == "")? this.getActualDate(): this.orderUser.date

    if(!localStorage.getItem('hasOrder')){
      localStorage.setItem('hasOrder',  btoa(JSON.stringify(this.orderUser)));
    }

    if(this.orderUser.numberGas > 3){
       this.showToastNumberGas();
       return;
    }else{
      this.showAlert(this.orderUser)
      this.registerOrder()
    }
  }

  async showToastNumberGas(){
    const toast = await this.toastCtrl.create({
      message: 'Pedido máximo de cilindros 3.',
      duration: 2000
    });
    toast.present();
  }

  registerOrder(){
    this.afDb.registerOrder(this.orderUser)
    .then(()=>{
      this.afDb.getOrderActual(this.orderUser).subscribe((orderActual:Order)=>{
        console.log(orderActual)
        if(orderActual){
          if(orderActual.state == "Aceptado"){
            localStorage.removeItem('hasOrder');
            this.alertOrderGas.dismiss()
            this.cleanUserOrder()
          }
        }
      },(error)=>{
        localStorage.removeItem('hasOrder');
        this.cleanUserOrder()
        console.log('Error', error);
      })
    })
    .catch((error)=>{
      localStorage.removeItem('hasOrder');
      this.cleanUserOrder()
      console.log('Error', error);
    })
  }

  showAlert(order:Order){
    this.alertOrderGas = this.alertCtrl.create({
      title: 'Solicitud de Gas',
      message: 'Su solicitud de gas esta siendo procesada..',
      buttons: [
        {
          text: 'Cancelar Solicitud',
          handler: () => {
            order.state = "Cancelado"
            this.afDb.cancelOrderActual(order)
            .then((resp)=>{
              localStorage.removeItem('hasOrder');
              this.alertOrderGas.dismiss();
              this.cleanUserOrder()
            })
            .catch((error)=>{
              console.log('Error', error);
            })
            return false;
          }
        }
      ],
      enableBackdropDismiss : false
    });
    this.alertOrderGas.present();
  }

  getActualLocation(){
    this.diagnostic.isGpsLocationEnabled()
      .then((enabled)=>{
        if(enabled){
          this.getLocation();
        }else{
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if(canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () =>{
                  this.getLocation();
                },
                (error) => {
                  this.presentConfirm("Encender GPS por favor");
                  console.log('Error requesting location permissions', error)
                }
              );
            }else{
              this.presentConfirm("Encender GPS por favor");
            }
          });
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp)=>{

      this.coordenatesDef.lat = resp.coords.latitude;
      this.coordenatesDef.long = resp.coords.longitude;

      this.coordenatesDef.zoom = 15
    }).catch((error)=>{
      console.log('Error getting location', JSON.stringify(error));
    })
  }

  getDistribuitors(zone:string){
    this.afDb.getDistribuitorByZone(zone).subscribe((resp)=>{
      console.log(resp)
    },(error)=>{
      console.log(error)
    })
  }

  getActualDate():any{
    let currentdate = new Date(); 

    let datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " - "
    
    
    if(currentdate.getMinutes() < 10){
      datetime += currentdate.getHours()+ ":"+ 
      "0"+ currentdate.getMinutes();
    }else{
      datetime += currentdate.getHours() + ":"  
      + currentdate.getMinutes();
    }

    if(currentdate.getSeconds() < 10){
      datetime += ":"+ "0"+ currentdate.getSeconds(); 
    }else{
      datetime += ":"+currentdate.getSeconds();
    }
    return datetime
  }

  presentConfirm(message) {
      let alert = this.alertCtrl.create({
        title: 'Ubicación',
        message: message
      });
      alert.present();
  }

  cleanUserOrder(){
    this.orderUser = {
      id:0,
      zone:"",
      date:"",
      latitude:0,
      longitude:0,
      state:"",
      userUid: "",
      numberGas:0,
      reference:""
    }
  }
}
