import { Component ,OnInit} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
 
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { ServicesService } from '../stockService/services.service';
import { Observable, Observer, timer } from 'rxjs'; 
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
import { LoadingController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})

export class NotificationsPage implements OnInit {
  showEmptyitems:boolean = false
  showEmptyPay:boolean = false
  showEmptyPurch:boolean = false
  segmVal :any = "items"
  sub_accountSalse:Array<any> =[]
  sub_accountPurch:Array<any> =[]
  payNotifArr:Array<any> =[]
  payArr:any
  perchArr:any
  purchNotifArr:Array<any> =[]
  itemNotifArr:Array<any> =[]
  itemMinusNotifArr:Array<any> =[]
  totalObj : {items:any , pay:any, perch:any} 
  showSpinner :boolean = false 
  isAuth :boolean ;
  api = 'http://localhost/myaperpi/myapi/api/'
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}

  constructor(private loadingController:LoadingController,private toast :ToastController ,private rout : Router ,public http: HttpClient,private api2:ServicesService ,private storage: Storage,private router: Router) {


   // this.subiscribeInterval()
     this.getAppInfo()
       
   
   }
  
  ngOnInit() {
  }

  stockItems(store_id ,yearId){ 
    this.showSpinner = true
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    this.http.get('http://localhost/myaperpi/myapi/api/',{params: params}).subscribe(data =>{
      let res = data 
      let itemNotifArr = res['data']  

      itemNotifArr.forEach(element => {
        if(+element.tswiaQuantity > 0){
          element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 

        }else if(+element.tswiaQuantity < 0){
          element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
        }

        element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
      });


      this.itemMinusNotifArr =   itemNotifArr.filter(x=> +x.quantity < 0)
      this.itemNotifArr =   itemNotifArr.filter(x=>+x.quantity == 0)
      if(this.itemNotifArr.length== 0){
        this.showEmptyitems = true
      }
      this.showSpinner = false 
    //  this.sumCount(itemNotifArr) 
    }, (err) => {
    //console.log(err);
    this.showSpinner = false
  }) 
  }


  sumCount(itemNotifArr){
    let params = new HttpParams() 
    params=params.append('store_id' , 1)
    this.http.get('http://localhost/myaperpi/myapi/api/',{params: params}).subscribe(data =>{
      let res = data
    let arr = res['data']
    for (let index = 0; index < itemNotifArr.length; index++) {
        const element = itemNotifArr[index];
        let flt = arr.filter(x=>x.id == element.id)
        if(flt.length>0){
          element.perchQuantity =  +element.perchQuantity + +flt[0].perchQuantity
         // element.firstQuantity =  +element.firstQuantity + +flt[0].firstQuantity
          element.salesQuantity =  +element.salesQuantity + +flt[0].salesQuantity
        }
      }
          itemNotifArr.forEach(element => {
            element.quantity =  (+element.perchQuantity + +element.firstQuantity)  - +element.salesQuantity  
          });
          this.itemMinusNotifArr =   itemNotifArr.filter(x=> +x.quantity < 0)
          this.itemNotifArr =   itemNotifArr.filter(x=>+x.quantity == 0)
          if(this.itemNotifArr.length== 0){
            this.showEmptyitems = true
          }
          // this.getTot()
          //console.log('interval data from backend',data) 
          this.showSpinner = false 

    }, (err) => {
      //console.log(err);
      this.showSpinner = false
    })   
      
  }

 


  segmChange(ev, filter?) {
    if (this.segmVal == 'items') { 
      this.stockItems(1,this.year.id)
    } else if (this.segmVal == 'customer') {
      this.getPayNotif(1)  
    } else if (this.segmVal == 'supplier') { 
      this.getPerchNotif(1,this.year.id) 
    }
  }


getTot(){
  this.totalObj.items = this.itemNotifArr.length
  this.totalObj.perch = this.purchNotifArr.length
  this.totalObj.pay = this.payNotifArr.length
  let tot = this.totalObj.items +this.totalObj.perch +this.totalObj.pay 
  return tot
}

getPayNotif(store_id){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  this.showSpinner = true
  this.http.get(this.api+'pay/paynotif.php',{params: params}).subscribe(data =>{
           let res = data 
           this.payArr = res
           //console.log('payArr',data,this.payArr)
           this.getAccounts(1 , 1)
           //console.log('interval data from backend',data) 
         }, (err) => {
         //console.log(err);
       }) 
}

getPerchNotif(store_id,yearId){  
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('yearI' , yearId)
  this.showSpinner = true
  this.http.get(this.api+'perch/paynotif.php',{params: params}).subscribe(data =>{
           let res = data 
           this.perchArr = res
           //console.log('perchArr',data ,this.perchArr)
           this.getAccounts(1 , 2)
           //console.log('interval data from backend',data) 
         }, (err) => {
         //console.log(err);
       }) 
}



getAccounts(store_id , ac_id){  
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params= params.append('ac_id' , ac_id) 
   this.http.get(this.api+'sub_accounts/readByStore.php',{params: params}).subscribe(data =>{
    let res = data
   
    if(ac_id == 1){
        this.sub_accountSalse = res ['data']
       
    }else{
      this.sub_accountPurch = res ['data'] 
     
    } 
    //console.log(' from backend',data)
    //console.log(' filter' ,this.sub_accountPurch ,this.sub_accountPurch )
    this.showSpinner = false 
    this.recalSubBalance(ac_id) 
  }, (err) => {
  //console.log(err);
  this.showSpinner = false
}) 
}

recalSubBalance(type){
  if (type == 1) {
     // adding new change to subbalances
  this.sub_accountSalse.forEach(element => {
    element.sub_balance = 0 
    let debitTot = +element.changeeTot + +element.fromDebitTot
    let creditTot = +element.purchChangeeTot + +element.toCreditTot
  
    if (debitTot == creditTot) {
      element.sub_balance = 0
      element.currentCustumerStatus = ''
     }else if(debitTot > creditTot ){
       element.sub_balance = (+debitTot - +creditTot).toFixed(2)
       element.currentCustumerStatus = 'debit'
       
     }else if(creditTot > debitTot ){
      element.sub_balance = (+creditTot - +debitTot).toFixed(2)
      element.currentCustumerStatus = 'credit'
       
     }
  });

  this.sub_accountSalse = this.sub_accountSalse.filter(x=>+x.sub_balance > 0)
  //console.log('recalSubBalance sales',this.sub_accountSalse)
  this.preparePayNotifArr(this.payArr)
  
  } else {
      // adding new change to subbalances
   this.sub_accountPurch.forEach(element => {
    element.sub_balance = 0 
    let debitTot = +element.changeeTot + +element.fromDebitTot
    let creditTot = +element.purchChangeeTot + +element.toCreditTot
  
    if (debitTot == creditTot) {
      element.sub_balance = 0
      element.currentCustumerStatus = ''
     }else if(debitTot > creditTot ){
       element.sub_balance = (+debitTot - +creditTot).toFixed(2)
       element.currentCustumerStatus = 'debit'
      
     }else if(creditTot > debitTot ){
      element.sub_balance = (+creditTot - +debitTot).toFixed(2)
      element.currentCustumerStatus = 'credit'
      
     }
  }); 
  this.sub_accountPurch = this.sub_accountPurch.filter(x=>+x.sub_balance > 0) 
  //console.log('recalSubBalance purchace',this.sub_accountPurch)
  this.preparePurchNotifArr(this.perchArr)
  }
   
}


preparePayNotifArr(arr){
  this.payNotifArr =[]
  if(arr){
    arr = arr.filter(x=>x.nextPay != null && x.nextPay != "0000-00-00")
    //console.log('nextPay',arr) 
    arr.forEach(element => {
      let flt :Array<any> =[]
       flt = this.sub_accountSalse.filter(x=> +x.id == +element.cust_id)
      //console.log('flt' ,flt)
      if(flt.length>0){
        if (+flt[0].sub_balance > 0) {
          this.payNotifArr.push({
            'title' : "مواعيد سداد فاتورة  " +  flt[0].sub_name   + '  بتاريخ  ' +  element.pay_date ,
            'pay_ref' : element.pay_ref,
            'tot_pr' : element.tot_pr,
            'pay_date' : element.pay_date, 
            'pay_time' : element.pay_time,
            'cust_id' : element.cust_id,
            'discount' : element.discount,
            'changee' : element.changee,
            'user_id' : element.user_id,
            'pay' : element.pay,
            'store_id' : element.store_id,
            'pay_method' : element.pay_method,
             'payComment' : element.payComment ,
             'nextPay' : element.nextPay  ,
             'nextMoPay' : momentObj(element.nextPay)  ,
             'sub_name' : flt[0].sub_name  
          })
        } 
      }
     
    });
    if(this.payNotifArr.length== 0){
      this.showEmptyPay = true
    }
  }

  //console.log(this.payNotifArr)

 // this.getTot()
}

 
preparePurchNotifArr(arr){
  this.purchNotifArr=[]
  if(arr){
    arr = arr.filter(x=>x.nextPay != null && x.nextPay != "0000-00-00")
    //console.log('nextPay',arr)
    arr.forEach(element => {
      let flt :Array<any> =[]
       flt = this.sub_accountPurch.filter(x=>+x.id == +element.cust_id)
       if(flt.length>0){
         if (+flt[0].sub_balance > 0) {
        this.payNotifArr.push({
          'title' : "مواعيد سداد فاتورة  " +   flt[0].sub_name  + 'بتاريخ ' +  element.pay_date ,
          'pay_ref' : element.pay_ref,
          'tot_pr' : element.tot_pr,
          'pay_date' : element.pay_date, 
          'pay_time' : element.pay_time,
          'cust_id' : element.cust_id,
          'discount' : element.discount,
          'changee' : element.changee,
          'user_id' : element.user_id,
          'pay' : element.pay,
          'store_id' : element.store_id,
          'pay_method' : element.pay_method,
           'payComment' : element.payComment ,
           'nextPay' :element.nextPay ,
           'nextMoPay' :momentObj(element.nextPay) ,
           'sub_name' : flt[0].sub_name    
        })
      } 
       }
     
    });

    if(this.purchNotifArr.length== 0){
      this.showEmptyPurch = true
    }
  }

  //console.log(this.purchNotifArr)
 // this.getTot()
}


getAppInfo(){ 
  this.storage.get('USER_INFO').then((response) => {
   if (response) {
     this.user_info = response
     //console.log(this.user_info) 
   }
 });
 this.storage.get('year').then((response) => {
  if (response) {
    this.year = response 
  } 
});
 this.storage.get('STORE_INFO').then((response) => {
   if (response) {
     this.store_info = response
      //console.log(response)
      //console.log(this.store_info) 
      this.stockItems(1, this.year.id) 
   }
 });
}

getPayInvoDetail(pay,sub_name,status){
  console .log(pay,sub_name,status)
  this.presentLoadingWithOptions('جاري جلب التفاصيل ...')
  this.api2.getPayInvoDetail(1 , pay.pay_ref,this.year.id).subscribe(data =>{
    //console.log(data,'case 1')
     let res = data 
     //console.log(pay) 
     
     let navigationExtras: NavigationExtras = {
      queryParams: {
        payInvo: JSON.stringify(pay),
        sub_name: JSON.stringify(sub_name),
        user_info:JSON.stringify(this.user_info),
        store_info:JSON.stringify(this.store_info),
        itemList:JSON.stringify(res['data'])
      }
    };
    this.rout.navigate(['folder/edit-sales'], navigationExtras); 
   }, (err) => {
   //console.log(err);
   this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
 })  
  
}


async presentLoadingWithOptions(msg?) {
  const loading = await this.loadingController.create({
    spinner: 'bubbles',
    mode:'ios',
    duration: 3000,
    message: msg,
    translucent: true,
   // cssClass: 'custom-class custom-loading',
    backdropDismiss: false
  });
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  //console.log('Loading dismissed with role:', role);
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


subiscribeInterval(){ 
  this.getPayNotif(1)
  this.getPerchNotif(1,this.year.id)
  this.stockItems(1,this.year.id) 
}
}
