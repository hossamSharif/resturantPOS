import { Component, OnInit } from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import {  AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common'; 
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router'
import { PrintModalPage } from '../print-modal/print-modal.page';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.page.html',
  styleUrls: ['./statement.page.scss'],
})
export class StatementPage implements OnInit {
  sub_account:Array<any> =[]
  payArray:Array<any> =[]
   
  purchase:Array<any> =[]
  jdetailsFrom:Array<any> =[]
  jdetailsTo:Array<any> =[]
  sales:Array<any> =[]
  printArr:Array<any> =[]
  showEmpty :boolean = false
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
  selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,debit:any , credit:any};
  sums : {debitTot:any ,creditTot:any}
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}

  constructor(private alertController: AlertController,private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
    this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",debit:"" , credit:""};
    this.sums = {debitTot:0 ,creditTot:0}
   
    this.getAppInfo()
    let d = new Date
    this.startingDate = this.datePipe.transform(d, 'yyyy-MM-dd')
    this.endDate = this.datePipe.transform(d, 'yyyy-MM-dd')
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

        this.getAllAccount()
     }
   });
 }

 ionViewDidEnter(){
   //console.log('ionViewDidEnter')
  this.getAppInfo()
  }

  ngOnInit() {

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
      sub_balance:fl[0]['sub_balance'],
      debit:fl[0]['debit'],  
      credit:fl[0]['credit']  
    }
    //console.log( this.selectedAccount);
     this.payArray = []
  }else{
    this.presentToast(' خطأ في اسم الحساب ', 'danger') 
   
  }
  }

  getAllAccount() {
    this.api.getAllAccounts(this.store_info.id,this.year.id).subscribe(data => {
      //console.log('getAllAccounts',data)
      let res = data
      this.sub_account = res['data']  
      this.prepareCurrentBalnces()
    }, (err) => {
      //console.log(err);
    })
   }

   prepareCurrentBalnces(){
    for (let i = 0; i < this.sub_account.length; i++) {
      const element = this.sub_account[i];
      let debitTot = +element.fromDebitTot + +element.toDebitTot
      let creditTot = +element.fromCreditTot + +element.toCreditTot
      if(element.sub_type == "debit"){ 
        let bl = (+element.sub_balance + +debitTot) - +creditTot
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
        let bl = (+element.sub_balance + +creditTot) - +debitTot 
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
    
    
  }


   printInvo(printarea , data){ 
    this.paInvo = data 
     //console.log( this.paInvo) 
     this.api.getPayInvoDetail(this.store_info.id , data.pay_ref,this.year.id).subscribe(data =>{
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
     this.presentModal(this.printArr , 'sales_record')
      }, (err) => {
       //console.log(err);
       this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
      },()=>{ 
      })     
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

  getTopJto(){
    this.jdetailsTo=[]
    this.loading = true
    this.api.getTopJTo(this.store_info.id,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.jdetailsTo = res['data'] 
        this.jdetailsTo = this.jdetailsTo.filter(x=>x.ac_id == this.selectedAccount.id)
      } 
      this.getTopJfrom() 
      //console.log(this.jdetailsTo)
     }, (err) => {
     //console.log(err);
     this.loading =false
   })  
   }

   getTopJfrom(){
    this.jdetailsFrom=[] 
    this.api.getTopJfrom(this.store_info.id,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.jdetailsFrom = res['data']
        this.jdetailsFrom = this.jdetailsFrom.filter(x=>x.ac_id == this.selectedAccount.id)
        //console.log('flt' ,this.jdetailsFrom)
      } 
       this.prepareArray() 
     }, (err) => {
     //console.log(err);
     this.loading =false
   })  
   }
 
   getJFromByDate(){
    this.jdetailsFrom=[]
    this.loading = true
    //console.log(this.store_info.id,this.startingDate) 
    this.api.getJFromByDate(this.store_info.id , this.startingDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.jdetailsFrom = res['data']
        this.jdetailsFrom = this.jdetailsFrom.filter(x=>x.ac_id == this.selectedAccount.id)
       }
          this.getJToByDate()
     }, (err) => {
     //console.log(err);
     this.loading = false
   })  
   }


   getJToByDate(){  
    this.jdetailsTo =[] 
    this.api.getJToByDate(this.store_info.id , this.startingDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.jdetailsTo = res['data'] 
        this.jdetailsTo = this.jdetailsTo.filter(x=>x.ac_id == this.selectedAccount.id)
      } 
      this.prepareArray()
     }, (err) => {
     //console.log(err);
     this.loading = false
    
   },()=>{
    
   }
   )  
   }
 

   getJTo2Date(){ 
    this.jdetailsTo=[]  
    //console.log(this.store_info.id,this.startingDate,this.endDate)
    this.api.getJTo2Date(this.store_info.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data 
      if(res['message'] != 'No record Found'){
        this.jdetailsTo = res['data'] 
        this.jdetailsTo = this.jdetailsTo.filter(x=>x.ac_id == this.selectedAccount.id)
      } 
       this.getJFrom2Date()
     }, (err) => {
      this.loading=false
      //console.log(err);
   })  
   }

   getJFrom2Date(){ 
    this.jdetailsFrom =[] 
    this.loading = true
    //console.log(this.store_info.id,this.startingDate,this.endDate)
    this.api.getJFrom2Date(this.store_info.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
      //console.log(data)
      let res = data
      if(res['message'] != 'No record Found'){
        this.jdetailsFrom = res['data']
        this.jdetailsFrom = this.jdetailsFrom.filter(x=>x.ac_id == this.selectedAccount.id)
       }  
      this.prepareArray()
    }, (err) => {
    //console.log(err);
    this.loading=false
  },()=>{
  
  }
  )  
  }


  prepareArray(){
    //console.log('im here' ,  this.jdetailsFrom ,this.jdetailsTo)
    if(this.jdetailsFrom.length>0){
      for (let i = 0; i < this.jdetailsFrom.length; i++) {
        const element = this.jdetailsFrom[i];
        this.payArray.push(element)
      }
    }

    if(this.jdetailsTo.length>0){
      for (let i = 0; i < this.jdetailsTo.length; i++) {
        const element = this.jdetailsTo[i];
        this.payArray.push(element)
      }
    }

    //console.log('im here' ,  this.payArray )
     this.payArray = this.payArray.sort((a, b) => (a.j_date > b.j_date ? -1 : 1))
     this.getTotal() 
    if(this.payArray.length==0){
      this.showEmpty = true
    }else{
      this.showEmpty = false
    }
    this.loading=false
   }

   getTotal(){
    this.sums.debitTot = this.payArray.reduce( (acc, obj)=> { return acc + +obj.debit; }, 0);
    this.sums.creditTot = this.payArray.reduce( (acc, obj)=> { return acc + +obj.credit; }, 0);
     
    } 

 radioChange(ev){
  //console.log(ev.target.value) 
  this.payArray = [] 
  this.jdetailsTo = [] 
  this.jdetailsFrom = [] 
  this.showEmpty = false
  this.loading = false
 }


   search(){
    this.payArray = [] 
  this.jdetailsTo = [] 
  this.jdetailsFrom = [] 
    if (this.radioVal == 0) {
     this.getTopJto()
    } else if (this.radioVal == 1) {
       this.getJFromByDate()
    }else if (this.radioVal == 2) {
      this.getJTo2Date()

    }
   }

   getPayInvoDetail(ref){
 //   this.presentLoadingWithOptions('جاري جلب التفاصيل ...')
    this.api.getPayInvoDetail(this.store_info.id , ref,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data 
       //console.log(this.payArray) 
       
       let navigationExtras: NavigationExtras = {
        queryParams: {
          payArray: JSON.stringify(this.payArray),
          user_info:JSON.stringify(this.user_info),
          store_info:JSON.stringify(this.store_info),
          itemList:JSON.stringify( res['data'])
        }
      };
     
      this.rout.navigate(['folder/edit-sales'], navigationExtras); 
     }, (err) => {
     //console.log(err);
     this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
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

  async presentAlertConfirm(j_ref?) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'تأكيد!',
      mode:'ios' ,
      message: 'هل تريد حذف السجل ؟ ',
      buttons: [
        {
          text: 'إلغاء',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'موافق',
          id: 'confirm-button',
          handler: () => {
            this.deleteSalesInvo(j_ref)
          }
        }
      ]
    });
  
    await alert.present();
  }

  delete(j_ref){
    this.presentAlertConfirm(j_ref)
  }

  deleteSalesInvo(j_ref){ 
    this.presentLoadingWithOptions('جاري حذف البيانات ...')
     this.api.deleteJournal(j_ref).subscribe(data => {
     //console.log(data)
     if (data['message'] != 'Post Not Deleted') {
     this.deleteJfrom(j_ref)
     }else{
      this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
     }
   },(err) => {
     //console.log(err);
     this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
    }) 
  }

  deleteJfrom(j_ref){  
    this.api.deleteJFrom(j_ref).subscribe(data => {
    //console.log(data)
    if (data['message'] != 'Post Not Deleted') {
    
      this.deleteJto(j_ref) 

      
    }else{
     this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
    }
  },(err) => {
    //console.log(err);
    this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
    
   },() => {
     this.loadingController.dismiss()
   }) 
 }

 deleteJto(j_ref){  
  this.api.deleteJto(j_ref).subscribe(data => {
  //console.log(data)
  if (data['message'] != 'Post Not Deleted') { 
      //console.log(' case ffff ' ,this.sales)
      this.presentToast('تم الحذف بنجاح' , 'success')
      this.search()
  }else{
   this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
  }
},(err) => {
  //console.log(err);
  this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
  
 },() => {
   this.loadingController.dismiss()
 }) 
}

}
