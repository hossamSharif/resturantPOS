import { Component, OnInit } from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import {  AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common'; 
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router'
import { PrintModalPage } from '../print-modal/print-modal.page';
import { FilterPipe } from './pipe';

@Component({
  selector: 'app-spend-record2',
  templateUrl: './spend-record2.page.html',
  styleUrls: ['./spend-record2.page.scss'],
})

export class SpendRecord2Page implements OnInit { 
    jdetailsFrom:Array<any> =[]
    jdetailsTo:Array<any> =[]
    payArray:Array<any> =[]
    purchase:Array<any> =[]
    sales:Array<any> =[]
    printArr:Array<any> =[]
    searchTerm :any
    showEmpty :boolean = false
    searchResult :Array<any> =[]
    searchMode : boolean =     false
    store_info : {id:any , location :any ,store_name:any , store_ref:any }
    user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
    printMode :boolean =false
    itemList :Array<any> =[]
    paInvo :any
    dateFrom :any;
    dateTo :any;
    radioVal : any = 0
    startingDate :any
    device:any =''
    endDate :any
    loading:boolean = false
    year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
    constructor(private platform :Platform  ,private alertController: AlertController,private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
     this.searchTerm =""
     this.checkPlatform()
     this.getAppInfo()
      let d = new Date
      this.startingDate = this.datePipe.transform(d, 'yyyy-MM-dd')
      this.endDate = this.datePipe.transform(d, 'yyyy-MM-dd')
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
          this.getTopSales()
       }
     });
   }
  
   ionViewDidEnter(){
     //console.log('ionViewDidEnter')
    this.getAppInfo()
    }
  
    ngOnInit() {
  
    }
   
    // filterItems(searchTerm) {
    //   //console.log(searchTerm)  
    //   this.searcResult = this.items.filter(item => item.item_name.toLowerCase().includes(searchTerm.toLowerCase())) 
    //   //console.log(this.searcResult) 
    // }
  
     printInvo(printarea , data){ 
      this.paInvo = data 
       //console.log( this.paInvo) 
       this.api.getPayInvoDetail(this.store_info.id , data.pay_ref ,this.year.id).subscribe(data =>{
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
   

    searchItem(ev){ 
      this.searchMode = true
      const filterPipe = new FilterPipe;  
      let  fiteredArr :any
      fiteredArr = filterPipe.transform(this.payArray,ev.target.value); 
      this.searchResult = fiteredArr  
    }


    getTopSales(){
      this.payArray=[]
      this.loading = true
      this.api.getTopJournale(this.store_info.id , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){
          this.payArray = res['data'] 
          this.getTopJto()
        }
         this.loading =false
         //this.getTopPurchase()
         if(this.payArray.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false
        //console.log(this.payArray)
       }, (err) => {
       //console.log(err);
       this.loading =false
     })  
     }
  
     getTopPurchase(){
      this.purchase = []
      this.api.getTopPerch(this.store_info.id , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         this.purchase = res['data']
         this.getTopSales() 
       }, (err) => {
       //console.log(err);
       this.loading =false
     })  
     }
  
     getTopSalesRec(){
      this.sales = []
      this.api.getTopSales(this.store_info.id , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         this.sales = res['data'] 
         this.prepareArray()
       }, (err) => {
       //console.log(err);
       this.loading = false
     })  
     }
  
     prepareArray(){
      this.payArray.forEach((element)=>{
        let std = element.standard_details
        let fromMainInd = std.indexOf("الي")
        let fromMain = std.substring(0,fromMainInd) 
        //console.log( "fromMain" ,fromMainInd ,fromMain,)
        let toMain = std.substring(fromMainInd, element.standard_details.length)
        //console.log( "toMain" ,toMain)
        element.from1 = fromMain.substring(3,fromMain.lenght)
        element.to1 = toMain.substring(3,toMain.lenght)
  
        // fromMain = fromMain.substring(4,fromMain.lenght)
        // toMain = toMain.substring(3,toMain.lenght)
  
        //from1
        // let from1Ind = fromMain.indexOf(",")
        // if(from1Ind == -1){
        //   element.from1 = fromMain
        // }else{
        //    element.from1 = fromMain.substring(0,from1Ind)
        //    //console.log( "from1" ,element.from1)
  
        //    let newstr =  element.from1.substring(from1Ind , element.from1.length)
        //    let from2Ind = newstr.indexOf(",")
        //    if(from2Ind == -1){
        //     element.from2 = fromMain.substring(element.from1.length, fromMain.length)
        //     //console.log( "from2" ,element.from2)
        //    }else{
        //     element.from2 = newstr.substring(0,from2Ind)
        //     //console.log( "newstr" ,element.from2)
           
        //     let from3Ind = newstr.indexOf(",")
        //     if(from3Ind == -1){
              
        //     }else{
        //       element.from3 =  element.newstr.substring(element.from2.length , newstr.length)
        //       //console.log( "newstr2" ,element.from3)
        //     }
           
            
        //    }
        // }
  
        // to
         //to
        //  let to1Ind = toMain.indexOf(",")
        //  if(to1Ind == -1){
        //    element.to1 = toMain
        //    //console.log( "to1" ,element.to1)
        //  }else{
        //     element.to1 = toMain.substring(0,to1Ind)
        //     //console.log( "to1" ,element.to1)
   
        //     let newstr =  element.to1.substring(to1Ind , element.to1.length)
        //     let to2Ind = newstr.indexOf(",")
        //     if(to2Ind == -1){
        //      element.to2 = toMain.substring(element.to1.length, toMain.length)
        //      //console.log( "to2" ,element.to2)
        //     }else{
        //      element.to2 = newstr.substring(0,to2Ind)
        //      //console.log( "newstrto" ,element.to2)
            
        //      let to3Ind = newstr.indexOf(",")
        //      if(to3Ind == -1){
               
        //      }else{
        //        element.from3 =  element.newstr.substring(element.from2.length , newstr.length)
        //        //console.log( "newstr2to" ,element.from3)
        //      }
            
             
        //     }
        //  } 
      })
  
  
      this.payArray.forEach((element)=>{ 
        let fltFrom :Array<any> = []
        fltFrom =  this.jdetailsFrom.filter(x=>x.j_ref == element.j_ref)
        //console.log('fltFrom' ,fltFrom)
        fltFrom = fltFrom.sort((a, b) => (a.id < b.id ? -1 : 1));
        //console.log('sorted fltFrom' ,fltFrom)
        if(fltFrom.length > 0){
          for (let i = 0; i < fltFrom.length; i++) {
            const element2 = fltFrom[i];
            if(i==0){
              element.debit= element2.debit
  
            }else if(i==1){
              element.debit2= element2.debit
  
            }else if(i == 2){
              element.debit3= element2.debit
  
            }
            
          }
        }  
        let fltTo :Array<any> = []
        fltTo =  this.jdetailsTo.filter(x=>x.j_ref == element.j_ref)
        //console.log('fltTo' ,fltFrom)
        fltTo = fltTo.sort((a, b) => (a.id < b.id ? -1 : 1));
        //console.log('sortedfltTo' ,fltFrom)
        if(fltTo.length > 0){
          for (let i = 0; i < fltTo.length; i++) {
            const element3 = fltTo[i];
            if(i == 0){
              element.credit= element3.credit
  
            }else if(i ==  1){
              element.credit2= element3.credit
  
            }else if(i == 2){
              element.credit3= element3.credit
            }
            
          }
        }  
  
      })
     }
  
     getSalesByDate(){
      this.payArray=[]
      //console.log(this.store_info.id,this.startingDate) 
      this.api.getJournaleByDate(this.store_info.id , this.startingDate , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){
          this.payArray = res['data'] 
        }
        this.getJFromByDate()
         if(this.payArray.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false
        //console.log(this.payArray)
         // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
       }, (err) => {
       //console.log(err);
     })  
     }
  
  
     getPurchByDate(){  
      this.purchase =[] 
      this.api.getPerchByDate(this.store_info.id , this.startingDate , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){ 
         this.purchase = res['data'] 
       } 
       }, (err) => {
       //console.log(err);
      
     },()=>{
      
     }
     )  
     }
  
     getSalesrecByDate(){  
      this.sales =[] 
      this.api.getSalesByDate(this.store_info.id , this.startingDate , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){ 
         this.sales = res['data'] 
       } 
       }, (err) => {
       //console.log(err);
      
     },()=>{
      
     }
     )  
     }
  
     getSales2Date(){ 
      this.payArray=[]
      this.loading=true
      //console.log(this.store_info.id,this.startingDate,this.endDate)
      this.api.getJournale2Date(this.store_info.id,this.startingDate,this.endDate , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){
          this.payArray = res['data'] 
        }
        this.getJTo2Date()
         if(this.payArray.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false
        //console.log(this.payArray)
         // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
       }, (err) => {
        this.loading=false
       //console.log(err);
     })  
     }
  
     getTopJto(){
      this.jdetailsTo=[]
      this.loading = true
      this.api.getTopJTo(this.store_info.id , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){
          this.jdetailsTo = res['data'] 
       //   this.jdetailsTo = this.jdetailsTo.filter(x=>x.ac_id == this.selectedAccount.id)
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
      this.api.getTopJfrom(this.store_info.id , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){
          this.jdetailsFrom = res['data']
        //  this.jdetailsFrom = this.jdetailsFrom.filter(x=>x.ac_id == this.selectedAccount.id)
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
      this.api.getJFromByDate(this.store_info.id , this.startingDate , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){
          this.jdetailsFrom = res['data']
         // this.jdetailsFrom = this.jdetailsFrom.filter(x=>x.ac_id == this.selectedAccount.id)
         }
            this.getJToByDate()
       }, (err) => {
       //console.log(err);
       this.loading = false
     })  
     }
  
  
     getJToByDate(){  
      this.jdetailsTo =[] 
      this.api.getJToByDate(this.store_info.id , this.startingDate , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data
         if(res['message'] != 'No record Found'){
          this.jdetailsTo = res['data'] 
         // this.jdetailsTo = this.jdetailsTo.filter(x=>x.ac_id == this.selectedAccount.id)
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
      this.api.getJTo2Date(this.store_info.id,this.startingDate,this.endDate , this.year.id).subscribe(data =>{
         //console.log(data)
         let res = data 
        if(res['message'] != 'No record Found'){
          this.jdetailsTo = res['data'] 
         // this.jdetailsTo = this.jdetailsTo.filter(x=>x.ac_id == this.selectedAccount.id)
        } 
         this.getJFrom2Date()
         this.loading = false
       }, (err) => {
        this.loading=false
        //console.log(err);
     })  
     }
  
     getJFrom2Date(){ 
      this.jdetailsFrom =[] 
      this.loading = true
      //console.log(this.store_info.id,this.startingDate,this.endDate)
      this.api.getJFrom2Date(this.store_info.id,this.startingDate,this.endDate , this.year.id).subscribe(data =>{
        //console.log('getJFrom2Date',data)
        let res = data
        if(res['message'] != 'No record Found'){
          this.jdetailsFrom = res['data']
        //  this.jdetailsFrom = this.jdetailsFrom.filter(x=>x.ac_id == this.selectedAccount.id)
         }  
        this.prepareArray()
      }, (err) => {
      //console.log(err);
      this.loading=false
    },()=>{
      this.loading = false
    }
    )  
    }
  
  
  //purchases
   getPurchase2Date(){ 
    this.purchase =[] 
    //console.log(this.store_info.id,this.startingDate,this.endDate)
    this.api.getPerch2Date(this.store_info.id,this.startingDate,this.endDate , this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.purchase = res['data'] 
      }  
     }, (err) => {
     //console.log(err);
   },()=>{
   
   }
   )  
   }
  
   getSalesrec2Date(){ 
    this.sales =[] 
    //console.log(this.store_info.id,this.startingDate,this.endDate)
    this.api.getSales2Date(this.store_info.id,this.startingDate,this.endDate , this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.sales = res['data'] 
      }  
     }, (err) => {
     //console.log(err);
   },()=>{
   
   }
   )  
   }
  
  
   radioChange(ev){
    //console.log(ev.target.value) 
    this.payArray = [] 
    this.showEmpty = false
    this.loading = false
   }
  
  
     search(){
      if (this.radioVal == 0) {
       this.getTopSales()
      } else if (this.radioVal == 1) {
         this.getSalesByDate()
      }else if (this.radioVal == 2) {
        this.getSales2Date()
  
      }
     }
  
     getPayInvoDetail(ref){
   //   this.presentLoadingWithOptions('جاري جلب التفاصيل ...')
      this.api.getPayInvoDetail(this.store_info.id , ref , this.year.id).subscribe(data =>{
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