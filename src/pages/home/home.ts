import { UserRegisterPage } from './../user-register/user-register';
import { DistribuidorPage } from './../distribuidor/distribuidor';
import { Component } from '@angular/core';
import { NavController, ToastController, MenuController, LoadingController } from 'ionic-angular';

import {GooglePlus} from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase, { auth } from 'firebase';

import { Facebook } from '@ionic-native/facebook';
import { GasFirebaseProvider } from '../../providers/gas-firebase/gas-firebase';

import { UserHomePage } from '../user-home/user-home';
import { RegisterPage } from './../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //Creacion objeto vacio

  isUser:boolean = true;
  loading:any;

  loginData = {
    email : "",
    password : ""
  };

  loginDataDistribuitor = {
    email : '',
    password : ''
  };

  userFromSocial:UserModel = {
    email:"",
    password:"",
    name:"",
    lastname:"",
    latitude: 0,
    longitude: 0,
    phone_cell: null,
    photo:""
  }
 
  constructor(
    public menuCtrl: MenuController,
    public gasProvider: GasFirebaseProvider, 
    public facebook: Facebook, 
    public navCtrl: NavController, 
    public googleplus: GooglePlus, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public afAuth: AngularFireAuth) {
    this.menuCtrl.enable(false, "menuGas");

    switch(localStorage.getItem("isUser")){
      case "true":
      this.isUser = true;
      break;

      case "false":
      this.isUser = false;
      break;

      default:
      this.isUser = true;
      localStorage.setItem("isUser","true");
      break;
    }
  }

  loginCorreo(){
    this.showLoading()
    this.loginData.email = this.loginData.email.trim()
    console.log(this.loginData)
    let userType = this.loginVerification(this.loginData)
    switch(userType){
      case "user" : 
      this.gasProvider.loginCorreo(this.loginData)
      .then(() => {
        localStorage.setItem("type","user");
        this.navCtrl.setRoot(UserHomePage);
      })
      .catch(err => {
        this.loading.dismiss();
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000
        });
        toast.present();
      });
      break;
      case "distribuitor": 
      let email = this.loginData.email+"@mail.com";
      this.loginDataDistribuitor.email = email;
      this.loginDataDistribuitor.password = this.loginData.password;
      this.gasProvider.loginCorreo(this.loginDataDistribuitor)
      .then(() => {
        localStorage.setItem("type","distribuitor");
        this.navCtrl.setRoot(DistribuidorPage);
      })
      .catch(err => {
        this.loading.dismiss();
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000
        });
        toast.present();
      })
      break;
      default:
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "Error: "+userType,
        duration: 3000
      });
      toast.present();
      break;
    }  
  }

  facebookLogin(){
    this.facebook.login(['email']).then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(facebookCredential)
      .then( resp => { 
        this.showLoading()
        let uid = resp['uid']
        this.userFromSocial.email = resp['email']
        this.userFromSocial.name = resp['displayName']
        this.userFromSocial.photo = resp['photoURL']
        this.gasProvider.getUserNotExist(uid)
        .subscribe((respUser)=>{
          if(respUser.exists){
            localStorage.setItem("type","user");
            this.navCtrl.setRoot(UserHomePage)
          }else{
            localStorage.setItem("type","userNoRegister");
            this.navCtrl.setRoot(UserRegisterPage,{userData: this.userFromSocial, typeRegis:"socialuser", uidSocial: uid})
          }
        })
      });
    }).catch((error) => { 
      this.loading.dismiss();
      console.log(JSON.stringify(error)) 
    });
  }

  loginGoogle(){
    this.googleplus.login({
      'webClientId':'800966370931-i0ibeumsfk1bltti65f8jv79tcm565hd.apps.googleusercontent.com',
      'offline': true
    }).then(res=>{
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      .then(resp=>{
        this.showLoading()
        let uid = resp['uid']
        this.userFromSocial.email = resp['email']
        this.userFromSocial.name = resp['displayName']
        this.userFromSocial.photo = resp['photoURL']
        this.gasProvider.getUserNotExist(uid)
        .subscribe((respUser)=>{
          if(respUser.exists){
            localStorage.setItem("type","user");
            this.navCtrl.setRoot(UserHomePage)
          }else{
            localStorage.setItem("type","userNoRegister");
            this.navCtrl.setRoot(UserRegisterPage,{userData: this.userFromSocial, typeRegis:"socialuser", uidSocial: uid})
          }
        })
      }).catch(ns=>{
        this.loading.dismiss();
        console.log(JSON.stringify(ns))
      })
    })
  }
 
  registro(){
    this.navCtrl.push(RegisterPage);
  }

  loginVerification(loginData){
    let emailNumber:string = loginData.email
    let data:string[] = emailNumber.split("@")
    if(data.length > 1 && this.isUser){
      if(data[1] == "mail.com" && data[0].match(/^-{0,1}\d+$/)){
        console.log("Usuario no valido")
        return 'Usuario no valido'
      }else{
        console.log("es usuario")
        return 'user'
      }
    } else{
      if(data[0].match(/^-{0,1}\d+$/) && !this.isUser){
        if(data[0].length == 10){
          console.log("es distribuidor")
          return 'distribuitor'
        }else{
          if(data[0].length < 10){
            console.log("cedula incorrecta")
            return 'Cédula incorrecta'
          }else{
            if(data[0].length > 10){
              console.log("cedula incorrecta")
              return 'Cédula incorrecta'
            }
          }
        }
      }else{
        console.log("no es numero")
        return 'Usuario invalido'
      }
    }
  }

  changeUser(){
    if(this.isUser){
      localStorage.setItem("isUser","false");
      this.clearUserLogin();
      this.isUser = false;
    }else{
      localStorage.setItem("isUser","true");
      this.clearUserLogin();
      this.isUser = true;
    }
  }

  clearUserLogin(){
    this.loginData = {
      email : "",
      password : ""
    };
  }

  showLoading(){
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: "Por favor espere .."
    })

    this.loading.present();
  }
}

