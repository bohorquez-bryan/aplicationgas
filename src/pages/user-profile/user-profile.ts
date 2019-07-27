import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, AlertOptions, ToastController } from 'ionic-angular';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  user:any
  uidUser:any

  enable:boolean = true

  typeUser:any

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, public afDb : GasFirebaseProvider, public toastCtrl: ToastController,public alertCtrl: AlertController) {
    
    this.typeUser = this.navParams.get("typeUser")
    
    this.afDb.getSessionUser()
    .then((user)=>{
      this.uidUser = user.uid
      if(this.typeUser == "user"){
        this.afDb.getUserDataByUid(user.uid)
        .subscribe((userData:any)=>{
          this.user = userData;
        },(error)=>{
          console.log(error);
        })
      }else{
        this.afDb.getDistribuitorDataByUid(user.uid)
        .subscribe((userData:any)=>{
          this.user = userData;
        },(error)=>{
          console.log(error);
        })
      }
    }).catch((error)=>{
      console.log(error);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  saveDataUser(user:any){
    this.enable = false
    console.log(user)

    if(this.user.phone_cell.toString().length == 7 || this.user.phone_cell.toString().length == 10){
      if(this.typeUser == "user"){
        this.afDb.updateUser(user,this.uidUser)
        .then((resp)=>{
          this.showAlert()
        })
        .catch((error)=>{
          console.log(error);
        })
      }else{
        this.afDb.updateDistribuitorData(user,this.uidUser)
        .then((resp)=>{
          this.showAlert()
        })
        .catch((error)=>{
          console.log(error);
        })
      }
    }else{
      this.showToast("Número de teléfono incorrecto.");
    }
  }

  showAlert() {
    let optionAlert:AlertOptions;
    if(this.typeUser == "user"){
      optionAlert = {
        title: 'Perfil Usuario',
        subTitle: 'Perfil actualizado exitosamente',
        buttons: [{
          text: 'OK',
          handler: data => {
            this.enable = true
          }
        }],
        enableBackdropDismiss: false
      }
    }else{
      optionAlert = {
        title: 'Perfil Distribuidor',
        subTitle: 'Perfil actualizado exitosamente',
        buttons: [{
          text: 'OK',
          handler: data => {
            this.enable = true
          }
        }],
        enableBackdropDismiss: false
      }
    }
    const alert = this.alertCtrl.create(optionAlert);
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
