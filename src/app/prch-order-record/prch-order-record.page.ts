import { Component, OnInit } from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import {  LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common'; 
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router'
import { PrintModalPage } from '../print-modal/print-modal.page';

@Component({
  selector: 'app-prch-order-record',
  templateUrl: './prch-order-record.page.html',
  styleUrls: ['./prch-order-record.page.scss'],
})
export class PrchOrderRecordPage implements OnInit {
  payArray:Array<any> =[]
  printArr:Array<any> =[]
  sub_account:Array<any> =[]
  sub_accountLocalPurch:Array<any> =[]
  selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,cat_id:any,cat_name:any};
  sub_accountPurch:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  printMode :boolean =false
  itemList :Array<any> =[]
  paInvo :any
  dateFrom :any;
  dateTo :any;
  radioVal : any = 0
  startingDate :any
  endDate :any 
  loading:boolean = false
  showEmpty :boolean = false
  offline: boolean = false;
  purchLocal:Array<any> =[]
  purchase:Array<any> =[]
  purchOffline:Array<any> =[]
  color :any ='dark'
  sums : {pay:any ,change:any,discount:any,tot:any,totAfterDiscout:any}
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
  constructor(private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
  this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_name:"",cat_id:""};
   
    this.sums = {pay:0 ,change:0,discount:0,tot:0,totAfterDiscout:0}
    this.getAppInfo()
    this.prepareOffline()
    let d = new Date
    this.startingDate = this.datePipe.transform(d, 'yyyy-MM-dd')
    this.endDate = this.datePipe.transform(d, 'yyyy-MM-dd')
  }


  ngOnInit() {
    this.payArray =[]
    //console.log('ngOnInit')
    this.getAppInfo() 
    this.prepareOffline()
  }


  ionViewDidEnter(){
    this.payArray =[]
    this.purchLocal =[]
    this.purchOffline =[]
    this.purchase =[]
    //console.log('ionViewDidEnter')
   // this.search()
   }

    clear(){
      this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_name:"",cat_id:""};
      this.payArray = []
      this.purchLocal = []
      this.showEmpty = false
      this.loading = false
    }
    
   changeMode(){
    if(this.offline == true){
      this.offline = false
      this.color = 'primary' 
    }else if(this.offline == false){
      this.offline = true
      this.color = 'dark'
    }
    this.storage.set('offline',this.offline).then((response) => { 
      //console.log('mooooode',this.offline)  
  });
  }

  getOffliemode(){
    this.storage.get('offline').then((response) => { 
        this.offline = response
        //console.log('mooooode',this.offline)
        if (this.offline == true) {
          this.color= 'dark'
        }else{
          this.color = 'primary'
        }
 
       
    });
  }

  getAppInfo(){ 
    this.getOffliemode()
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
        this.getSalesAccount()
      // this.search() 
     }
   });
   this.storage.get('purchase').then((response) => {
    if (response) {
      this.purchase = response 
       //console.log(this.purchase)  
    }
  });
 }

 prepareOffline(){ 
 this.storage.get('sub_accountLocalPurch').then((response) => {
   if (response) {
     this.sub_accountLocalPurch = response 
      //console.log(this.sub_accountLocalPurch)  
   }
 });
 //Yaw
 this.storage.get('sub_accountPurch').then((response) => {
  if (response) {
    this.sub_accountPurch = response  
     //console.log(this.sub_accountPurch)  
  }
}); 
}

getSalesAccount(){
  if (this.offline == false) {
    this.api.getPerchAccounts(this.store_info.id,this.year.id).subscribe(data =>{
       let res = data
       this.sub_account = res ['data']
       //console.log(this.sub_account)
        this.addSubaccountLocal()
     }, (err) => {
     //console.log(err);
   }) 
  }else{
    this.MixSubaccountSalesOffline()
   } 
 } 

 MixSubaccountSalesOffline(){
  this.sub_account=[] 
    if (this.sub_accountLocalPurch) {
      for (let i = 0; i < this.sub_accountLocalPurch.length; i++) {
        const element = this.sub_accountLocalPurch[i];
        this.sub_account.push(element)
      }
    }
    if (this.sub_accountPurch) {
      for (let i = 0; i < this.sub_accountPurch.length; i++) {
        const element = this.sub_accountPurch[i];
        this.sub_account.push(element)
      }
    } 
  }

 addSubaccountLocal(){
  if (this.sub_account) {
    if (this.sub_accountLocalPurch) {
      for (let i = 0; i < this.sub_accountLocalPurch.length; i++) {
        const element = this.sub_accountLocalPurch[i];
        this.sub_account.push(element)
      }
    }
  } else{
    if (this.sub_accountLocalPurch) {
      this.sub_account = this.sub_accountLocalPurch 
    }
  } 
}

   printInvo(printarea , dataFrom){   
    if (this.offline==false && dataFrom.pay_id != undefined) {
      this.paInvo = dataFrom 
      //console.log( this.paInvo) 
      this.api.getPerchOrderInvoDetail(this.store_info.id , dataFrom.pay_ref).subscribe(data =>{
       //console.log(data)
       let res = data 
       this.itemList = res['data']
       //console.log(res) 
       this.printArr = []
       this.printArr.push({
       'payInvo': this.paInvo,
       'itemList':this.itemList,
       'selectedAccount' : this.paInvo.sub_name,
       'sub_nameNew' : ""
     }) 
      //console.log(this.printArr)
      this.presentModal(this.printArr , 'perchOrderAr-record')
       }, (err) => {
        //console.log(err);
        this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
       },()=>{ 
       })        
    } else if (this.offline==false && dataFrom.pay_id == undefined) {
     console .log(dataFrom,dataFrom) 
     //console.log(this.purchLocal ,'case2')
     let flt:Array<any> =[]
     flt = this.purchLocal.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here')

     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : ""
   }) 
    //console.log(this.printArr)
    this.presentModal(this.printArr , 'perchOrderAr-record') 
    }else if (this.offline==true && dataFrom.pay_id != undefined) {
      
     
     //console.log(this.purchase ,'case3')
     let flt:Array<any> =[]
     flt = this.purchase.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here')

     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : ""
   }) 
    //console.log(this.printArr)
    this.presentModal(this.printArr , 'perchOrderAr-record') 
    }else if (this.offline==true && dataFrom.pay_id == undefined) { 
     //console.log(this.purchLocal)
     let flt:Array<any> =[]
     flt = this.purchLocal.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here')
     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : ""
   }) 
    //console.log(this.printArr)
    
    this.presentModal(this.printArr , 'perchOrderAr-record')  
    } 
    
   }

   printInvoEn(printarea , dataFrom){   
    if (this.offline==false && dataFrom.pay_id != undefined) {
      this.paInvo = dataFrom 
      //console.log( this.paInvo) 
      this.api.getPerchOrderInvoDetail(this.store_info.id , dataFrom.pay_ref).subscribe(data =>{
       //console.log(data)
       let res = data 
       this.itemList = res['data']
       //console.log(res) 
       this.printArr = []
       this.printArr.push({
       'payInvo': this.paInvo,
       'itemList':this.itemList,
       'selectedAccount' : this.paInvo.sub_name,
       'sub_nameNew' : ""
     }) 
      //console.log(this.printArr)
      this.presentModal(this.printArr , 'perchOrderEn-record')
       }, (err) => {
        //console.log(err);
        this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
       },()=>{ 
       })        
    } else if (this.offline==false && dataFrom.pay_id == undefined) {
     console .log(dataFrom,dataFrom) 
     //console.log(this.purchLocal ,'case2')
     let flt:Array<any> =[]
     flt = this.purchLocal.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here') 
     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : ""
   }) 
    //console.log(this.printArr)
    this.presentModal(this.printArr , 'perchOrderEn-record') 
    } else if (this.offline==true && dataFrom.pay_id != undefined) { 
     //console.log(this.purchase ,'case3')
     let flt:Array<any> =[]
     flt = this.purchase.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref)
     //console.log(flt,'here') 
     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : ""
   }) 
    //console.log(this.printArr)
    this.presentModal(this.printArr , 'perchOrderEn-record') 
    }else if (this.offline==true && dataFrom.pay_id == undefined) { 
     //console.log(this.purchLocal)
     let flt:Array<any> =[]
     flt = this.purchLocal.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here')
     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : ""
   }) 
    //console.log(this.printArr)
    
    this.presentModal(this.printArr , 'perchOrderEn-record')  
    } 
    
   }

   async presentModal(printArr , page) { 
    const modal = await this.modalController.create({
      component: PrintModalPage ,
      componentProps: {
        "printArr": this.printArr,
        "page": page
      }
    });
    
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        //console.log(dataReturned )
       
      }
    });
  
    return await modal.present(); 
  }

   preparedPrin(printarea ,paInvo, itemList){
     if (printarea && paInvo && itemList) {
        this.printMode = true
        this.Print(printarea ,this.paInvo , this.itemList)
     }
    
   }



   pickAccount(ev){
    let fl= this.sub_account.filter(x=>x.sub_name == ev.target.value)
    //console.log(fl);
    if (fl.length > 0) {
    this.selectedAccount = {
      id:fl[0]['id'],
      ac_id:fl[0]['ac_id'],
      sub_name:fl[0]['sub_name'],
      sub_type:fl[0]['sub_type'],
      sub_code:fl[0]['sub_code'], 
      store_id:fl[0]['store_id'],
      sub_balance:fl[0]['sub_balance'] ,
      cat_id:fl[0]['cat_id'],
      cat_name:fl[0]['cat_name']
    }
    //console.log( this.selectedAccount);
    this.payArray = []
    this.purchLocal = []
    this.showEmpty = false
    this.loading = false
  //  this.setFocusOnInput()
  }else{
    this.presentToast('خطأ في اسم الحساب ', 'danger') 
    this.selectedAccount.sub_name =""
  }
}

   Print(elem ,paInvo, itemList  ){ 
    if (elem && paInvo && itemList){ 
       var mywindow = window.open('', 'PRINT', 'height=400,width=600'); 
      mywindow.document.write('<html><head>'); 
      mywindow.document.write('<style type="text/css">')
      mywindow.document.write('.flr{ display: block; float: right; } .show{ } .hide{width:0px;height:0px} .w45 {width:45%} .w50 {width:50%} .w100 {width:100%} td, th {border: 1px solid #dddddd;text-align: center;padding: 8px;} tr:nth-child(even) {background-color: #dddddd;} .table{text-align: center;width: 100%; margin: 12px;}.ion-margin{ margin: 10px; } .ion-margin-top{ margin-top: 10px; } .rtl {  direction: rtl; } .ion-text-center{ text-align: center; } .ion-text-end{ text-align: left; } .ion-text-start{ text-align: right; }')
      mywindow.document.write('</style></head><body>');
     
      mywindow.document.write(document.getElementById(elem).innerHTML);
      mywindow.document.write('</body></html>');
  
      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/ 
      mywindow.print();
      mywindow.close();
      this.printMode = false 
      return true;
    }
     
  }


  getSalesfromLocal(){
    this.purchLocal =[]
    this.storage.get('purchLocal').then((response) => {
      if (response) {
        this.purchLocal = response
        //console.log(this.purchLocal)  
      } 
    });
  }

  getSalesOffline(){
    this.purchOffline =[]
    this.storage.get('sales').then((response) => {
      if (response) {
        this.purchOffline = response
        //console.log(this.purchOffline)  
      } 
    });
  }
  
  getTotal(){
    this.sums.tot = this.payArray.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0);
    this.sums.change = this.payArray.reduce( (acc, obj)=> { return acc + +obj.changee; }, 0);
    this.sums.pay = this.payArray.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);
    this.sums.discount = this.payArray.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
    this.sums.totAfterDiscout =   + this.sums.tot - this.sums.discount 
    } 

  search(){
    this.showEmpty=false
    if (this.radioVal == 0) { 
     if (this.offline == true) {
   //   this.getTopSalesOffline()
      this.presentToast('لا يوجد اتصال بالإنترنت',"danger")
    } else {
      this.getTopSales()
    }
    }  
   }
   
   getTopSales(){ 
    //this.getSalesfromLocal()
    this.loading = true
    this.api.getTopOrderPerch(this.store_info.id).subscribe(data =>{
       //console.log('hhhhhh',data)
       let res = data
       if(res['message'] != 'No record Found'){
         this.payArray = res['data'] 
       }
      //  if(this.purchLocal.length >0){
      //   //console.log('locLaly',this.purchLocal)
      //   for (let i = 0; i < this.purchLocal.length; i++) {
      //     const element = this.purchLocal[i];
      //     this.payArray.push(element.payInvo)
      //   }
      //   this.getTotal()
      //   if(this.payArray.length==0){
      //     this.showEmpty = true
      //   }else{
      //     this.showEmpty = false
      //   }
      //   this.loading=false
      //   //console.log(this.payArray)
      //  }
        //custName
        if(this.payArray.length==0){
              this.showEmpty = true
            }else{
              this.showEmpty = false
            }
     if( this.selectedAccount.sub_name != ""){
      if(this.payArray.length>0){
      this.payArray= this.payArray.filter(x=>+x.cust_id == +this.selectedAccount.id)
        
      }
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

   getTopSalesOffline(){
    //console.log('getTopSalesOffline')
    this.payArray=[]
    this.purchLocal =[]
    this.purchOffline=[]
    this.purchase =[]
    this.storage.get('purchLocal').then((response) => {
     if (response) {
       let flt : Array<any> =[]
       flt= response
       this.purchLocal=flt
       //console.log(flt)
       if (flt.length > 0) {
         for (let i = 0; i < flt.length; i++) {
         const element = flt[i];
         this.payArray.push(element.payInvo)
       } 

       }
     }
     // 
     this.storage.get('purchase').then((response2) => {
      if (response2) {
        let flt : Array<any> =[]
        flt= response2
        this.purchOffline=flt
        this.purchase=this.purchOffline
        //console.log(flt)
        if (flt.length > 0) {
          for (let i = 0; i < flt.length; i++) {
          const element = flt[i];
          this.payArray.push(element.payInvo)
        } 
        }
      }
      this.getTotal()

      if(this.payArray.length==0){
        this.showEmpty = true
      }else{
        this.showEmpty = false
      }
      this.loading=false
    });
     //custName
     if( this.selectedAccount.sub_name != ""){
      if(this.payArray.length>0){
      this.payArray= this.payArray.filter(x=>+x.cust_id == +this.selectedAccount.id)
        
      }
    }
    this.getTotal()
   });
  }

  getSalesByDate(){ 
    this.payArray=[]
    this.purchLocal =[]
    this.purchOffline=[]
    this.purchase =[]
    //console.log(this.store_info.id,this.startingDate)
    this.getSalesfromLocal()
    this.loading = true
    this.api.getPerchByDate(this.store_info.id , this.startingDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){ 
       this.payArray = res['data'] 
     }
     if(this.purchLocal.length >0){
      this.purchLocal = this.purchLocal.filter(x=>x.payInvo.pay_id==undefined && x.payInvo.pay_date==this.startingDate)
      //console.log('locLaly',this.purchLocal)
      for (let i = 0; i < this.purchLocal.length; i++) {
        const element = this.purchLocal[i];
        this.payArray.push(element.payInvo)
      }
      this.getTotal()

      if(this.payArray.length==0){
        this.showEmpty= true
      }else{
        this.showEmpty = false
      }
      this.loading=false
      //console.log(this.payArray)

     } 
      //custName
      if( this.selectedAccount.sub_name != ""){
        if(this.payArray.length>0){
        this.payArray= this.payArray.filter(x=>+x.cust_id == +this.selectedAccount.id)
          
        }
      }
     this.getTotal()
       // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
     }, (err) => {
     //console.log(err);
    
   },()=>{
    this.loading = false
   }
   )  
   }

 
   getSalesByDateOffline(){
    this.payArray=[]
    this.purchLocal =[]
    this.purchOffline=[]
    this.purchase =[]
    this.loading = true
    this.storage.get('purchLocal').then((response) => {
      if (response) {
        this.purchLocal = response
        
        let flt:Array<any> =[]
        //console.log('haloo',this.purchLocal) 
        flt = this.purchLocal.filter(x=> x.payInvo.pay_date==this.startingDate)
        if (flt.length>0) {
          for (let i = 0; i < flt.length; i++) {
            const element = flt[i];
            this.payArray.push(element.payInvo)
          } 
        }  
      }
      this.storage.get('purchase').then((response2) => {
        if (response2) {
          this.purchOffline = response2
          this.purchase =  this.purchOffline
          //console.log(this.purchOffline) 
          let flt:Array<any> =[]
          flt = this.purchOffline.filter(x=> x.payInvo.pay_date==this.startingDate)
          if (flt.length>0) {
            for (let i = 0; i < flt.length; i++) {
              const element = flt[i];
              this.payArray.push(element.payInvo)
            } 
          } 
        }
        this.getTotal()
       
        if(this.payArray.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false

      });
       //custName
     if( this.selectedAccount.sub_name != ""){
      if(this.payArray.length>0){
      this.payArray= this.payArray.filter(x=>+x.cust_id == +this.selectedAccount.id)
        
      }
    }
     //custName
     if( this.selectedAccount.sub_name != ""){
      if(this.payArray.length>0){
      this.payArray= this.payArray.filter(x=>+x.cust_id == +this.selectedAccount.id)
        
      }
    }
      this.getTotal() 
     
    });

 
   }

   getSales2Date(){
    this.payArray=[]
    this.purchLocal =[]
    this.purchOffline=[]
    this.purchase =[]
    this.getSalesfromLocal()
    this.loading = true
    //console.log(this.store_info.id,this.startingDate,this.endDate)
    this.api.getPerch2Date(this.store_info.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.payArray = res['data'] 
      } 
      
     
     if(this.purchLocal.length >0){
      this.purchLocal = this.purchLocal.filter(x=>x.payInvo.pay_date>=this.startingDate && x.payInvo.pay_date<=this.endDate)
      //console.log('locLaly',this.purchLocal)
      for (let i = 0; i < this.purchLocal.length; i++) {
        const element = this.purchLocal[i];
        this.payArray.push(element.payInvo)
      }
      //console.log(this.payArray)
    
      this.getTotal()
      if(this.payArray.length==0){
        this.showEmpty = true
      }else{
        this.showEmpty = false
      }
      this.loading=false
     }
      //custName
      if( this.selectedAccount.sub_name != ""){
        if(this.payArray.length>0){
        this.payArray= this.payArray.filter(x=>+x.cust_id == +this.selectedAccount.id)
          
        }
      }
     this.getTotal()
     }, (err) => {
     //console.log(err);
   },()=>{
    this.loading = false
   }
   )  
   }
  

   getSales2DateOffline(){
    this.payArray=[]
    this.purchLocal =[]
    this.purchase =[]
    this.purchOffline=[]
    this.loading = true
    this.storage.get('purchLocal').then((response) => {
      if (response) {
        this.purchLocal = response
        //console.log(this.purchLocal) 
        let flt:Array<any> =[]
        flt =this.purchLocal.filter(x=>x.payInvo.pay_date>=this.startingDate && x.payInvo.pay_date<=this.endDate)
        if (flt.length>0) {
          for (let i = 0; i < flt.length; i++) {
            const element = flt[i];
            this.payArray.push(element.payInvo)
          } 
        }  
      } 
      this.storage.get('purchase').then((response2) => {
        if (response2) {
          this.purchOffline = response2
          this.purchase=this.purchOffline 
          //console.log(this.purchOffline) 
          let flt:Array<any> =[]
          flt =this.purchOffline.filter(x=>x.payInvo.pay_date>=this.startingDate && x.payInvo.pay_date<=this.endDate)
          if (flt.length>0) {
            for (let i = 0; i < flt.length; i++) {
              const element = flt[i];
              this.payArray.push(element.payInvo)
            } 
          }  
        } 
       
        this.getTotal()
        if(this.payArray.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false 
      });
     
     //custName
     if( this.selectedAccount.sub_name != ""){
      if(this.payArray.length>0){
      this.payArray= this.payArray.filter(x=>+x.cust_id == +this.selectedAccount.id)
        
      }
    }
      this.getTotal()
    });  
  }
  
   radioChange(ev){
    //console.log(ev.target.value) 
    this.payArray = []
    this.purchLocal = []
    this.showEmpty = false
    this.loading = false
   }
 

   getPayInvoDetail(pay,sub_name,status){
     console .log(pay,sub_name,status)
   this.presentLoadingWithOptions('جاري جلب التفاصيل ...')
   if (this.offline==false && pay.pay_id != undefined) {
    this.api.getPerchOrderInvoDetail(this.store_info.id , pay.pay_ref).subscribe(data =>{
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
      this.rout.navigate(['folder/edit-prch-order'], navigationExtras); 
     }, (err) => {
     //console.log(err);
     this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
   })  
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

}