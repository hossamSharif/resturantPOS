import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import {  LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common'; 
import { Storage } from '@ionic/storage';
import { Component, OnInit,Input } from '@angular/core'; 
import { NavigationExtras, Router } from '@angular/router'
import { PrintModalPage } from '../print-modal/print-modal.page';
@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.page.html',
  styleUrls: ['./account-modal.page.scss'],
})
export class AccountModalPage implements OnInit {
  @Input() type: any;
  @Input() sub_name: any;
  @Input() cust_id: any;
 
 
  segmentVal :any = 'sales'

  payArray2:Array<any> =[]
  payArray:Array<any> =[]
  printArr:Array<any> =[]
  initialInvoices:Array<any> =[]
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
  showError :boolean = false
  offline: boolean = false;
  salesLocal:Array<any> =[]
  sales:Array<any> =[]
  salesOffline:Array<any> =[]
  purchLocal:Array<any> =[]
  purchase:Array<any> =[]
  purchOffline:Array<any> =[]
  color :any ='dark'
  sums : {pay:any ,change:any,discount:any,tot:any,totAfterDiscout:any}
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any} 

  constructor(private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
    this.sums = {pay:0 ,change:0,discount:0,tot:0,totAfterDiscout:0} 
    let d = new Date
    this.startingDate = this.datePipe.transform(d, 'yyyy-MM-dd')
    this.endDate = this.datePipe.transform(d, 'yyyy-MM-dd')
  }


  
  ionViewDidEnter(){
    this.payArray =[]
    this.salesLocal =[]
    this.sales =[]
    this.salesOffline =[]
    //console.log('ionViewDidEnter')
    if(this.type == 'sales'){
      this.search()
    }else if(this.type == 'purch'){
      this.search2()
    }else{
      this.search()

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
       //this.search() 
     }
   });
   this.storage.get('sales').then((response) => {
    if (response) {
      this.sales = response 
       //console.log(this.sales)  
    }
  });
 }
  
 segmentChanged(ev){

  }

  radioChange(ev){
    //console.log(ev.target.value) 
    this.payArray = []
    this.salesLocal = []
    this.showEmpty = false
    this.loading = false
   } 


  ngOnInit() {
    this.payArray =[]
    this.payArray2 =[]
    //console.log('ngOnInit') 
    this.segmentVal = this.type 
    //console.log('seg' , this.type) 
    this.getAppInfo() 
  }


  printInvo(printarea , dataFrom){ 
    if (this.offline==false && dataFrom.pay_id != undefined) {
      this.paInvo = dataFrom 
      //console.log( this.paInvo) 
      this.api.getPayInvoDetail(this.store_info.id , dataFrom.pay_ref ,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data 
       this.itemList = res['data']
       //console.log(res) 
       this.printArr = []
       this.printArr.push({
       'payInvo': this.paInvo,
       'itemList':this.itemList,
       'selectedAccount' : this.paInvo.sub_name,
       'sub_nameNew' : "",
       'user_name' : this.paInvo.user_name
     }) 
      //console.log(this.printArr)
      this.presentModal(this.printArr , 'sales_record')
       }, (err) => {
        //console.log(err);
        this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
       },()=>{ 
       })     



      
    } else if (this.offline==false && dataFrom.pay_id == undefined) {
     console .log(dataFrom,dataFrom)
      
     //console.log(this.salesLocal ,'case2')
     let flt:Array<any> =[]
     flt = this.salesLocal.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here')

     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : "",
     'user_name' : this.paInvo.user_name
   }) 
    //console.log(this.printArr)
    this.presentModal(this.printArr , 'sales_record') 
    }else if (this.offline==true && dataFrom.pay_id != undefined) {
      
     this.loadingController.dismiss() 
     //console.log(this.sales ,'case3')
     let flt:Array<any> =[]
     flt = this.sales.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here')

     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : "",
     'user_name' : this.paInvo.user_name
   }) 
    //console.log(this.printArr)
    this.presentModal(this.printArr , 'sales_record') 
    }else if (this.offline==true && dataFrom.pay_id == undefined) {
     
      
     //console.log(this.salesLocal)
     let flt:Array<any> =[]
     flt = this.salesLocal.filter(x=>x.payInvo.pay_ref==dataFrom.pay_ref )
     //console.log(flt,'here')
     this.printArr = []
     this.printArr.push({
     'payInvo': flt[0].payInvo,
     'itemList':flt[0].itemList,
     'selectedAccount' : flt[0].payInvo.sub_name,
     'sub_nameNew' : "",
     'user_name' : this.paInvo.user_name
   }) 
    //console.log(this.printArr)
    this.presentModal(this.printArr , 'sales_record')  
    } 

//

    
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
        //console.log(dataReturned ) 
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
      mywindow.document.write('.flr2{display:inline-flex;float:right;} .flr{ display: block; float: right; } .show{ } .hide{width:0px;height:0px} .w45 {width:45%} .w50 {width:50%} .w100 {width:100%} .td2, .th2 {border: 0.5px solid #dddddd;text-align: center;padding: 8px;} td, th {border: 1px solid #dddddd;text-align: center;padding: 8px;} tr:nth-child(even) {background-color: #dddddd;} .table{text-align: center;width: 100%; margin: 12px;} .ion-margin{ margin: 10px; } .ion-margin-top{ margin-top: 10px; } .rtl {  direction: rtl; } .ion-text-center{ text-align: center; } .ion-text-end{ text-align: left; } .ion-text-start{ text-align: right; }')
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
    this.salesLocal =[]
    this.storage.get('salesLocal').then((response) => {
      if (response) {
        this.salesLocal = response
        //console.log(this.salesLocal)  
      } 
    });
  }

  getSalesOffline(){
    this.salesOffline =[]
    this.storage.get('sales').then((response) => {
      if (response) {
        this.salesOffline = response
        //console.log(this.salesOffline)  
      } 
    });
  }


  async closeModal() { 
    await this.modalController.dismiss();
  }

  async pickInvo(pay , sub_name){ 
    if(this.type == 'sales'){
      await this.modalController.dismiss([pay  , sub_name],'sales'); 
    }else if(this.type == 'purch'){
    await this.modalController.dismiss([pay  , sub_name],'purch'); 
    }
  }


  
  search(){
    this.showEmpty=false
    if (this.radioVal == 0) { 
     if (this.offline == true) {
      this.getTopSalesOffline()
    } else {
      this.getTopSales()
    }
    } else if (this.radioVal == 1) {
      
       if (this.offline == true) {
        this.getSalesByDateOffline()
      } else {
        this.getSalesByDate()
      }
    } else if (this.radioVal == 2) {
      if (this.offline == true) {
        this.getSales2DateOffline()
      } else {
        this.getSales2Date() 
      }
    } else if (this.radioVal == 3) {
      this.getInitialInvoices()
    }
   }

   search2(){
    this.showEmpty=false
    if (this.radioVal == 0) { 
     if (this.offline == true) {
      this.getTopSPurchOffline
    } else {
      this.getTopPurch()
    }
    } else if (this.radioVal == 1) {
      
       if (this.offline == true) {
        this.getPurchByDateOffline()
      } else {
        this.getPurchByDate()
      }
    } else if (this.radioVal == 2) {
      if (this.offline == true) {
        this.getPurch2DateOffline()
      } else {
        this.getPurc2Date() 
      }
    } else if (this.radioVal == 3) {
      this.getInitialInvoices()
    }
   }

   getInitialInvoices(){
    this.payArray=[]
    this.loading = true
    this.storage.get('initialInvoices').then((response2) => {
      if (response2) {
        let flt : Array<any> =[]
        flt= response2
        this.initialInvoices=flt 
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
    this.getTotal() 
   }

   getTotal(){
    this.sums.tot = this.payArray.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0);
    this.sums.change = this.payArray.reduce( (acc, obj)=> { return acc + +obj.changee; }, 0);
    this.sums.pay = this.payArray.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);
    this.sums.discount = this.payArray.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
    this.sums.totAfterDiscout =   + this.sums.tot - this.sums.discount 
    } 

   getTopSales(){ 
    this.getSalesfromLocal()
    this.loading = true
    this.api.getTopSales(this.store_info.id,this.year.id).subscribe(data =>{
       //console.log('hhhhhh',data)
       let res = data
       if(res['message'] != 'No record Found'){
         this.payArray = res['data'] 
         if(this.cust_id){
          this.payArray =this.payArray.filter(x=>x.cust_id == this.cust_id)  
         }
       }
       if(this.salesLocal.length >0){
        //console.log('locLaly',this.salesLocal)
        for (let i = 0; i < this.salesLocal.length; i++) {
          const element = this.salesLocal[i];
          if(this.cust_id){
            if(element.payInvo.cust_id == this.cust_id){
           this.payArray.push(element.payInvo)
         }
         }else{
           this.payArray.push(element.payInvo)
         }
          
        }
        this.getTotal()
        if(this.payArray.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false
        //console.log(this.payArray)
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
    this.salesLocal =[]
    this.sales =[]
    this.salesOffline=[]
    this.storage.get('salesLocal').then((response) => {
     if (response) {
       let flt : Array<any> =[]
       flt= response
       this.salesLocal=flt
       //console.log(flt)
       if (flt.length > 0) {
         for (let i = 0; i < flt.length; i++) {
           const element = flt[i];
           if (this.cust_id) {
             if (element.payInvo.cust_id == this.cust_id) {
               this.payArray.push(element.payInvo)
             }
           }else{
            this.payArray.push(element.payInvo)
           }
         
          
       } 

       }
     }
     // 
     this.storage.get('sales').then((response2) => {
      if (response2) {
        let flt : Array<any> =[]
        flt= response2
        this.salesOffline=flt
        this.sales= this.salesOffline
        //console.log(flt)
        if (flt.length > 0) {
          for (let i = 0; i < flt.length; i++) {
          const element = flt[i];
            if (this.cust_id) {
              if (element.payInvo.cust_id == this.cust_id) {
                this.payArray.push(element.payInvo)
              }
            }else{
              this.payArray.push(element.payInvo)
             }
        
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
    this.getTotal()
   });
  }

   getSalesByDate(){ 
    this.payArray=[]
    this.salesLocal =[]
    this.salesOffline=[]
    this.sales =[]
    //console.log(this.store_info.id,this.startingDate)
    this.getSalesfromLocal()
    this.loading = true
    this.api.getSalesByDate(this.store_info.id , this.startingDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){ 
        this.payArray = res['data'] 
        if(this.cust_id){
          this.payArray =this.payArray.filter(x=>x.cust_id == this.cust_id)  
         }
         
     }
     if(this.salesLocal.length >0){
      this.salesLocal = this.salesLocal.filter(x=>x.payInvo.pay_id==undefined && x.payInvo.pay_date==this.startingDate)
      //console.log('locLaly',this.salesLocal)
      for (let i = 0; i < this.salesLocal.length; i++) {
        const element = this.salesLocal[i];
        if(this.cust_id){
          if(element.payInvo.cust_id == this.cust_id){
         this.payArray.push(element.payInvo)
       }
       }else{
         this.payArray.push(element.payInvo)
       }
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
    this.salesLocal =[]
    this.sales =[]
    this.salesOffline=[]
    this.loading = true
    this.storage.get('salesLocal').then((response) => {
      if (response) {
        this.salesLocal = response
        
        let flt:Array<any> =[]
        //console.log('haloo',this.salesLocal) 
        flt = this.salesLocal.filter(x=> x.payInvo.pay_date==this.startingDate)
        if (flt.length>0) {
          for (let i = 0; i < flt.length; i++) {
            const element = flt[i];
            if(this.cust_id){
              if(element.payInvo.cust_id == this.cust_id){
             this.payArray.push(element.payInvo)
           }
           }else{
             this.payArray.push(element.payInvo)
           }
          } 
        }  
      }
      this.storage.get('sales').then((response2) => {
        if (response2) {
          this.salesOffline = response2
          this.sales= this.salesOffline
          //console.log(this.salesOffline) 
          let flt:Array<any> =[]
          flt = this.salesOffline.filter(x=> x.payInvo.pay_date==this.startingDate)
          if (flt.length>0) {
            for (let i = 0; i < flt.length; i++) {
              const element = flt[i];
              if(this.cust_id){
                 if(element.payInvo.cust_id == this.cust_id){
                this.payArray.push(element.payInvo)
              }
              }else{
                this.payArray.push(element.payInvo)
              }
             
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
      this.getTotal()
     
    });

 
   }


   getSales2Date(){
    this.payArray=[]
    this.salesLocal =[]
    this.sales =[]
    this.salesOffline=[]
    this.getSalesfromLocal()
    this.loading = true
    //console.log(this.store_info.id,this.startingDate,this.endDate)
    this.api.getSales2Date(this.store_info.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.payArray = res['data'] 
        if(this.cust_id){
          this.payArray =this.payArray.filter(x=>x.cust_id == this.cust_id)  
         }
      } 
      
     
     if(this.salesLocal.length >0){
      this.salesLocal = this.salesLocal.filter(x=>x.payInvo.pay_date>=this.startingDate && x.payInvo.pay_date<=this.endDate)
      //console.log('locLaly',this.salesLocal)
      for (let i = 0; i < this.salesLocal.length; i++) {
        const element = this.salesLocal[i];
        if( this.cust_id){ 
        if(element.payInvo.cust_id == this.cust_id){
          this.payArray.push(element.payInvo)
          }
         }else{
          this.payArray2.push(element.payInvo)
        }
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
    this.salesLocal =[]
    this.sales =[]
    this.salesOffline=[]
    this.loading = true
    this.storage.get('salesLocal').then((response) => {
      if (response) {
        this.salesLocal = response
        //console.log(this.salesLocal) 
        let flt:Array<any> =[]
        flt =this.salesLocal.filter(x=>x.payInvo.pay_date>=this.startingDate && x.payInvo.pay_date<=this.endDate)
        if (flt.length>0) {
          for (let i = 0; i < flt.length; i++) {
            const element = flt[i];
            if( this.cust_id){ 
             if(element.payInvo.cust_id == this.cust_id){
              this.payArray.push(element.payInvo)
            }
          }else{
            this.payArray2.push(element.payInvo)
          }
          } 
        }  
      } 
      this.storage.get('sales').then((response2) => {
        if (response2) {
          this.salesOffline = response2
          this.sales= this.salesOffline
          //console.log(this.salesOffline) 
          let flt:Array<any> =[]
          flt =this.salesOffline.filter(x=>x.payInvo.pay_date>=this.startingDate && x.payInvo.pay_date<=this.endDate)
          if (flt.length>0) {
            for (let i = 0; i < flt.length; i++) {
              const element = flt[i];
              if( this.cust_id){ 
                 if(element.payInvo.cust_id == this.cust_id){
                this.payArray.push(element.payInvo)
              }
              }else{
                this.payArray.push(element.payInvo)
              } 
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
      this.getTotal()
    }); 
  }

   showLoadingSk(){
     setTimeout(() => {
       
     }, 3000);
   }


   getTopPurch(){ 
    this.getPurchfromLocal()
    this.loading = true
    this.api.getTopPerch(this.store_info.id,this.year.id).subscribe(data =>{
       //console.log('hhhhhh',data)
       let res = data
       if(res['message'] != 'No record Found'){
         this.payArray2 = res['data']
         if( this.cust_id){ 
         this.payArray2 =this.payArray2.filter(x=>x.cust_id == this.cust_id) 
          
        }
       }
       if(this.purchLocal.length >0){
        //console.log('locLaly',this.purchLocal)
        for (let i = 0; i < this.purchLocal.length; i++) {
          const element = this.purchLocal[i];
          if( this.cust_id){
          if(element.payInvo.cust_id == this.cust_id){
            this.payArray2.push(element.payInvo)
          }
        }else{
          this.payArray2.push(element.payInvo)
        }
        }
        this.getTotal()
        if(this.payArray2.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false
        //console.log(this.payArray2)
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

 

   getTopSPurchOffline(){
    //console.log('getTopSalesOffline')
    this.payArray2=[]
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
         if( this.cust_id){
         if(element.payInvo.cust_id == this.cust_id){
           this.payArray2.push(element.payInvo)
         }
         }else{
          this.payArray2.push(element.payInvo)
        }
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
          this.payArray2.push(element.payInvo)
        } 
        }
      }
      this.getTotal()

      if(this.payArray2.length==0){
        this.showEmpty = true
      }else{
        this.showEmpty = false
      }
      this.loading=false
    });
    this.getTotal()
   });
  }

 
  
  getPurchByDate(){ 
    this.payArray2=[]
    this.purchLocal =[]
    this.purchOffline=[]
    this.purchase =[]
    //console.log(this.store_info.id,this.startingDate)
    this.getPurchfromLocal()
    this.loading = true
    this.api.getPerchByDate(this.store_info.id , this.startingDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){ 
         this.payArray2 = res['data']
         if( this.cust_id){ 
          this.payArray2 =this.payArray2.filter(x=>x.cust_id == this.cust_id) 
           
         } 
     }
     if(this.purchLocal.length >0){
      this.purchLocal = this.purchLocal.filter(x=>x.payInvo.pay_id==undefined && x.payInvo.pay_date==this.startingDate)
      //console.log('locLaly',this.purchLocal)
      for (let i = 0; i < this.purchLocal.length; i++) {
        const element = this.purchLocal[i];
        if( this.cust_id){
        if(element.payInvo.cust_id == this.cust_id){
          this.payArray2.push(element.payInvo)
        }
      }else{
        this.payArray2.push(element.payInvo)
      }
      }
      this.getTotal()

      if(this.payArray2.length==0){
        this.showEmpty= true
      }else{
        this.showEmpty = false
      }
      this.loading=false
      //console.log(this.payArray)

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

 
   getPurchByDateOffline(){
    this.payArray2=[]
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
            if( this.cust_id){ 
              if(element.payInvo.cust_id == this.cust_id){
                this.payArray2.push(element.payInvo)
              }
            }else{
              this.payArray2.push(element.payInvo)
            }
            
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
              if( this.cust_id){
              if(element.payInvo.cust_id == this.cust_id){
                this.payArray2.push(element.payInvo)
              } 
            }else{
              this.payArray2.push(element.payInvo)
            } 
           }
          } 
        }
        this.getTotal()
       
        if(this.payArray2.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false

      });
      this.getTotal() 
     
    });

 
   }

   getPurchfromLocal(){
    this.purchLocal =[]
    this.storage.get('purchLocal').then((response) => {
      if (response) {
        this.purchLocal = response
        //console.log(this.purchLocal)  
      } 
    });
  }

   getPurc2Date(){
    this.payArray2=[]
    this.purchLocal =[]
    this.purchOffline=[]
    this.purchase =[]
    this.getPurchfromLocal()
    this.loading = true
    //console.log(this.store_info.id,this.startingDate,this.endDate)
    this.api.getPerch2Date(this.store_info.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
       //console.log(data)
       let res = data
       if(res['message'] != 'No record Found'){
        this.payArray2 = res['data']
        if( this.cust_id){ 
          this.payArray2 =this.payArray2.filter(x=>x.cust_id == this.cust_id) 
           
         }
      } 
      
     
     if(this.purchLocal.length >0){
      this.purchLocal = this.purchLocal.filter(x=>x.payInvo.pay_date>=this.startingDate && x.payInvo.pay_date<=this.endDate)
      //console.log('locLaly',this.purchLocal)
      for (let i = 0; i < this.purchLocal.length; i++) {
        const element = this.purchLocal[i];
        if( this.cust_id){
        if(element.payInvo.cust_id == this.cust_id){
          this.payArray2.push(element.payInvo)
        }
       }else{
        this.payArray2.push(element.payInvo)
      }
      }
      //console.log(this.payArray)
    
      this.getTotal()
      if(this.payArray2.length==0){
        this.showEmpty = true
      }else{
        this.showEmpty = false
      }
      this.loading=false
     }
     this.getTotal()
     }, (err) => {
     //console.log(err);
   },()=>{
    this.loading = false
   }
   )  
   }
  

   getPurch2DateOffline(){
    this.payArray2=[]
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
            if( this.cust_id){
            if(element.payInvo.cust_id == this.cust_id){
              this.payArray2.push(element.payInvo)
            }
          }else{
            this.payArray2.push(element.payInvo)
          }
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
              if( this.cust_id){
              if(element.payInvo.cust_id == this.cust_id){
                this.payArray2.push(element.payInvo)
              }
            }else{
              this.payArray2.push(element.payInvo)
            }
            } 
          }  
        } 
       
        this.getTotal()
        if(this.payArray2.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
        this.loading=false 
      });
      this.getTotal()
    });  
  }
  

   getPayInvoDetail(pay,sub_name,status){
    console .log(pay,sub_name,status)
    this.presentLoadingWithOptions('جاري جلب التفاصيل ...')
    if(this.radioVal == 3){
      console .log(pay,sub_name,status)
      this.loadingController.dismiss() 
      //console.log(this.salesLocal ,'case2')
      let flt:Array<any> =[]
      flt = this.initialInvoices.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
      //console.log(flt,'here')
      let navigationExtras: NavigationExtras = {
       queryParams: {
         payInvo: JSON.stringify(flt[0].payInvo),
         sub_name: JSON.stringify(flt[0].payInvo.sub_name),
         user_info:JSON.stringify(this.user_info),
         store_info:JSON.stringify(this.store_info),
         itemList:JSON.stringify(flt[0].itemList),
          initialInvoices : true
       }
     };
     this.rout.navigate(['folder/sales'], navigationExtras); 
     this.modalController.dismiss()
    }else{
      if (this.offline==false && pay.pay_id != undefined) {
        this.api.getPayInvoDetail(this.store_info.id , pay.pay_ref,this.year.id).subscribe(data =>{
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
         this.modalController.dismiss()
         this.rout.navigate(['folder/edit-sales'], navigationExtras); 
       
        }, (err) => {
        //console.log(err);
        this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
      })  
      } else if (this.offline==false && pay.pay_id == undefined) {
       console .log(pay,sub_name,status)
       this.loadingController.dismiss() 
       //console.log(this.salesLocal ,'case2')
       let flt:Array<any> =[]
       flt = this.salesLocal.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
       //console.log(flt,'here')
       let navigationExtras: NavigationExtras = {
        queryParams: {
          payInvo: JSON.stringify(flt[0].payInvo),
          sub_name: JSON.stringify(flt[0].payInvo.sub_name),
          user_info:JSON.stringify(this.user_info),
          store_info:JSON.stringify(this.store_info),
          itemList:JSON.stringify(flt[0].itemList)
        }
      };
      this.modalController.dismiss()
      this.rout.navigate(['folder/edit-sales'], navigationExtras); 
      }else if (this.offline==true && pay.pay_id != undefined) {
       console .log(pay,sub_name,status)
       this.loadingController.dismiss() 
       //console.log(this.sales ,'case3')
       let flt:Array<any> =[]
       flt = this.sales.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
       //console.log(flt,'here')
       let navigationExtras: NavigationExtras = {
        queryParams: {
          payInvo: JSON.stringify(flt[0].payInvo),
          sub_name: JSON.stringify(flt[0].payInvo.sub_name),
          user_info:JSON.stringify(this.user_info),
          store_info:JSON.stringify(this.store_info),
          itemList:JSON.stringify(flt[0].itemList)
        }
      };
      this.modalController.dismiss()
      this.rout.navigate(['folder/edit-sales'], navigationExtras); 
      }else if (this.offline==true && pay.pay_id == undefined) {
       console .log(pay,sub_name,status)
       this.loadingController.dismiss() 
       //console.log(this.salesLocal)
       let flt:Array<any> =[]
       flt = this.salesLocal.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
       //console.log(flt,'here')
       let navigationExtras: NavigationExtras = {
        queryParams: {
          payInvo: JSON.stringify(flt[0].payInvo),
          sub_name: JSON.stringify(flt[0].payInvo.sub_name),
          user_info:JSON.stringify(this.user_info),
          store_info:JSON.stringify(this.store_info),
          itemList:JSON.stringify(flt[0].itemList)
        }
      };
      this.modalController.dismiss()
      this.rout.navigate(['folder/edit-sales'], navigationExtras); 
      }
    }
    
  }

  getPayInvoDetail2(pay,sub_name,status){
    console .log(pay,sub_name,status)
    this.presentLoadingWithOptions('جاري جلب التفاصيل ...')
    if(this.radioVal == 3){
      console .log(pay,sub_name,status)
      this.loadingController.dismiss() 
      //console.log(this.purchLocal ,'case2')
      let flt:Array<any> =[]
      flt = this.initialInvoices.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
      //console.log(flt,'here')
      let navigationExtras: NavigationExtras = {
       queryParams: {
         payInvo: JSON.stringify(flt[0].payInvo),
         sub_name: JSON.stringify(flt[0].payInvo.sub_name),
         user_info:JSON.stringify(this.user_info),
         store_info:JSON.stringify(this.store_info),
         itemList:JSON.stringify(flt[0].itemList),
          initialInvoices : true
       }
     };
     this.rout.navigate(['folder/purchase'], navigationExtras); 
     this.modalController.dismiss()
    }else{
      if (this.offline==false && pay.pay_id != undefined) {
        this.api.getPayInvoDetail(this.store_info.id , pay.pay_ref,this.year.id).subscribe(data =>{
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
         this.modalController.dismiss()
         this.rout.navigate(['folder/edit-sales'], navigationExtras); 
        }, (err) => {
        //console.log(err);
        this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
      })  
      } else if (this.offline==false && pay.pay_id == undefined) {
       console .log(pay,sub_name,status)
       this.loadingController.dismiss() 
       //console.log(this.salesLocal ,'case2')
       let flt:Array<any> =[]
       flt = this.salesLocal.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
       //console.log(flt,'here')
       let navigationExtras: NavigationExtras = {
        queryParams: {
          payInvo: JSON.stringify(flt[0].payInvo),
          sub_name: JSON.stringify(flt[0].payInvo.sub_name),
          user_info:JSON.stringify(this.user_info),
          store_info:JSON.stringify(this.store_info),
          itemList:JSON.stringify(flt[0].itemList)
        }
      };
      this.modalController.dismiss()
      this.rout.navigate(['folder/edit-perch'], navigationExtras); 
      }else if (this.offline==true && pay.pay_id != undefined) {
       console .log(pay,sub_name,status)
       this.loadingController.dismiss() 
       //console.log(this.sales ,'case3')
       let flt:Array<any> =[]
       flt = this.sales.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
       //console.log(flt,'here')
       let navigationExtras: NavigationExtras = {
        queryParams: {
          payInvo: JSON.stringify(flt[0].payInvo),
          sub_name: JSON.stringify(flt[0].payInvo.sub_name),
          user_info:JSON.stringify(this.user_info),
          store_info:JSON.stringify(this.store_info),
          itemList:JSON.stringify(flt[0].itemList)
        }
      };
      this.modalController.dismiss()
      this.rout.navigate(['folder/edit-perch'], navigationExtras); 
      }else if (this.offline==true && pay.pay_id == undefined) {
       console .log(pay,sub_name,status)
       this.loadingController.dismiss() 
       //console.log(this.salesLocal)
       let flt:Array<any> =[]
       flt = this.salesLocal.filter(x=>x.payInvo.pay_ref==pay.pay_ref )
       //console.log(flt,'here')
       let navigationExtras: NavigationExtras = {
        queryParams: {
          payInvo: JSON.stringify(flt[0].payInvo),
          sub_name: JSON.stringify(flt[0].payInvo.sub_name),
          user_info:JSON.stringify(this.user_info),
          store_info:JSON.stringify(this.store_info),
          itemList:JSON.stringify(flt[0].itemList)
        }
      };
      this.modalController.dismiss()
      this.rout.navigate(['folder/edit-perch'], navigationExtras); 
      }
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
