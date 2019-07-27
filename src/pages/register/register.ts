import { UserRegisterPage } from './../user-register/user-register';
import { GasFirebaseProvider } from './../../providers/gas-firebase/gas-firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
//import firebase from 'firebase';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	signupData: newRegister = {
	    email: '',
	    password: '',
	    passwordRetyped: ''
  };

  constructor(public afAuth : AngularFireAuth,
    public gasProvider: GasFirebaseProvider,  
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController) {
    //this.signupData.email = this.navParams.get('email');
  }
  
  registro() {

    if(!this.signupData.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      this.showToast("Email incorrecto.");
      return;
    }

    if(this.signupData.password !== this.signupData.passwordRetyped) {
      this.showToast("Contraseñas no coinciden.")
      return;
    }
    
    this.navCtrl.setRoot(UserRegisterPage,{newRegister: this.signupData, typeRegis:"newuser"});
  }

  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
