import { Component, OnInit, ViewChild, ElementRef ,Renderer2,Input} from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import { AlertController, IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { AuthServiceService } from '../auth/auth-service.service';
import { PrintModalPage } from '../print-modal/print-modal.page';
import { NavigationExtras, Router } from '@angular/router'
@Component({
  selector: 'app-items-report',
  templateUrl: './items-report.page.html',
  styleUrls: ['./items-report.page.scss'],
})
export class ItemsReportPage implements OnInit {
  @ViewChild("dst") nameField: ElementRef;
  @ViewChild('qtyId') qtyId; 
  payArray :Array<any> = []
  payArrayDaily :Array<any> = []
  perchDetailsArr :Array<any> = []
  payDetailsArr :Array<any> = []
  tswiaDetailsArr :Array<any> = []
   currenQty:any = 0
   firstQty:any = 0
   perchTotQty:any = 0
   payTotQty:any = 0
   perchTot :any = 0
   payTot :any = 0
   searchLang :any = 0
  sub_account1:Array<any> =[]
  sub_account2:Array<any> =[]
  sub_accountLocalSales:Array<any> =[]
  sub_accountLocalPurch:Array<any> =[]
  sub_accountSales:Array<any> =[]
  sub_accountPurch:Array<any> =[]
  items:Array<any> =[]
  itemsLocal:Array<any> =[]
  itemList:Array<any> =[]
  salesLocal:Array<any> =[]
  loading:boolean = false ;
  sales:Array<any> =[]
  randomsNumber:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  sub_nameNew :any = ""
  selectedItem : {id:any ,pay_ref:any,item_name:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,parcode:any,qty:any,tot:any ,dateCreated:any,availQty:any,firstQuantity:any};
  selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any};
  payInvo : {pay_id:any ,pay_ref:any ,store_id:any,tot_pr:any,pay:any,pay_date:any,pay_time:any,user_id:any,cust_id:any,pay_method:any,discount:any ,changee:any,sub_name:any};
  radioVal : any = 0
  printMode :boolean = false
  printArr:Array<any> =[]
  offline: boolean = false;
  color :any ='dark'
  totSales:any = 0
  totPurch:any = 0
  showEmpty :boolean = false
  showError :boolean = false
  startingDate :any
  endDate :any
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
  loadingItems:boolean = false
  constructor(private rout : Router,private renderer : Renderer2,private modalController: ModalController,private alertController: AlertController, private authenticationService: AuthServiceService,private storage: Storage,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) {
    this.selectedItem = {
      id:undefined,
      dateCreated:"",
      pay_ref:"",
      item_desc:"",
      item_name:"",
      item_unit:"",
      parcode:0,
      pay_price:0,
      perch_price:0,
      qty:0,
      tot:0,
      availQty:0,
      firstQuantity:0
    }
    let d = new Date
    this.startingDate = this.datePipe.transform(d, 'yyyy-MM-dd')
    this.endDate = this.datePipe.transform(d, 'yyyy-MM-dd')
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

  ionViewDidEnter(){
    if (this.selectedItem.id){
      this.search()
      //console.log('im sarching for you')
    }
  }

  ngOnInit() {
    this.prepareOffline()
    this.getAppInfo()  
  // this.getItems() 
    this.getStockItems() 
  }

  getStockItems() {
    this.loadingItems = true
    this.storage.get('year').then((response) => {
      if (response) {
        this.year = response 
         if (this.offline == false) {
      this.api.stockItems(1,this.year.id).subscribe(data => {
        //console.log(data)
        let res = data
        this.items = res['data']
        this.items.forEach(element => {
          if(+element.tswiaQuantity > 0){
            element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 

          }else if(+element.tswiaQuantity < 0){
            element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
          }

          element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
          element.availQty = +element.quantity
          
        });
      }, (err) => {
        //console.log(err);
        this.loadingItems = false
      },
        () => {
          this.loadingItems = false
        }
      )
    } else {
      this.items = this.itemsLocal
      this.items.forEach(element => {
        if(+element.tswiaQuantity > 0){
          element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity  
        }else if(+element.tswiaQuantity < 0){
          element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
        }
        element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
        element.availQty = +element.quantity
      });  
    }
      } 
    });
  }

  // sumStocksItems(){
  //   this.api.stockItems(1).subscribe(data => {
  //     //console.log(data)
  //     let res = data
  //     let arr = res['data']
  //     for (let index = 0; index < this.items.length; index++) {
  //       const element = this.items[index];
  //       let flt = arr.filter(x=>x.id == element.id)
  //       if(flt.length>0){
  //         //console.log('here we are ')
  //         element.perchQuantity =  +element.perchQuantity + +flt[0].perchQuantity
  //       //  element.firstQuantity =  +element.firstQuantity + +flt[0].firstQuantity
  //         element.salesQuantity =  +element.salesQuantity + +flt[0].salesQuantity
  //       }
  //     } 
  //     this.items.forEach(element => {
  //       element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
  //     });
      
  //   }, (err) => {
  //     //console.log(err);
  //   },
  //     () => {
  //     }
  //   )
  // }

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
          
        }
      });  
      this.storage.get('searchLang').then((response) => {
        if (response) {
          this.searchLang = response
          //console.log('searchLang' ,this.searchLang) 
        }
      }); 
    }
 
    getSalesAccount(){
      if (this.offline == false) {
      this.api.getSalesAccounts(this.store_info.id,this.year.id).subscribe(data =>{
        let res = data
        this.sub_account1 = res ['data']
        //console.log(this.sub_account1)
          this.addSubaccountLocal()
      }, (err) => {
      //console.log(err);
    }) 
    }else{
      this.MixSubaccountSalesOffline()
    } 
    }
 
  
 addSubaccountLocal(){
  if (this.sub_account1) {
    if (this.sub_accountLocalSales) {
      for (let i = 0; i < this.sub_accountLocalSales.length; i++) {
        const element = this.sub_accountLocalSales[i];
        this.sub_account1.push(element)
      }
    }
  } else{
    if (this.sub_accountLocalSales) {
      this.sub_account1 = this.sub_accountLocalSales 
    }
  } 
  }

//Yaw
  MixSubaccountSalesOffline(){
    this.sub_account1=[] 
      if (this.sub_accountLocalSales) {
        for (let i = 0; i < this.sub_accountLocalSales.length; i++) {
          const element = this.sub_accountLocalSales[i];
          this.sub_account1.push(element)
        }
      }

      if (this.sub_accountSales) {
        for (let i = 0; i < this.sub_accountSales.length; i++) {
          const element = this.sub_accountSales[i];
          this.sub_account1.push(element)
        }
      } 
    }

///

getPurchAccount(){
  if (this.offline == false) {
    this.api.getPerchAccounts(this.store_info.id,this.year.id).subscribe(data =>{
       let res = data
       this.sub_account1 = res ['data']
       //console.log(this.sub_account1)
        this.addSubaccountLocalPurch()
     }, (err) => {
     //console.log(err);
   }) 
  }else{
    this.MixSubaccountPurchOffline()
   } 
 } 

addSubaccountLocalPurch(){
  if (this.sub_account2) {
    if (this.sub_accountLocalPurch) {
      for (let i = 0; i < this.sub_accountLocalPurch.length; i++) {
        const element = this.sub_accountLocalPurch[i];
        this.sub_account2.push(element)
      }
    }
  } else{
    if (this.sub_accountLocalPurch) {
      this.sub_account2 = this.sub_accountLocalPurch 
    }
  } 
}

MixSubaccountPurchOffline(){
  this.sub_account2=[] 
    if (this.sub_accountLocalPurch) {
      for (let i = 0; i < this.sub_accountLocalPurch.length; i++) {
        const element = this.sub_accountLocalPurch[i];
        this.sub_account2.push(element)
      }
    }
    if (this.sub_accountPurch) {
      for (let i = 0; i < this.sub_accountPurch.length; i++) {
        const element = this.sub_accountPurch[i];
        this.sub_account1.push(element)
      }
    } 
  }
 
prepareOffline(){
  this.storage.get('salesLocal').then((response) => {
    //console.log('saleslocal heres',this.salesLocal) 
    if (response) {
      this.salesLocal = response
      //console.log('salesLocal',this.salesLocal) 
    }
  });

  this.storage.get('sales').then((response) => {
    //console.log('sales heres',this.sales) 
    if (response) {
      this.sales = response
      //console.log('sales',this.sales) 
    }
  });

  this.storage.get('itemsLocal').then((response) => {
    if (response) {
      this.itemsLocal = response 
       //console.log(this.itemsLocal)  
       this.items = this.itemsLocal  
    }
  });  
 
 this.storage.get('sub_accountLocalSales').then((response) => {
   if (response) {
     this.sub_accountLocalSales = response 
    
      //console.log(this.sub_accountLocalSales)  
   }
 });
 //Yaw
 this.storage.get('sub_accountSales').then((response) => {
  if (response) {
    this.sub_accountSales = response  
     //console.log(this.sub_accountLocalSales)  
  }
});
 
}

radioChange(ev){
  //console.log(ev.target.value) 
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

pickDetail(ev){ 
  let fl : Array<any>=[]
  if(this.searchLang == 1){
     fl= this.items.filter(x=>x.item_desc == ev.target.value)
    //console.log('hyrr',fl);
  }else {
     fl= this.items.filter(x=>x.item_name == ev.target.value)
    //console.log(fl);
  }
   

  //console.log(fl);
  this.selectedItem = {
    id:fl[0]['id'],
    dateCreated:fl[0]['dateCreated'],
    pay_ref:"",
    item_desc:fl[0]['item_desc'],
    item_name:fl[0]['item_name'],
    item_unit:fl[0]['item_unit'],
    parcode:fl[0]['parcode'],
    pay_price:fl[0]['pay_price'],
    perch_price:fl[0]['perch_price'],
    qty:0,
    tot:fl[0]['pay_price'],
    availQty: +fl[0]['availQty'] ,
    firstQuantity:fl[0]['firstQuantity'] 
  }
  //console.log('sseelleecctteedd' ,this.selectedItem);
  this.currenQty = this.selectedItem.availQty
  this.firstQty = +this.selectedItem.firstQuantity
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

  getPayInvoDetail(pay,sub_name,status){
    console .log(pay,sub_name,status)
    let itemList :Array<any>=[] 
    this.presentLoadingWithOptions('جاري جلب التفاصيل ...') 
    let  payInvo ={
      pay_id:pay.pay_id ,
      pay_ref:pay.pay_ref ,
      store_id:pay.store_id,
      tot_pr:pay.tot_pr,
      pay:pay.pay,
      pay_date:pay.pay_date,
      pay_time:pay.pay_time,
      user_id:pay.user_id,
      cust_id:pay.cust_id,
      pay_method:pay.pay_method,
      discount:pay.discount ,
      changee:pay.changee ,
      sub_name:pay.sub_name,
      yearId:pay.yearId ,
      payComment:pay.payComment ,
      nextPay:pay.payComment 
    };
    let  payInvo2 ={
      pay_id:pay.pay_id ,
      pay_ref:pay.pay_ref ,
      store_id:pay.store_id,
      tot_pr:pay.tot_pr, 
      pay_date:pay.pay_date,
      pay_time:pay.pay_time,
      user_id:pay.user_id,
      yearId:pay.yearId ,
      payComment:pay.payComment   
    };
    //console.log('before',this.perchDetailsArr)
    //console.log(this.payDetailsArr)
  // get item list from pay  item details  info 
     if(pay.type == "مبيعات"){ 
      this.api.getPayInvoDetail(this.store_info.id , pay.pay_ref,this.year.id).subscribe(data =>{
        //console.log(data,'case 1')
         let res = data 
         //console.log(pay) 
         this.loadingController.dismiss() 
         let navigationExtras: NavigationExtras = {
          queryParams: {
            payInvo: JSON.stringify(payInvo),
            sub_name: JSON.stringify(sub_name),
            user_info:JSON.stringify(this.user_info),
            store_info:JSON.stringify(this.store_info), 
            itemList:JSON.stringify(res['data']) ,
            screen : "itemReport"
          }
        };
        this.rout.navigate(['folder/edit-sales'], navigationExtras); 
       }, (err) => {
       //console.log(err);
       this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
     })   
     }else if(pay.type == "مشتريات"){
      this.api.getPerchInvoDetail(this.store_info.id , pay.pay_ref,this.year.id).subscribe(data =>{
        //console.log(data,'case 1')
         let res = data 
         //console.log(pay) 
         this.loadingController.dismiss() 
         let navigationExtras: NavigationExtras = {
          queryParams: {
            payInvo: JSON.stringify(payInvo),
            sub_name: JSON.stringify(sub_name),
            user_info:JSON.stringify(this.user_info),
            store_info:JSON.stringify(this.store_info), 
            itemList:JSON.stringify(res['data']) ,
            screen : "itemReport"
          }
        };
        this.rout.navigate(['folder/edit-perch'], navigationExtras); 
       }, (err) => {
       //console.log(err);
       this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
     })  
     }else if(pay.type == "تسوية جردية"){
      this.api.getTswiaInvoDetail(this.store_info.id , pay.pay_ref,this.year.id).subscribe(data =>{
        //console.log(data,'case 1')
         let res = data 
         //console.log(pay) 
         this.loadingController.dismiss() 
         let navigationExtras: NavigationExtras = {
          queryParams: {
            payInvo: JSON.stringify(payInvo2), 
            user_info:JSON.stringify(this.user_info),
            store_info:JSON.stringify(this.store_info), 
            itemList:JSON.stringify(res['data']) ,
            screen : "itemReport"
          }
        };
        this.rout.navigate(['folder/edit-tswia'], navigationExtras); 
       }, (err) => {
       //console.log(err);
       this.presentToast('خطا في الإتصال حاول مرة اخري' , 'danger')
     })  
     }
     
  }


getItemPaysByItemIdBydate(){ 
 // this.getSalesfromLocal()
  this.loading = true
  this.api.getItemPaysByItemIdBydate(this.store_info.id ,this.selectedItem.id,this.startingDate,this.year.id).subscribe(data =>{
     let res = data
     if(res['message'] != 'No record Found'){
       this.payDetailsArr = res['data'] 
       this.payDetailsArr =  this.payDetailsArr.filter(x=>x.pay_date >= "2023-01-01")

       for (let i = 0; i < this.payDetailsArr.length; i++) {
        const element = this.payDetailsArr[i];
        element.type = 'مبيعات'  
      }
     }
      this.getItemPurchsByItemIdBydate() 
     // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
   }, (err) => {
   //console.log(err);
   this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')

 },
 ()=>{
  this.loading = false
 })  
 }

 getItemPaysBydate(){ 
  // this.getSalesfromLocal()
   this.loading = true
   this.api.getItemPaysBydate(this.store_info.id ,this.startingDate,this.year.id).subscribe(data =>{
      let res = data
      if(res['message'] != 'No record Found'){
        this.payDetailsArr = res['data'] 
        this.payDetailsArr =  this.payDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
 
        for (let i = 0; i < this.payDetailsArr.length; i++) {
         const element = this.payDetailsArr[i];
         element.type = 'مبيعات'  
       }
      }
       this.getItemPurchsBydate() 
      // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
    }, (err) => {
    //console.log(err);
    this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
 
  },
  ()=>{
   this.loading = false
  })  
  }

 getItemPaysByItemId(){  
   this.loading = true
   this.api.getItemPaysByItemId(this.store_info.id ,this.selectedItem.id,this.year.id).subscribe(data =>{
      //console.log('hhhhhsssshh',data)
      let res = data
      if(res['message'] != 'No record Found'){
        this.payDetailsArr = res['data'] 
        this.payDetailsArr =  this.payDetailsArr.filter(x=>x.pay_date >= "2023-01-01")

        for (let i = 0; i < this.payDetailsArr.length; i++) {
          const element = this.payDetailsArr[i];
          element.type = 'مبيعات' 
        }
      }
     this.getItemPurchByItemId() 
      // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
    }, (err) => {
    //console.log(err);
    this.presentToast('1خطا في الإتصال حاول مرة اخري' , 'danger')
    this.loading = false
  },
  ()=>{})  
  }

getItemPaysByItemIdBy2date(){ 
  // this.getSalesfromLocal()
   this.loading = true
   this.api.getItemPaysByItemIdBy2date(this.store_info.id ,this.selectedItem.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
      //console.log('hhhhhsssshh',data) 
      let res = data
      if(res['message'] != 'No record Found'){
        this.payDetailsArr = res['data'] 
        this.payDetailsArr =  this.payDetailsArr.filter(x=>x.pay_date >= "2023-01-01")

        for (let i = 0; i < this.payDetailsArr.length; i++) {
          const element = this.payDetailsArr[i];
          element.type = 'مبيعات' 
        }
      } 
      this.getItemPurchByItemIdBy2date()  
      // this.store_tot = this.items.reduce( (acc, obj)=> { return acc + +(obj.perch_price * obj.quantity ); }, 0);
    }, (err) => {
    //console.log(err);
    this.loading = false
    this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')

  },
  ()=>{
   this.loading = false
  })  
  }

  getItemPurchsBydate(){ 
    // this.getSalesfromLocal()
    this.perchDetailsArr = []
     this.loading = true
     this.api.getItemPurchsBydate(this.store_info.id ,this.startingDate,this.year.id).subscribe(data =>{
        //console.log('purch',data)
        let res = data
        if(res['message'] != 'No record Found'){
          this.perchDetailsArr = res['data'] 
          this.perchDetailsArr =  this.perchDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
          for (let i = 0; i < this.perchDetailsArr.length; i++) {
            const element = this.perchDetailsArr[i];
            element.type = 'مشتريات' 
          }
        }  

       this.getItemTswiasBydate()
        
      }, (err) => {
      //console.log(err);
      this.loading = false
      this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
  
    },
    ()=>{
     this.loading = false
    })  
    }
//
    getItemPurchsByItemIdBydate(){ 
      // this.getSalesfromLocal()
      this.perchDetailsArr = []
      this.loading = true
      this.api.getItemPurchsByItemIdBydate(this.store_info.id ,this.selectedItem.id,this.startingDate,this.year.id).subscribe(data =>{
          //console.log('purch',data)
          let res = data
          if(res['message'] != 'No record Found'){
            this.perchDetailsArr = res['data'] 
            this.perchDetailsArr =  this.perchDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
            for (let i = 0; i < this.perchDetailsArr.length; i++) {
              const element = this.perchDetailsArr[i];
              element.type = 'مشتريات' 
            }
          }  
          this.getItemTswiasByItemIdBydate()
          
        }, (err) => {
        //console.log(err);
        this.loading = false
        this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')

      },













      ()=>{
      this.loading = false
      })  
      }

  getItemTswiasByItemIdBydate(){ 
    // this.getSalesfromLocal()
    this.perchDetailsArr = []
     this.loading = true
     this.api.getItemTswiasByItemIdBydate(this.store_info.id ,this.selectedItem.id,this.startingDate,this.year.id).subscribe(data =>{
        //console.log('purch',data)
        let res = data
        if(res['message'] != 'No record Found'){
          this.tswiaDetailsArr = res['data'] 
          this.tswiaDetailsArr =  this.tswiaDetailsArr.filter(x=>x.pay_date >= "2023-01-01")

          for (let i = 0; i < this.perchDetailsArr.length; i++) {
            const element = this.perchDetailsArr[i];
            element.type = 'تسوية جردية'
            
          }
        }  
         this.mixArrayAndOrderong()
         this.getTotal() 
         if(this.payArray.length==0){
          this.showEmpty = true
        }else{
          this.showEmpty = false
        }
          this.loading=false
          //console.log(this.payArray) 
      }, (err) => {
      //console.log(err);
      this.loading = false
      this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
  
    },
    ()=>{
     this.loading = false
    })  
    }

    getItemTswiasBydate(){ 
      // this.getSalesfromLocal()
      this.perchDetailsArr = []
       this.loading = true
       this.api.getItemTswiasBydate(this.store_info.id , this.startingDate,this.year.id).subscribe(data =>{
          //console.log('purch',data)
          let res = data
          if(res['message'] != 'No record Found'){
            this.tswiaDetailsArr = res['data'] 
            this.tswiaDetailsArr =  this.tswiaDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
  
            for (let i = 0; i < this.perchDetailsArr.length; i++) {
              const element = this.perchDetailsArr[i];
              element.type = 'تسوية جردية' 
            }
          }  
           this.mixArrayAndOrderongCaseDaily()
          
           if(this.payArrayDaily.length==0){
            this.showEmpty = true
          }else{
            this.showEmpty = false
          }
            this.loading=false
            //console.log(this.payArrayDaily) 
        }, (err) => {
        //console.log(err);
        this.loading = false
        this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
    
      },
      ()=>{
       this.loading = false
      })  
      }

  getItemPurchByItemId(){ 
    this.perchDetailsArr = []
    this.loading = true
    this.api.getItemPurchByItemId(this.store_info.id ,this.selectedItem.id,this.year.id).subscribe(data =>{
       //console.log('purch',data)
       let res = data
       if(res['message'] != 'No record Found'){
         this.perchDetailsArr = res['data'] 
         this.perchDetailsArr =  this.perchDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
         for (let i = 0; i < this.perchDetailsArr.length; i++) {
          const element = this.perchDetailsArr[i];
          element.type = 'مشتريات'
        }
       }

       this.getItemTswiaByItemId()
      
     
     }, (err) => {
     //console.log(err);
     this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
   },
   ()=>{
    this.loading = false
   })  
   }

   getItemTswiaByItemId(){ 
    this.tswiaDetailsArr = []
    this.loading = true
    this.api.getItemTswiaByItemId(this.store_info.id ,this.selectedItem.id,this.year.id).subscribe(data =>{
       //console.log('purch',data)
       let res = data
       if(res['message'] != 'No record Found'){
         this.tswiaDetailsArr = res['data'] 
         this.tswiaDetailsArr =  this.tswiaDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
         //console.log(this.tswiaDetailsArr) 
         for (let i = 0; i < this.tswiaDetailsArr.length; i++) {
          const element = this.tswiaDetailsArr[i];
          element.type = 'تسوية جردية'
        }
       }

       this.mixArrayAndOrderong()
       this.getTotal() 
       if(this.payArray.length==0){
        this.showEmpty = true
      }else{
        this.showEmpty = false
      }
        this.loading = false
        //console.log(this.payArray) 
      
     
     }, (err) => {
     //console.log(err);
     this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
   },
   ()=>{
    this.loading = false
   })  
   }

   toPositive(negative){
   return Math.abs(+negative) 
   }
 
 getItemPurchByItemIdBy2date(){ 
   // this.getSalesfromLocal()
    this.loading = true
    this.api.getItemPurchByItemIdBy2date(this.store_info.id ,this.selectedItem.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
       //console.log('purch',data) 
       let res = data
       if(res['message'] != 'No record Found'){
         this.perchDetailsArr = res['data'] 
         this.perchDetailsArr =  this.perchDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
       } 
       this.getItemTswiaByItemIdBy2date()
       
     }, (err) => {
     //console.log(err);
     this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
     this.loading=false
   },
   ()=>{
    this.loading = false
   })  
   }


   getItemTswiaByItemIdBy2date(){ 
    // this.getSalesfromLocal()
     this.loading = true
     this.api.getItemTswiaByItemIdBy2date(this.store_info.id ,this.selectedItem.id,this.startingDate,this.endDate,this.year.id).subscribe(data =>{
        //console.log('purch',data) 
        let res = data
        if(res['message'] != 'No record Found'){
          this.tswiaDetailsArr = res['data'] 
          this.tswiaDetailsArr =  this.tswiaDetailsArr.filter(x=>x.pay_date >= "2023-01-01")
        } 
        this.mixArrayAndOrderong()
        this.getTotal() 
        if(this.payArray.length==0){
         this.showEmpty = true
       }else{
         this.showEmpty = false
       }
         this.loading=false
         //console.log(this.payArray) 
      }, (err) => {
      //console.log(err);
      this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
      this.loading=false
    },
    ()=>{
     this.loading = false
    })  
    }


  mixArrayAndOrderong(){
    this.payArray = []
    if(this.perchDetailsArr.length>0){
      for (let i = 0; i < this.perchDetailsArr.length; i++) {
        const element = this.perchDetailsArr[i];
        if(+element.discount>0){
          let getPercg = +element.discount / +element.tot_pr
          element.perch_price = (element.perch_price - (element.perch_price * getPercg)).toFixed(2)  
        }
        this.payArray.push(element) 
      }
    }
    if(this.payDetailsArr.length>0){
      for (let i = 0; i < this.payDetailsArr.length; i++) {
        const element = this.payDetailsArr[i];
        if(+element.discount>0){
          let getPercg = +element.discount / +element.tot_pr
          element.pay_price = (element.pay_price - (element.pay_price * getPercg)).toFixed(2) 
        }
        this.payArray.push(element)
        
      }
    }
    //console.log('ljw;f', this.tswiaDetailsArr)
    if(this.tswiaDetailsArr.length>0){
      for (let i = 0; i < this.tswiaDetailsArr.length; i++) {
        const element = this.tswiaDetailsArr[i]; 
        let qty = +element.availQty  - +element.qtyReal
        //console.log(+qty)
        this.payArray.push({
          "id" : element.id,
          "pay_ref" :element.pay_ref,
          "item_name" :element.item_name, 
          "pay_date" :element.pay_date,
          "pay_price" :element.pay_price,
          "quantity" : qty,
          "tot" : +element.tot, 
          "store_id" :+this.store_info.id,
          "yearId" :+this.year.id, 
          "item_id" : +element.id,
          "dateCreated" : element.dateCreated,
          "perch_price":element.perch_price,
          "type":element.type 
        }   
        ) 
      }
    }

// sorting array
 this.payArray = this.payArray.sort((a, b) => (a.pay_date > b.pay_date) ? -1 : 1);
 
  }


  mixArrayAndOrderongCaseDaily(){
    this.payArrayDaily = []
    if(this.perchDetailsArr.length>0){
      for (let i = 0; i < this.perchDetailsArr.length; i++) {
        const element = this.perchDetailsArr[i];
        // if(+element.discount>0){
        //   let getPercg = +element.discount / +element.tot_pr
        //   element.perch_price = (element.perch_price - (element.perch_price * getPercg)).toFixed(2)  
        // }

        // add available qty
        let inx = this.items.findIndex(x=>x.item_id == element.item_id )
        element.currenQty =  this.items[inx].quantity

        let index = this.payArrayDaily.findIndex(x=>x.item_id == element.item_id && element.type == 'مشتريات')
        if(index != -1 ){
          element.quantity = +element.quantity + +this.payArrayDaily[index].quantity
        }else{
          this.payArrayDaily.push(element)
        } 
        
      }
    }
    if(this.payDetailsArr.length>0){
      for (let i = 0; i < this.payDetailsArr.length; i++) {
        const element = this.payDetailsArr[i];
        // if(+element.discount>0){
        //   let getPercg = +element.discount / +element.tot_pr
        //   element.pay_price = (element.pay_price - (element.pay_price * getPercg)).toFixed(2) 
        // }
        //check if it exist in array

        // add available qty
       
        let inx = this.items.findIndex(x=>x.id == element.item_id )
        //console.log('inx' + inx  , this.items[0] )
        element.currenQty =  this.items[inx].quantity


        let index = this.payArrayDaily.findIndex(x=>x.item_id == element.item_id && element.type == 'مبيعات')
        if(index != -1 ){
          element.quantity = +element.quantity + +this.payArrayDaily[index].quantity
        }else{
          this.payArrayDaily.push(element)
        } 
         
      }
    }
    
    //console.log('ljw;f', this.tswiaDetailsArr)
    if(this.tswiaDetailsArr.length>0){
      for (let i = 0; i < this.tswiaDetailsArr.length; i++) {
        const element = this.tswiaDetailsArr[i]; 
        let qty = +element.availQty  - +element.qtyReal
        //console.log(+qty)

        // add available qty
        let inx = this.items.findIndex(x=>x.item_id == element.item_id )
        element.currenQty =  this.items[inx].quantity


        let index = this.payArrayDaily.findIndex(x=>x.item_id == element.item_id && element.type == 'تسوية جردية')
        if(index != -1 ){
          element.quantity = +element.quantity + +this.payArrayDaily[index].quantity
        }else{
            this.payArrayDaily.push({
          "id" : element.id,
          "pay_ref" :element.pay_ref,
          "item_name" :element.item_name, 
          "pay_date" :element.pay_date,
          "pay_price" :element.pay_price,
          "quantity" : qty,
          "tot" : +element.tot, 
          "store_id" :+this.store_info.id,
          "yearId" :+this.year.id, 
          "item_id" : +element.id,
          "dateCreated" : element.dateCreated,
          "perch_price":element.perch_price,
          "type":element.type 
        }   
        ) 
        }  
      }
    }

// sorting array
 //this.payArrayDaily = this.payArray.sort((a, b) => (a.pay_date > b.pay_date) ? -1 : 1);
 
  }

 getTotal(){
   this.currenQty = this.selectedItem.availQty
   this.firstQty = this.selectedItem.firstQuantity

   this.perchTotQty = this.perchDetailsArr.reduce( (acc, obj)=> { return acc + +obj.quantity; }, 0);
   this.payTotQty =  this.payDetailsArr.reduce( (acc, obj)=> { return acc + +obj.quantity; }, 0);
  
    this.perchTot = (this.perchDetailsArr.reduce( (acc, obj)=> { return acc + +obj.tot; }, 0)).toFixed(2);
    this.payTot = (this.payDetailsArr.reduce( (acc, obj)=> { return acc + +obj.tot; }, 0)).toFixed(2);  
 
    //console.log('perchTotQty',this.perchTotQty ,this.payTotQty )
   //تجميع الكيات السالبة وتحويلها لموجب لإضافتها للمشتريات
   if(this.tswiaDetailsArr.length>0){ 
    for (let i = 0; i < this.tswiaDetailsArr.length; i++) {
      const element = this.tswiaDetailsArr[i];
      if( (+element.availQty  - +element.qtyReal) < 0 ){
       
        this.perchTotQty = +this.perchTotQty +  Math.abs((+element.availQty  - +element.qtyReal)) 
        this.perchTot = (+this.perchTot  +  Math.abs(+element.tot)).toFixed(2)
        //console.log('jdja',this.perchTotQty ,this.perchTot )
      }else if((+element.availQty  - +element.qtyReal) > 0 ){
        this.payTotQty = +this.payTotQty + (+element.availQty  - +element.qtyReal) 
        this.payTot = (+this.payTot  +  +element.tot).toFixed(2)
      }
    }
  }
 
 
  //console.log(this.perchTot , this.payTot)
 } 


search(){
  this.currenQty = 0
  this.firstQty = 0
  this.perchTotQty =0
  this.payTotQty =  0
 
 this.perchTot = 0
 this.payTot =0  
 this.payArray = []
 this.perchDetailsArr =[]
 this.payDetailsArr = []
  this.showEmpty=false
  
  if (this.radioVal == 0) { 
    this.getItemPaysByItemId() 
    // this.getItemPurchByItemId() 
    } else if(this.radioVal == 1){
    //  this.getItemPurchsByItemIdBydate() 
      this.getItemPaysByItemIdBydate() 
    }else if(this.radioVal == 2){
      this.getItemPaysByItemIdBy2date() 
      }else if(this.radioVal == 3){
        this.getItemPaysBydate() 
        }
 }


}
