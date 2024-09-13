import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthServiceService } from "../../app/auth/auth-service.service";
import { Storage } from '@ionic/storage';
import { ServicesService } from '../stockService/services.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  USER_INFO : {
    id: any ,
    user_name: any,
    store_id :any,
    full_name:any,
    password:any,
  };
  yearArr : Array<any> =[]
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
  stores:Array<any> =[]
  store_info : {id:any ,store_ref:any , store_name:any , location :any }
  company : { id: any , phone: any, phone2  :any, address :any, logoUrl:any,engName:any,arName:any ,tradNo:any , vatNo:any};

  constructor(private api:ServicesService,private storage: Storage,private toast:ToastController ,private loadingController:LoadingController , private authenticationService: AuthServiceService) {
    this.store_info = {id:"1" ,store_ref:"sh" , store_name:"sooq sha'by" , location :"sha'aby" } 
    this.USER_INFO = {
      id: "" ,
      user_name: "",
      store_id :1,
      full_name:"",
      password:"", 
    }
   }

  ngOnInit() {
    this.getStore()
    this.getCompany()
    this.getyear()
  }

  pickDetail(ev){
    let fl= this.stores.filter(x=>x.store_name == ev.target.value)
    //console.log(fl);
    this.store_info = {
      id:fl[0]['id'],
      store_name:fl[0]['store_name'],
      store_ref: fl[0]['store_ref'],
      location:fl[0]['location'] 
    }
    this.USER_INFO.store_id =fl[0]['id']
    //console.log( this.store_info); 
  }

  getStore(){
    this.api.getStores().subscribe(data =>{
       //console.log(data)
       let res = data
       this.stores = res['data']
     }, (err) => {
     //console.log(err);
   })  
  }

  getCompany(){
    this.api.getCompany().subscribe(data =>{
       //console.log(data)
       let res = data
       this.company = res['data']
     }, (erriho) => {
     //console.log(err);
   })  
  }


  getyear(){ 
    this.api.getYear().subscribe(data =>{
     let res = data
     this.yearArr = res ['data'] 
     this.setCurrentYear()
   }, (err) => {
    this.presentToast('حدث خطأ ما , الرجاء اعادة المحاولة ', 'danger')
    //console.log(err);
   })   
  } 

  setCurrentYear(){
    this.storage.get('year').then((response) => {
      if (response) {
         this.year = response 
      }else{
        this.year = this.yearArr[0]
        this.storage.set('year', this.year).then((response) => {
          //console.log('year set',  this.year) 
        }); 
      }
    });
  }

  setCurrentStoreLocaly(){
    this.storage.set('STORE_INFO', this.store_info).then((response) => {
      
    }) 
    this.storage.set('company', this.company).then((response) => {
      
    }) 
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

  async presentLoadingWithOptions(msg?) {
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
       loading.onDidDismiss().then(data=>{
          //console.log(data)
        });

    //console.log('Loading dismissed with role:', role);
  }

   loginUser(){
   if(this.USER_INFO.user_name == "" || this.USER_INFO.password == ""){
    this.presentToast('الرجاء إكمال بيانات تسجيل الدخول' ,'danger') 
   }else{ 
    
    this.storage.set('STORE_INFO', this.store_info).then((response) => {
      
    })
    this.storage.set('company', this.company).then((response) => {
      
    })
   
         this.authenticationService.login(this.USER_INFO)    
   }

  }
}
