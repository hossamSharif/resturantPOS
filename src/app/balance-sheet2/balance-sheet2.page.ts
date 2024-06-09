import { Component, OnInit } from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import {  AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common'; 
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router'
import { PrintModalPage } from '../print-modal/print-modal.page';
@Component({
  selector: 'app-balance-sheet2',
  templateUrl: './balance-sheet2.page.html',
  styleUrls: ['./balance-sheet2.page.scss'],
})
export class BalanceSheet2Page implements OnInit {
 device:any =''
  payArray:Array<any> =[]
  payArrayCust:Array<any> =[]
  payArraySupp:Array<any> =[]
  payArraySpends:Array<any> =[]
  printArr:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  printMode :boolean =false
  itemList :Array<any> =[]
  paInvo :any
  dataResArray:Array<any> =[]
  BlFilter : boolean = false
  segmVal :any = "all"
  dateFrom :any;
  dateTo :any;
  radioVal : any = 0
  startingDate :any
  endDate :any
  sum:any =0
  loading:boolean = false
  showEmpty :boolean = false
  showError :boolean = false
  sales:Array<any> =[]
  purchase:Array<any> =[]
  invoices:Array<any> =[]
  sub_accountSales:Array<any> =[]
  sub_accountPurch:Array<any> =[]
  sub_account:Array<any> =[]
  saveBalance:any = 0
  salesBalance : any=0
  purchBalance:any=0
  mosrfBalance:any = 0
  debitors:any = 0
  creditors:any = 0
  balance :any = 0
  balanceSatus = ""
  debitSum:any=0
  creditSum:any=0
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}

  constructor(private platform :Platform,private alertController: AlertController,private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
    this.checkPlatform()
    this.getAppInfo()
  }

  ngOnInit() {
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
        this.search()
     }
   });
  }
 

  segmChange(ev , filter?){
    let res:any
    if(!filter){
      this.BlFilter = false
      //console.log('ev', ev.target.value)
      res = ev.target.value
    } else if(filter){
      res = filter
    }
    
    if(res == 'customer'){
      this.payArrayCust = this.payArray.filter(x=> x.cat_id == 1)
      let debitTot = this.payArrayCust.reduce( (acc, obj)=> { return acc + +obj.debit; }, 0);
      let credityTot = this.payArrayCust.reduce( (acc, obj)=> { return acc + +obj.credit; }, 0);
      if(debitTot  == credityTot){ 
        this.balance = 0
        this.balanceSatus = ""
      }else if(debitTot  > credityTot){
        this.balance = +debitTot  - +credityTot
        this.balanceSatus = "مدين بـ"
      }else if(credityTot  > debitTot){
        this.balance =  +credityTot - +debitTot  
        this.balanceSatus = "دائن بـ"
      }
    }else if(res == 'supplier'){
      this.payArraySupp= this.payArray.filter(x=> x.cat_id == 2)  
      let debitTot = this.payArraySupp.reduce( (acc, obj)=> { return acc + +obj.debit; }, 0);
      let credityTot = this.payArraySupp.reduce( (acc, obj)=> { return acc + +obj.credit; }, 0);
      if(debitTot  == credityTot){ 
        this.balance = 0
        this.balanceSatus = ""
      }else if(debitTot  > credityTot){
        this.balance = +debitTot  - +credityTot
        this.balanceSatus = "مدين بـ  "
      }else if(credityTot  > debitTot){
        this.balance =  +credityTot - +debitTot  
        this.balanceSatus = "دائن بـ  "
      }
    }else if(res == 'spends'){
      this.payArraySpends= this.payArray.filter(x=> x.cat_id == 4)  
      let debitTot = this.payArraySpends.reduce( (acc, obj)=> { return acc + +obj.debit; }, 0);
      let credityTot = this.payArraySpends.reduce( (acc, obj)=> { return acc + +obj.credit; }, 0);
      if(debitTot  == credityTot){ 
        this.balance = 0
        this.balanceSatus = ""
      }else if(debitTot  > credityTot){
        this.balance = +debitTot  - +credityTot
        this.balanceSatus = "مدين بـ  "
      }else if(credityTot  > debitTot){
        this.balance =  +credityTot - +debitTot  
        this.balanceSatus = "دائن بـ  "
      }
    }

  }

search(){
  this.payArray=[]
  this.loading = true
  this.getBalanceSheet() 
}

// 

getBalanceSheet(){
  this.loading = true
  this.api.getBalanceSubAccount(this.store_info.id,this.year.id).subscribe(data =>{
     //console.log('hhhhhh',data)
     let res = data
     if(res['message'] != 'No record Found'){
      this.payArray = res['data'] 
      this.dataResArray = res['data'] 

     } 
      this.loading=false
      //console.log(this.payArray) 
      this.prepareBalances()
   }, (err) => {
   //console.log(err);
   this.loading=false
 },
 ()=>{
  this.loading = false
 })  
  
}


prepareBalances(filter?){
  for (let i = 0; i < this.payArray.length; i++) {
    const element = this.payArray[i];
    let debitTot = +element.fromDebitTot + +element.toDebitTot
    let creditTot = +element.fromCreditTot + +element.toCreditTot
    if(element.sub_type == "debit"){ 
     // let bl = (+element.sub_balance + +debitTot) - +creditTot
      let bl =   +debitTot - +creditTot
      if(bl > 0){ 
        element.debit = bl
        element.credit = 0 
      }else if(bl < 0){ 
        bl = bl * -1
        element.debit = 0
        element.credit = bl  
      }else if(bl == 0){ 
       element.debit = bl
       element.credit = 0  
      }
      
    }else if(element.sub_type == "credit"){ 
      //let bl = (+element.sub_balance + +creditTot) - +debitTot 
      let bl =   +creditTot - +debitTot 
      if(bl > 0){ 
        element.debit = 0 
        element.credit = bl
      }else if(bl < 0){ 
        bl = bl * -1
        element.debit = bl
        element.credit =  0 
      }else if(bl == 0){ 
       element.debit = 0
       element.credit = bl  
      } 
    }
    
  }
  this.debitSum = this.payArray.reduce( (acc, obj)=> { return acc + +obj.debit; }, 0);
  this.creditSum = this.payArray.reduce( (acc, obj)=> { return acc + +obj.credit; }, 0);
  if(!filter){
    this.getTopSales()
  }
 
}
//

getTopSales(){ 
  this.api.getTopSales(this.store_info.id ,this.year.id).subscribe(data =>{
    //console.log('hhhhhh',data)
     let res = data
     if(res['message'] != 'No record Found'){
       this.sales = res['data'] 
      // this.sales = this.sales.filter(x=> x.pay_date >= '2022-08-20')
        
     }else{
      // if(this.sales.length==0){
      //   this.showEmpty= true
      // }else{
      //   this.showEmpty = false
      // }
      // this.loading=false
      //console.log('sales' ,this.sales)
     }
 this.getTopPurch()
     // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
   }, (err) => {
   //console.log(err);
 },
 ()=>{
  this.loading = false
 })  
 }


 getTopPurch(){ 
  this.loading = true
  this.api.getTopPerch(this.store_info.id ,this.year.id).subscribe(data =>{
    //console.log('hhhhhh',data)
    let res = data
    if(res['message'] != 'No record Found'){
      this.purchase = res['data'] 
     // this.purchase = this.purchase.filter(x=> x.pay_date >= '2022-08-20') 
    }else{
    //  if(this.purchase.length==0){
    //    this.showEmpty= true
    //  }else{
    //    this.showEmpty = false
    //  }
    //  this.loading=false
     //console.log('purchase',this.purchase)
    }
     this.prepareSalesPurch()
    // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
  }, (err) => {
  //console.log(err);
},
()=>{
 this.loading = false
})  
}



prepareSalesPurch(){
    this.salesBalance = this.sales.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0);
    let disc = this.sales.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
    this.salesBalance =this.salesBalance - +disc
    let salesPay = this.sales.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);

    this.purchBalance = this.purchase.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0);
    let discp = this.purchase.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
    this.purchBalance =this.purchBalance - +disc
    let purchPay = this.sales.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);

    this.payArray.forEach(element => {
      if(element.id == 48){
        element.credit =  this.salesBalance
      }
      if(element.id == 49){
        element.debit =  this.purchBalance
      } 

      if(element.id == 46){
        element.debit = +element.debit + +salesPay 
        element.credit = +element.credit + +purchPay
        
        if(+element.debit == +element.credit){
          element.debit = 0
          element.credit = 0
        }else if(+element.debit > +element.credit){
           element.debit = element.debit - +element.credit
           element.credit =0
        }else if(+element.credit > +element.debit){
          element.credit = element.credit - +element.debit
          element.debit = 0
       }
    
      }
    }); 
    this.prepareCustSupl()
}



prepareCustSupl(){
  this.payArray.forEach(element => {
    if(element.cat_id == 1){ 
      let fltSales : Array<any> = []
      fltSales = this.sales.filter(x=>x.cust_id == element.id)
      //console.log('fltSales',fltSales)
      if(fltSales.length>0){
        let tot_pr =  fltSales.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0); 
        let discount =  fltSales.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
        let totAfterDiscout =   + tot_pr - +discount 
        let pay =  fltSales.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);
        let balance = +totAfterDiscout - +pay
       // this.debitors = this.debitors + +balance
       if(+element.debit > 0){
        element.debit = +element.debit + +balance
        }else if(+element.debit == 0 && +element.credit == 0){
          element.debit = +element.debit + +balance
        }else if(+element.credit > 0){
          if(balance >= element.credit){
            element.debit = +balance - +element.credit
            element.credit = 0
          }else if(balance  <  element.credit){
            element.credit = +element.credit - +balance
            element.debit = 0
          }
        }
      }    
    } else if(element.cat_id == 2){
      let fltPurch : Array<any> = []
      fltPurch = this.purchase.filter(x=>x.cust_id == element.id)
      //console.log('fltPurch',fltPurch)
      if(fltPurch.length>0){
        let tot_pr =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0); 
        let discount =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
        let totAfterDiscout =   + tot_pr - +discount 
        let pay =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);
        let balance = +totAfterDiscout - +pay
       // this.creditors = this.creditors + +balance
       if(+element.credit > 0){
        element.credit = +element.credit + +balance
        }else if(+element.debit == 0 && +element.credit == 0){
          element.credit = +element.credit + +balance
        }else if(+element.debit > 0){
          if(balance >= element.debit){
            element.credit = +balance - +element.debit
            element.debit = 0
          }else if(balance  <  element.debit){
            element.debit = +element.debit - +balance
            element.credit = 0
          }
        }
        
      }
    } 
  });
}

applyFilter(){
  //console.log(this.BlFilter)
  if(this.BlFilter == true){
    if(this.segmVal == 'all'){
      this.payArray = this.payArray.filter(x=>+x.debit > 0 || +x.credit >0)
     } else if(this.segmVal == 'customer'){
      this.payArrayCust = this.payArrayCust.filter(x=>+x.debit > 0 || +x.credit >0)
    }else if(this.segmVal == 'supplier'){
      this.payArraySupp = this.payArraySupp.filter(x=> +x.debit > 0 || +x.credit >0)
    }else if(this.segmVal == 'spends'){
      this.payArraySpends = this.payArraySpends.filter(x=> +x.debit > 0 || +x.credit >0)
    }
  }else if(this.BlFilter == false){
  this.payArray = this.dataResArray
  
  if(this.segmVal == 'all'){
    this.prepareBalances('filter')
    this.prepareSalesPurch()
   } else if(this.segmVal == 'customer'){
    this.prepareBalances('filter')
     this.prepareSalesPurch()
     this.segmChange("",'customer')
  }else if(this.segmVal == 'supplier'){
    this.prepareBalances('filter')
    this.prepareSalesPurch()
    this.segmChange("",'supplier')
  }else if(this.segmVal == 'spends'){
    this.prepareBalances('filter') 
  }

  }

}


getTotal(){
  this.salesBalance = this.sales.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0);
  let disc = this.sales.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
  this.salesBalance =this.salesBalance - +disc

  this.purchBalance = this.purchase.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0);
  let discp = this.purchase.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
  this.purchBalance =this.purchBalance - +disc
 
  this.mosrfBalance = this.invoices.reduce( (acc, obj)=> { return acc + +obj.rec_pay; }, 0);
  this.payArray.push(
    {
    "sub_name": 'المبيعات' ,
    "debit" : 0, 
    "credit" :this.salesBalance
  },
  {
    "sub_name": 'المشتريات' ,
    "debit" :this.purchBalance, 
    "credit" : 0
  },
  {
    "sub_name": 'المنصرفات' ,
    "debit" :this.mosrfBalance, 
    "credit" : 0
  }

  )
  // saveAccount is debit
  if(+this.salesBalance > (+this.purchBalance + +this.mosrfBalance)){
    this.saveBalance = +this.salesBalance - (+this.purchBalance + +this.mosrfBalance)
    // saveAccount is debit
    // this.payArray.push({
    //   "sub_name": 'الخزينة' ,
    //   "debit" :this.saveBalance, 
    //   "credit" : 0
    // })
  }else if(+this.salesBalance < (+this.purchBalance + +this.mosrfBalance)){
    this.saveBalance =  (+this.purchBalance + +this.mosrfBalance)  +this.salesBalance 
    // saveAccount is credit
    // this.payArray.push({
    //   "sub_name": 'الخزينة' ,
    //   "debit" :0, 
    //   "credit" : this.saveBalance
    // })
  }else if (+this.salesBalance == (+this.purchBalance + +this.mosrfBalance)){
    this.saveBalance = +this.salesBalance - (+this.purchBalance + +this.mosrfBalance)
    // saveAccount is debit
    // this.payArray.push({
    //   "sub_name": 'الخزينة' ,
    //   "debit" :this.saveBalance, 
    //   "credit" : 0
    // })
  } 

  this.getCustomerBalance() 
 } 


getCustomerBalance(){
  this.debitors = 0
  for (let i = 0; i < this.sub_accountSales.length; i++) {
    const element = this.sub_accountSales[i];
    let fltSales : Array<any> = []
    fltSales = this.sales.filter(x=>x.cust_id == element.id)
    //console.log('fltSales',fltSales)
    if(fltSales.length>0){
      let tot_pr =  fltSales.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0); 
      let discount =  fltSales.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
      let totAfterDiscout =   + tot_pr - +discount 
      let pay =  fltSales.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);
      let balance = +totAfterDiscout - +pay
      this.debitors = this.debitors + +balance



      // this.payArray.push({
      //   "sub_name": element.sub_name ,
      //   "debit" :  balance, 
      //   "credit" : 0
      // })
    }

  }

  this.creditors = 0
  for (let i = 0; i < this.sub_accountPurch.length; i++) {
    const element = this.sub_accountPurch[i];
    let fltPurch : Array<any> = []
    fltPurch = this.purchase.filter(x=>x.cust_id == element.id)
    //console.log('fltPurch',fltPurch)
    if(fltPurch.length>0){
      let tot_pr =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0); 
      let discount =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
      let totAfterDiscout =   + tot_pr - +discount 
      let pay =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);
      let balance = +totAfterDiscout - +pay
      this.creditors = this.creditors + +balance
     
      this.payArray.push({
        "sub_name": element.sub_name ,
        "debit" : 0 , 
        "credit" : balance
      })

    }

  }


 }





getSalesAccount(){ 
  this.api.getSalesAccounts(this.store_info.id,this.year.id).subscribe(data =>{
     let res = data
     this.sub_accountSales = res ['data']
     //console.log('sub_accountSales',this.sub_accountSales)
      this.getPurchAccount()
   }, (err) => {
   //console.log(err);
    this.loading= false
 }) 
} 



getPurchAccount(){ 
  this.api.getPerchAccounts(this.store_info.id ,this.year.id).subscribe(data =>{
     let res = data
     this.sub_accountPurch = res ['data']
     //console.log('sub_accountPurch',this.sub_accountPurch) 
     this.getTopSales()
   }, (err) => {
   //console.log(err);
 }) 
}  




 getTopInvoices(){  
    this.loading = true
    this.api.getTopInvoice(this.store_info.id,this.year.id).subscribe(data =>{
       //console.log('hhhhhh',data)
       let res = data
       if(res['message'] != 'No record Found'){
         this.invoices = res['data'] 
          
       }else{
        // if(this.invoices.length==0){
        //   this.showEmpty= true
        // }else{
        //   this.showEmpty = false
        // }
        // this.loading=false
        //console.log(this.invoices)
       }
       this.getTotal()
       // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
     }, (err) => {
     //console.log(err);
   },
   ()=>{
    this.loading = false
   })  
   }


  
   


   } 



 
