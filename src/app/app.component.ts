import { Component, ViewChild } from '@angular/core';
import { Platform, App, NavController, Nav, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { DistribuidorPage } from './../pages/distribuidor/distribuidor';
import { UserHomePage } from './../pages/user-home/user-home';
import { GasFirebaseProvider } from './../providers/gas-firebase/gas-firebase';

import { LocalNotifications, ILocalNotification} from '@ionic-native/local-notifications';
import { UserOrdersPage } from '../pages/user-orders/user-orders';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: NavController
  rootPage:any ;

  userLogged:UserModel;
  distribuitorLogged:DistribuitorModel;

  distribUid:any;

  typeUser:any

  notification:ILocalNotification
  photo:any;

   constructor( public app: App,  platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afDb: GasFirebaseProvider,public events: Events,public localNotifications: LocalNotifications,public toastCtrl: ToastController) {
    this.afDb.isLogged().then((resp: boolean)=>{
      if(resp){
        this.typeUser = localStorage.getItem("type");
        
        switch(this.typeUser){
          case "user":
          localStorage.setItem("type","user");
          this.rootPage = UserHomePage
          break;

          case "distribuitor":
          localStorage.setItem("type","distribuitor");
          this.rootPage = DistribuidorPage
          break;

          case "userNoRegister":
          this.rootPage = HomePage
          break;

          default:
          this.rootPage = HomePage
          break;
        }
      }else{
        this.rootPage = HomePage
      }
    })
    .catch((error)=>{
      console.log(error)
    })
    
    platform.ready().then(() => {
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    events.subscribe('user:logged', (user:UserModel) => {
      this.userLogged = user;
      this.photo = user.photo;
      console.log(this.photo)
      localStorage.setItem("type","user");
      this.typeUser = "user"
      this.listenToNofication()
    });

    events.subscribe('distribuitor:logged', (distribuitor:DistribuitorModel, distribuitorUid:any ) => {
      this.distribuitorLogged = distribuitor;
      this.distribUid = distribuitorUid
      localStorage.setItem("type","distribuitor");
      this.typeUser = "distribuitor"
      this.listenToNofication()
    });

    
  }

  listenToNofication(){
    //this.afDb.listenToNotifications().subscribe((msg:Notification) =>{
    this.afDb.listenToNotifications().subscribe((msg:any) =>{
      // Schedule a single notification
      /*const toasts = this.toastCtrl.create({
        message: JSON.stringify(msg),
        duration: 3000
      });
      toasts.present();*/
      let notificationId:number = parseInt(msg.notid) 
      console.log(JSON.stringify(msg))
      
      if(msg.state == "cancel" && this.typeUser == "distribuitor"){
        this.localNotifications.isPresent(notificationId)
        .then(resp=> (resp)? this.localNotifications.clear(notificationId):console.log(resp))
        .catch(error=> console.log(JSON.stringify(error)))
        
      }else{

        switch(this.typeUser){
          case "user":
            this.notification = {
              id: notificationId,
              title: msg.title,
              text: msg.body,
              foreground: true,
              priority: 2,
              vibrate:true,
              led: 'FF0000',
              trigger: {at: new Date(new Date().getTime() + 5)},
              lockscreen:true
            }
          break;

          case "distribuitor":
            this.notification = {
              id: notificationId,
              title: msg.title,
              text: msg.body,
              foreground: true,
              priority: 2,
              vibrate:true,
              actions: [
                {id: "yes",title: "Aceptar"},
                {id: "no", title: "Ignorar"}],
              led: 'FF0000',
              trigger: {at: new Date(new Date().getTime() + 5)},
              lockscreen:true
            }
          break;

          default:
          break;
        }

        this.localNotifications.schedule(this.notification);

        const toast = this.toastCtrl.create({
          message: msg.body,
          duration: 3000
        });
        toast.present();
        this.localNotifications.on("yes").subscribe(()=>{
          this.afDb.updateByNotification(msg.id,msg.zona,this.distribUid)
        })

        this.localNotifications.on("no").subscribe((value)=>{
          console.log("boton no")
          console.log(JSON.stringify(value))
          this.localNotifications.clear(value.id);
        })

        this.localNotifications.on('click').subscribe((values)=>{
          console.log("Click en notificacion")
          switch(this.typeUser){
            case "user":
              
            break;
  
            case "distribuitor":
              this.events.publish('orderNoti:show', values.id);
            break;
  
            default:
            break;
          }
        })
      }
      
    })
  }
  gotoProfile(){
    this.nav.setRoot(UserProfilePage,{typeUser:this.typeUser})
  }

  gotoLocation(){
    this.nav.setRoot(UserOrdersPage) 
  }

  gotoHome(){
    if(this.typeUser == "user"){
      this.nav.setRoot(UserHomePage)
    }else{
      this.nav.setRoot(DistribuidorPage)
    }
  }
  
  async signOut(){
    this.localNotifications.clearAll();
    localStorage.setItem("type","");
    await this.afDb.deleteTokenSesion()
      .then(async ()=>{
        await this.afDb.signOut().then((resp)=>{
          this.userLogged = null;
          this.distribuitorLogged = null;
          this.nav.setRoot(HomePage);
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    .catch((error)=>{
      console.log(error);
    })
  }
}

