import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController, Platform, LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs'
import { Router } from '@angular/router';
import { ServicesService } from "../stockService/services.service";
 
 
@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {
  authState = new BehaviorSubject(false);
  device:any ='' ;
   USER_INFO : {
    id: any ,
    user_name: any,
    store_id :any,
    full_name:any,
     password:any
  };
  constructor(private toast:ToastController ,private loadingController:LoadingController,private api:ServicesService,   private router: Router,private storage: Storage,private platform: Platform,public toastController: ToastController) { 
    this.platform.ready().then(() => {
      this.checkPlatform()
      this.ifLoggedIn();
    });
  }

  checkPlatform(){
    if (this.platform.is('desktop')) { 
      this.device = 'desktop'
      //console.log('I am an desktop device!');
     }else if(this.platform.is('mobile')){
      this.device = 'mobile'
      //console.log('I am an mobile device!'); 
     }
  }
  
  async presentToast(msg,color?) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000,
      color:color,
      cssClass:'cust_Toast',
      mode:'ios',
      position:'top' 
    });
    toast.present();
  }

  async presentLoadingWithOptions(msg?,status?) {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      mode:'ios',
     duration: 2000,
      message: msg,
      translucent: true,
     // cssClass: 'custom-class custom-loading',
      backdropDismiss: false
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss() 
    //console.log('Loading dismissed with role:', role);
  }

  ifLoggedIn() {
    this.storage.get('USER_INFO').then((response) => {
      if (response) {
        this.authState.next(true);
      }
    });
  }


 async login(user) { 
   await   this.presentLoadingWithOptions('جاري تسجيل الدخول' , 'login')
    //console.log(user)
    this.api.login(user).subscribe(data =>{
      //console.log('loogingksks',data)
      let res = data
      if(res['id'] != null){
      this.USER_INFO ={
        id :res['id'],
        user_name:res['user_name'],
        full_name:res['full_name'],
        password:res['password'],
        store_id:res['store_id'] 
      } 
        //console.log(  'sdlijlf' ,  this.USER_INFO)
        this.storage.set('USER_INFO', this.USER_INFO).then((response) => {
          if(this.device == 'mobile'){
            this.router.navigate(['folder/pos-sales']);
          }else{
            this.router.navigate(['folder/pos-sales']);
          }  
        this.authState.next(true); 
      });
      }else{
        this.loadingController.dismiss()
        this.presentToast('خطأ في اسم المستخدم او كلمة المرور' ,'danger')
      }  
    }, (err) => {
       //console.log(err);
       this.loadingController.dismiss()
       this.presentToast('خطأ في اسم المستخدم او كلمة المرور' ,'danger')
        
      },()=>{ }
    )      
   
  }

 
  async logout() {
    this.storage.remove('USER_INFO').then(() => {
      this.storage.remove('STORE_INFO').then(() => { 
        this.router.navigate(['folder/login']);
        this.authState.next(false);
      }); 
    }); 
  }

  isAuthenticated() {
    return this.authState.value;
  }

}
