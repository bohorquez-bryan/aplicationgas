import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import {GooglePlus} from '@ionic-native/google-plus';

import { first } from 'rxjs/operators';
/*
  Generated class for the GasFirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GasFirebaseProvider {

  constructor(public firebaseNative: Firebase,
              public afAuth : AngularFireAuth,
              public dbGas: AngularFirestore,
              private platform: Platform,
              public googleplus: GooglePlus) {
    console.log('Hello GasFirebaseProvider Provider');
  }

  loginCorreo(dataUser){
    return this.afAuth.auth.signInWithEmailAndPassword(dataUser.email, dataUser.password);
  }

  createNewUser(newUser){
    return this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(newUser.email, newUser.password)
  }

  registerUser(registerUser:UserModel,uid){
    return this.dbGas.collection('users').doc(`${uid}`).set(registerUser);
  }

  updateUser(updateUser:UserModel,uid){
    return this.dbGas.collection('users').doc(`${uid}`).set(updateUser);
  }

  signOut(){
    return this.afAuth.auth.signOut()
  }

  getSessionUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  getUserDataByUid(uid:string){
    return this.dbGas.collection('users').doc(`${uid}`).valueChanges()
  }

  getDistribuitorDataByUid(uid:string){
    return this.dbGas.collection('distributor').doc(`${uid}`).valueChanges()
  }

  updateDistribuitorData(updateDistr,uid:string){
    return this.dbGas.collection('distributor').doc(`${uid}`).set(updateDistr)
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async isLogged() {
    const user = await this.isLoggedIn()
    if (user) {
      return true
    } else {
      return false
    }
  }

  getDistribuitorByZone(zone:string){
    return this.dbGas.collection('distributor', ref => ref.where('zone','==', zone)).valueChanges()
  }

  getUserNotExist(uid){  
    return this.dbGas.collection('users').doc(uid).get()
  } 

  getOrdersUsersAccepted(zone:any,uidUser:any){ // .where('acceptedBy','==', uid)
    return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos', ref => ref.where('userUid','==', uidUser).where('state','==', 'Aceptado')).valueChanges()
  }
  

  // resgistrar pedido de gas

  registerOrder(order:Order){
    let id = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(id).set(order)
  }

  getOrderActual(order:Order){
    let id = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(id).valueChanges()
  }

  cancelOrderActual(order:Order){
    let id = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(id).set(order)
  }   

  // metodos de distribuidor
  getOrdersDistribuitor(zone:any){
    //return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos').valueChanges() 
    return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos', ref => ref.where('state','==', 'Solicitado').where('state','>=', 'Cancelado')).valueChanges() 
  }

  getOrderById(order:any, zone:any){
    let idOrder = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos').doc(idOrder).valueChanges()  
  }

  acceptOrder(order:any){
    let idOrder = btoa(order.date)
    return this.dbGas.collection('orderGas').doc(`${order.zone}`).collection('pedidos').doc(idOrder).set(order)
  }

  getOrderDistruitorAccepted(zone:any,uid:any){ // .where('acceptedBy','==', uid)
    return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos', ref => ref.where('acceptedBy','==', uid)).valueChanges()
  }

  getOrderByKeyID(idkey:any,zone:any){
    return this.dbGas.collection('orderGas').doc(`${zone}`).collection('pedidos', ref => ref.where('id','==', idkey)).valueChanges()  
  }
  /*
  Metodos para notificaciones  
  */

  // Get permission from the user
   // se necesita obtener un token 
   async getToken(uid:any) { 
    let token

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    } 
    return this.saveTokenToFirestore(token,uid)
   }

   // Save the token to firestore
   // se debe guardar el token como un userid
   private saveTokenToFirestore(token,uid:any) {
    if (!token) return;

    localStorage.setItem("token",token);
    const devicesRef = this.dbGas.collection('devices')
  
    const docData = { 
      token: token,
      userId: uid,
    }
  
    return devicesRef.doc(token).set(docData)
   }
 
   // Listen to incoming FCM messages
   // recibe las notificaciones 
   listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
   }

   deleteTokenSesion(){
     return this.dbGas.collection('devices').doc(localStorage.getItem("token")).delete()
   }

   updateByNotification(id:string,zone:any,uidDistri:any){

     this.dbGas.collection('orderGas').doc(zone).collection('pedidos').doc(id).valueChanges()
     .subscribe((resp:any)=>{
       resp.state = "Aceptado"
       resp.acceptedBy = uidDistri
       this.dbGas.collection('orderGas').doc(zone).collection('pedidos').doc(btoa(resp.date)).update(resp);
     },
     (error)=>{
       console.error(JSON.stringify(error))
     })
   }

}
