import { UserHomePage } from './../user-home/user-home';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';

/**
 * Generated class for the UserRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html',
})
export class UserRegisterPage {

  newUser:UserModel = {
    email:"",
    password:"",
    name:"",
    lastname:"",
    latitude: 0,
    longitude: 0,
    phone_cell: null,
    photo:""
  };
  newRegister:newRegister;

  coordenatesDef:Coordenates = {
    lat:-0.1991789,
    long:-78.4320597,
    zoom: 15
  }

  typeRegist:any
  uidSocial:any

  constructor(public menuCtrl: MenuController, 
    public alertCtrl: AlertController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private locationAccuracy: LocationAccuracy,
    private diagnostic: Diagnostic,
    public toastCtrl:ToastController,
    public gasFirebase:GasFirebaseProvider, public geolocation:Geolocation) {
    this.menuCtrl.enable(false, "menuGas");
    this.typeRegist = this.navParams.get('typeRegis');

    if(this.typeRegist == "newuser"){
      this.newRegister = this.navParams.get('newRegister');
      this.newUser.email = this.newRegister.email;
      this.newUser.password = this.newRegister.password;
    }else{
      this.newUser = this.navParams.get('userData')
      this.uidSocial = this.navParams.get('uidSocial')
    }
    this.getActualLocation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterPage');
  }

  completeRegister(){
    if(this.newUser.phone_cell.toString().length == 7 || this.newUser.phone_cell.toString().length == 10){
      if(this.typeRegist == "newuser"){
        this.gasFirebase.createNewUser(this.newRegister).then(auth => {
          this.gasFirebase.registerUser(this.newUser,auth.user.uid).then((resp)=>{
            console.log(resp)
            this.navCtrl.setRoot(UserHomePage)
          }).catch((error)=>{
            console.log(error)
          })
        }).catch(err => {
          // Handle error
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: err.message,
            buttons: ['OK']
          });
          alert.present();
        });
      }else{
        this.gasFirebase.registerUser(this.newUser,this.uidSocial).then((resp)=>{
          console.log(resp)
          this.navCtrl.setRoot(UserHomePage)
        }).catch((error)=>{
          console.log(error)
          // Handle error
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: error.message,
            buttons: ['OK']
          });
          alert.present();
        })
      }
    }else{
      this.showToast("Número de teléfono incorrecto.");
    }
   
  }

  getLocation(){
    this.diagnostic.isGpsLocationEnabled()
      .then((enabled)=>{
        if(enabled){
          this.geolocation.getCurrentPosition().then((resp)=>{
            this.newUser.latitude = resp.coords.latitude;
            this.newUser.longitude = resp.coords.longitude;
      
            this.coordenatesDef.lat = resp.coords.latitude;
            this.coordenatesDef.long = resp.coords.longitude;
      
            this.coordenatesDef.zoom = 15
          }).catch((error)=>{
            console.log('Error getting location', error);
          })
        }else{
          this.presentConfirm("Encender GPS por favor");       
        }
      })
      .catch((error)=>{
        console.log(error);
      })
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

  presentConfirm(message) {
    let alert = this.alertCtrl.create({
      title: 'Ubicación',
      message: message
    });
    alert.present();
  }

  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
