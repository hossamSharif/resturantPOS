import { DatePipe, Location } from '@angular/common';
import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ServicesService } from '../stockService/services.service';
import { Storage } from '@ionic/storage';
import { FilterPipe } from '../sales/pipe';
import { FilterPipe2 } from '../sales/pipe2';
import { FilterPipe3 } from '../sales/pipe3';
import { Subscription } from 'rxjs';
import { StockServiceService } from '../syncService/stock-service.service';
import * as momentObj from 'moment';
@Component({
  selector: 'app-edit-tswia',
  templateUrl: './edit-tswia.page.html',
  styleUrls: ['./edit-tswia.page.scss'],
})
export class EditTswiaPage implements OnInit {
  @ViewChild("dstEds") dstEds: ElementRef;
  @ViewChild('qtyId13') qtyId13; 
  @ViewChild('dstPop14') dstPop14; 
  @ViewChild('popInput5') popInput5; 
  @ViewChild('popover6') popover6;
  @ViewChild('popoverNotif21') popoverNotif21;
  notifArr:Array<any> =[]
  showNotif = false
  LogHistoryLocalArr:Array<any> =[]
  logHistoryArr:Array<any>=[];
  isOpenNotif = false ;
  subiscribtionNotif:Subscription;
  newNotif = false ; 
  isOpen = false; 
  selectedItemSales29 : any
  
  payArray:any ;  
  sub_account:Array<any> =[]
  sub_accountLocalSales:Array<any> =[]
  items:Array<any> =[]
  itemsLocal:Array<any> =[]
  itemList:Array<any> =[]
  salesLocal:Array<any> =[]
  salesLocalUpdate :Array<any> =[]
  salesLocalDelete:Array<any> =[]
  sub_accountSales : Array<any> =[]
  sales  :Array<any> =[]
  randomsNumber:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  store_id : any=1
  sub_nameNew :any = ""
  selectedItem : {id:any ,pay_ref:any,item_name:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,parcode:any,tot:any ,dateCreated:any,availQty:any,aliasEn:any,qtyReal:any};
  discountPerc :any = 0
  selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,cat_id:any,cat_name:any};
  payInvo : {pay_id:any ,pay_ref:any ,store_id:any,tot_pr:any,pay_date:any,pay_time:any,user_id:any, yearId:any,payComment:any};

  radioVal : any = 0
  loading :boolean = false
  offline:boolean
  showMe = null
  searchLang :any = 0
  searchTerm : any = ""
  aliasTerm :any =""
  searchResult :Array<any> =[]
  aliasResult :Array<any> =[]
  finalResult :Array<any> =[]
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any} 
  constructor(private behavApi:StockServiceService ,private _location: Location ,private alertController: AlertController,private route: ActivatedRoute, private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) {
    this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_name:"",cat_id:""};
   
    this.route.queryParams.subscribe(params => {
      if (params && params.payInvo) {
        this.payInvo = JSON.parse(params.payInvo); 
        this.user_info = JSON.parse(params.user_info);
        this.store_info = JSON.parse(params.store_info);
        this.itemList = JSON.parse(params.itemList); 
        this.prepareOffline()
        this.getAppInfo()
      }
    });
   
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
      tot:0,
      availQty:0,
      aliasEn:"",
      qtyReal:0
    } 
   }

   getOffliemode(){
    this.storage.get('offline').then((response) => {
     
        this.offline = response
        //console.log('mooooode',this.offline)
     
    });
  }



  ionViewDidLeave(){
    //console.log('ionViewWillLeave')
   
    this.subiscribtionNotif.unsubscribe()
   } 

  ionViewDidEnter(){
    setTimeout(() => {
      //check all changes in case notif arr >0 
       this.subiscribtionNotif = this.behavApi.currentNotif.subscribe(notif=>{
        //console.log('notif page currentNotif behavApiRespnse',notif) 
         if(notif.length == 0){
          this.notifArr = []
         }else{
          this.notifArr =  notif[0]  
         }

        if(this.notifArr.length> 0){ 
          this.showNotif = true
          this.itemsLocal = notif[1] 
          this.items =  this.itemsLocal
          this.searchResult = this.items
          this.sub_accountSales = notif[2] 
          //console.log(this.sub_accountLocalSales)  
          this.storage.get('LogHistoryLocal').then((response) => { 
            if (response) {
              this.LogHistoryLocalArr = response  
            } 
          });
     
        } else {
          //console.log('no updates')
          this.showNotif = false
        
          
        } 
        })
      }, 10000); 
  } 


  ngOnInit() {
   // this.getStockItems() 
   this.getItemLocalOff() 
  }

  prepareOffline(){ 
    this.storage.get('offline').then((response) => {
        this.offline = response
        //console.log('mooooode',this.offline)
    });
    
    
   this.storage.get('itemsLocal').then((response) => {
    if (response) {
      this.itemsLocal = response 
       //console.log(this.itemsLocal)  
       this.items = this.itemsLocal  
    }
  }); 

  this.getItemLocalOff()
   //this.getStockItems()
  }

      getAppInfo(){ 
    this.storage.get('offline').then((response) => { 
        this.offline = response
        //console.log('mooooode',this.offline) 
    });
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
        this.getItemLocalOff() 
     }
   });
   this.storage.get('LogHistoryLocal').then((response) => {
    //console.log('LogHistoryLocal',this.LogHistoryLocalArr)  
    if (response) {
      this.LogHistoryLocalArr = response
    }   
  });
  
  this.storage.get('searchLang').then((response) => {
    if (response) {
      this.searchLang = response
      //console.log('searchLang' ,this.searchLang) 
    }
  }); 
      }

      getItemLocalOff(){
        this.storage.get('itemsLocal').then((response) => {
          if (response) {
            this.itemsLocal = response 
             //console.log(this.itemsLocal)  
             this.items = this.itemsLocal
             this.items.forEach(element => {
              if(+element.tswiaQuantity > 0){
                element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 
      
              }else if(+element.tswiaQuantity < 0){
                element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
              }
      
              element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
            });
            this.searchResult = this.items  
          }
        }); 
       }


 getSalesAccountFirs(){
  if (this.offline == false) {
  this.api.getSalesAccounts(this.store_info.id ,this.year.id).subscribe(data =>{
     let res = data
     this.sub_account = res ['data']
     //console.log(this.sub_account)
     this.addSubaccountLocal()
     this.pickAccount(this.selectedAccount.sub_name ,'fl')  
   }, (err) => {
   //console.log(err);
 })}else{
  this.MixSubaccountSalesOffline()
  this.pickAccount(this.selectedAccount.sub_name ,'fl')
 }  
 } 

 
 getSalesAccount(){ 
  if (this.offline == false) {
   this.api.getSalesAccounts(this.store_info.id, this.year.id).subscribe(data =>{
    let res = data
    this.sub_account = res ['data']
    //console.log(this.sub_account)
    this.addSubaccountLocal()
  }, (err) => {
  //console.log(err);
 }) 
 } else {
   this.MixSubaccountSalesOffline()
 } 
  } 
  
 
  addSubaccountLocal(){
   if (this.sub_account) {
     //console.log('case1',this.sub_account,this.sub_accountLocalSales) 
     if (this.sub_accountLocalSales) {
       for (let i = 0; i < this.sub_accountLocalSales.length; i++) {
         const element = this.sub_accountLocalSales[i];
         this.sub_account.push(element)
       }
     }
   }else{
     //console.log('case2',this.sub_account)
     if (this.sub_accountLocalSales) {
       this.sub_account = this.sub_accountLocalSales 
     }
   }  
   }
 
   MixSubaccountSalesOffline(){
     this.sub_account=[] 
       if (this.sub_accountLocalSales) {
         for (let i = 0; i < this.sub_accountLocalSales.length; i++) {
           const element = this.sub_accountLocalSales[i];
           this.sub_account.push(element)
         }
       }
 
       if (this.sub_accountSales) {
         for (let i = 0; i < this.sub_accountSales.length; i++) {
           const element = this.sub_accountSales[i];
           this.sub_account.push(element)
         }
       } 
     }

  prepareInvo(){ 
      this.sub_nameNew = ""
      this.radioVal = 0
      this.payInvo ={
        pay_id:this.payArray[0].pay_id ,
        pay_ref:this.payArray[0].pay_ref ,
        store_id:this.payArray[0].store_id,
        tot_pr:this.payArray[0].tot_pr, 
        pay_date:this.payArray[0].pay_date,
        pay_time:this.payArray[0].pay_time,
        user_id:this.user_info.id,  
        payComment:this.payArray[0].payComment, 
        yearId:this.payArray[0].yearId
      }; 
     this.setFocusOnInput('dstEp')
     }

    setFocusOnInput(Input) {
      //console.log('setFocusOnInput')
      if (Input == 'dst') { 
       this.dstEds.nativeElement.focus(); 
      } else if(Input == 'dstPop14') {
       this.dstPop14.setFocus();
       this.isOpen = true;
       this.clear()
       this.searchResult = this.items
       setTimeout(() => {
           this.popInput5.setFocus(); 
       }, 1500);
     
      }else if(Input == 'qtyId13') {
       this.qtyId13.setFocus();  
      }else if(Input == 'popInput5'){
       this.popInput5.setFocus();  
      }
    }


getItems(){
  if (this.offline == false) {
   this.api.getItems().subscribe(data =>{
    //console.log('dataaaaaaa',data)
    let res = data
    this.items = res['data'] 
  }, (err) => {
  //console.log(err);
})
  }else{
    this.items = this.itemsLocal ;  
  //console.log('itemsLocal',this.itemsLocal)
  }  
}

getStockItems() {
  if (this.offline == false) {
    this.api.stockItems(1 , this.year.id).subscribe(data => {
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
      });
      this.storage.set('itemsLocal' , this.items).then((response) => {
             
      });
      this.searchResult = this.items 
    }, (err) => {
      //console.log(err);
    },
      () => {
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
    });
    this.searchResult = this.items
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
      duration: 5000,
      message: msg,
      translucent: true,
     // cssClass: 'custom-class custom-loading',
      backdropDismiss: false
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
    //console.log('Loading dismissed with role:', role);
  }

  // radioChange(ev){
  //   //console.log(ev.target.value) 
  //  }

  refresh(para){
    if (para=='account') {
      this.getSalesAccount()
    } else {
      this.getStockItems()
    } 
  }

  pickAccount(ev  , firstLoad?){
    let evVal 
    if(firstLoad){
     evVal = ev
    }else{
    evVal = ev.target.value
    }
    //console.log('evVal',evVal);
  
    let fl= this.sub_account.filter(x=>x.sub_name == evVal)
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
    //console.log('jjjj', this.selectedAccount);
   // this.payInvo.cust_id = this.selectedAccount.id
  
}else{
  this.presentToast('خطأ في اسم الحساب ', 'danger') 
  this.selectedItem.item_name =""
}
}


qtyClick(i){
  //console.log(i)
  this.showMe = i
}

hideMe(i){
  this.showMe = null 
}

editCell(i){
  if(+this.itemList[i].qtyReal > 0 && +this.itemList[i].perch_price > 0){
    this.itemList[i].tot = (this.itemList[i].availQty - this.itemList[i].qtyReal)  * +this.itemList[i].perch_price
    this.hideMe(i)
    this.getTotal() 
  }else{
    this.presentToast("خطأ في الإدخال ", "danger")
  }
 
}



selectFromPop(item){
  //console.log(item)
  this.selectedItem = {
    id:item.id,
    dateCreated:item.dateCreated,
    pay_ref:this.payInvo.pay_ref,
    item_desc:item.item_desc,
    item_name:item.item_name,
    item_unit:item.item_unit,
    parcode:item.parcode,
    pay_price:item.pay_price,
    perch_price:item.perch_price,
    qtyReal:"",
    tot:item.pay_price,
    availQty:item.quantity,
    aliasEn:item.aliasEn
    
  } 

  this.selectedItemSales29 = item.sales29 
   this.searchTerm = item.item_name
    //console.log( this.selectedItem); 
    this.didDissmis()
    
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
    if (fl.length > 0) {
    this.selectedItem = {
      id:fl[0]['id'],
      dateCreated:fl[0]['dateCreated'],
      pay_ref:this.payInvo.pay_ref,
      item_desc:fl[0]['item_desc'],
      item_name:fl[0]['item_name'],
      item_unit:fl[0]['item_unit'],
      parcode:fl[0]['parcode'],
      pay_price:fl[0]['pay_price'],
      perch_price:fl[0]['perch_price'], 
      tot:fl[0]['pay_price'],
      availQty:fl[0]['quantity'],
      aliasEn:fl[0]['aliasEn'],
      qtyReal:fl[0]['qtyReal'],

    }
    //console.log( this.selectedItem);
     this.setFocusOnInput('qtyEds')
  }else{
    this.presentToast('خطأ في اسم الصنف ', 'danger') 
    this.selectedItem.item_name =""
  }
  }
  

  presentPopover(e?: Event) {
    //console.log('preent me', e)
     this.popover6.event = e;
     this.isOpen = true;
     this.clear()
     this.searchResult = this.items
     setTimeout(() => {
     this.setFocusOnInput('popInput5')
     }, 2000);
   }

   didDissmis(){
     this.isOpen = false
     //console.log('dismissOver')
     this.setFocusOnInput('qtyEds')
     
   }
   presentPopoverNotif(e?: Event) {
    //console.log('preent me', e)
     this.notifArr = []
     this.showNotif = false
     this.popoverNotif21.event = e;
     this.isOpenNotif = true;  
   }
  
   
  didDissmisNotif(){
    this.isOpenNotif = false
    //console.log('dismissOver') 
  }
  
   
   searchItem(ev){
     this.searchResult = []
     this.aliasTerm = ev.target.value
    
     const filterPipe = new FilterPipe; 
     const filterPipe2 = new FilterPipe2;
     const filterPipe3 = new FilterPipe3 ;

     let  fiteredArr :any
     if(this.searchLang == 0){
            fiteredArr = filterPipe.transform(this.items,ev.target.value); 
     }else{
            fiteredArr = filterPipe3.transform(this.items,ev.target.value);  
     }
    
     const fiteredArr2 = filterPipe2.transform(this.items,this.aliasTerm);  
     //console.log('filte',fiteredArr)
     //console.log('fiteredArr2',fiteredArr2)

     if(fiteredArr.length>0){
       fiteredArr.forEach(element => {
         this.searchResult.push( element)
       });
     }

     if(fiteredArr2.length>0){
        fiteredArr2.forEach(element => {
       this.searchResult.push( element)
     });
     } 
     
     //console.log('search',this.searchResult)
   }

   clear(item_name?){
    if(item_name){
     this.selectedItem = {
       id: undefined,
       dateCreated: "", 
       pay_ref:this.payInvo.pay_ref,
       item_desc: "",
       item_name: "",
       item_unit: "",
       parcode: 0,
       pay_price: 0,
       perch_price: 0,
       qtyReal: 0,
       tot: 0,
       availQty:0,
       aliasEn:""
     }
    }else{
     this.searchTerm = "" 
    }
   }

   qtyRealhange(ev){
    //console.log(ev);
    this.selectedItem.tot =  ((this.selectedItem.availQty - this.selectedItem.qtyReal)  * +this.selectedItem.perch_price) 
  
  }

  pricehange(ev){
    //console.log(ev);
    this.selectedItem.tot =  ((this.selectedItem.availQty - this.selectedItem.qtyReal) * +this.selectedItem.perch_price) 
  }

  payChange(ev){
    // //console.log(ev); 
    // this.payInvo.changee = +( this.payInvo.tot_pr - +this.payInvo.discount) - ev.target.value 
  }
  
   
  discountChange(ev){
    // //console.log('discountChange' ,ev); 
    // this.discountPerc = ((+this.payInvo.discount /+this.payInvo.tot_pr) * 100 ).toFixed(2)
    // this.payInvo.changee = +( this.payInvo.tot_pr - ev.target.value) - this.payInvo.pay
  }
  
  discountPerChange(ev){
    // //console.log('discountPerChange',ev);
    // this.payInvo.discount = (+this.payInvo.tot_pr * +this.discountPerc/100).toFixed(2)
    // this.payInvo.changee = +( this.payInvo.tot_pr -  this.payInvo.discount ) - this.payInvo.pay
  }

  back(){
    this._location.back()
  }

  deleteItem(index){
  //console.log( index); 
  this.itemList.splice(index,1)
  //console.log( this.itemList); 
 
  this.getTotal()
  }

  getTotal(){
    let sum = this.itemList.reduce( (acc, obj)=> { return acc + +obj.tot; }, 0);
    //console.log('sum', sum)
    this.payInvo.tot_pr = sum
  } 


  addTolist() {
    if (this.selectedItem.item_name == "" || this.selectedItem.id == "" ) {
      this.presentToast('الرجاء اختيار الصنف وتحديد الكمية', 'danger')
    } else if(this.selectedItem.qtyReal == this.selectedItem.availQty ){
      this.presentToast(' الكميات متساوية , لا يمكن إضافة العنصر  ', 'danger')
    }   else  {
      let fl: any = []
      if (this.itemList) {
        fl = this.itemList.filter(x => x.item_name == this.selectedItem.item_name &&  x.pay_price == this.selectedItem.pay_price)
      }

      if (fl.length == 0) {
        let d =   new Date
        let r= this.datePipe.transform(d, 'dd-MM-YYYY')
        this.itemList.push({
        "id" : 'NULL',
        "pay_ref" :this.selectedItem.pay_ref,
        "item_name" :this.selectedItem.item_name,
        "pay_price" :this.selectedItem.pay_price,
        "qtyReal" : +this.selectedItem.qtyReal,
        "tot" :this.selectedItem.tot, 
        "store_id" :+this.store_info.id,
        "yearId" :+this.year.id, 
        "item_id" : +this.selectedItem.id,
        "dateCreated" : r,
        "perch_price":this.selectedItem.perch_price,
        "availQty":this.selectedItem.availQty
        })
      } else {
        //console.log(this.itemList);
        //console.log(fl[0].quantity);
        this.presentToast('موجود مسبقا , سيتم جمع العنصرين')


        

        this.selectedItem.qtyReal = fl[0].qtyReal +this.selectedItem.qtyReal
        let index = this.itemList.map(e => e.item_name).indexOf(this.selectedItem.item_name);
       // this.itemList[index].qtyReal = +this.selectedItem.qtyReal
        this.itemList[index].tot =  ((this.selectedItem.qtyReal - this.selectedItem.availQty) * +this.selectedItem.perch_price)
        this.itemList[index].tot.toFixed(2)
      }



      this.selectedItem = {
        id: undefined,
        dateCreated: "", 
        pay_ref:this.payInvo.pay_ref,
        item_desc: "",
        item_name: "",
        item_unit: "",
        parcode: 0,
        pay_price: 0,
        perch_price: 0,
        qtyReal: 0,
        tot: 0,
        availQty:0,
        aliasEn:""

      }
      this.discountPerc = 0
      

      this.getTotal()
      this.setFocusOnInput('dstPop14')
      //this.setFocusOnInput('dstEds')
    }

  }

  validate():boolean{
    let fl :any =[]
    if (this.itemList.length == 0  || this.payInvo.pay_ref == "" ) {
      this.presentToast('الرجاء ادخال اصناف الي القائمة','danger')
      return false
    }   
    else if(this.payInvo.pay_date == "" || this.payInvo.pay_date == undefined) {
      this.presentToast('الرجاء تحديد التاريخ ','danger')
      return false
    }  
     else {
      return true
    }
  }

  preparenewaccount(){ 
  // if (this.selectedAccount.sub_name.length>0 && this.selectedAccount.id == null) {
    
  // } else {
  //   //console.log('slwcted from drop' ) 
  //   this.selectedAccount.sub_name = this.sub_nameNew
  //   this.payInvo.sub_name  =this.selectedAccount.sub_name
  // }
  // this.selectedAccount.id=null  
  // this.selectedAccount.ac_id = 2 
  // this.selectedAccount.sub_type="debit"
  // this.selectedAccount.sub_code=null
 
  // this.selectedAccount.cat_id = 1
  //   this.selectedAccount.cat_name = 'العملاء'
  //    this.selectedAccount.sub_balance="0"
  // this.selectedAccount.store_id=this.store_info.id   
  }

  update() {
    //console.log('papa',this.payInvo)
    let d : Date = this.payInvo.pay_date  
  
    this.payInvo.pay_date = this.datePipe.transform(d, 'yyyy-MM-dd')
    if (this.validate() == true) {
       this.presentLoadingWithOptions('جاري حفظ البيانات ...') 
          this.updateInvo()       
    } 
  }

   

  updateInvo(){
    this.api.updateTswiaInvo(this.payInvo).subscribe(data => {
    //console.log(data)
     this.deleteSalesitemList4update()
      }, (err) => {
      //console.log(err);
      this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger').then(()=>{
        this.loadingController.dismiss()
      })
     })
    }

 


saveSubAccount(){
  // //console.log('crea accoun')
  // this.preparenewaccount()
  // this.api.saveSubAccount(this.selectedAccount).subscribe(data => {
  // //console.log(data)
  // if (data['message'] != 'Post Not Created') {
  //   this.payInvo.cust_id =  data['message'] 
  //   if(this.radioVal == 0 && this.selectedAccount.id == null && this.offline == false) {
  //     this.sub_accountLocalSales = this.sub_accountLocalSales.filter(x=>x.sub_name != this.selectedAccount.sub_name)
  //     //console.log('imhereeeeeeeeeeeeeeeeee')
  //     this.storage.set('sub_accountLocalSales', this.sub_accountLocalSales).then((response) => {
  //    //console.log('resoponse set', this.sub_accountLocalSales) 
  //  });
  //  }
  //   this.updateInvo()
  // }else {
  //    this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
  // } 
  //   }, (err) => {
  // //console.log(err);
  //   this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger').then(()=>{
  //     this.loadingController.dismiss()
  //   })
  //  } )
  }

 deleteSalesitemList4update(){  
  this.api.deleteTswiaitemList(this.payInvo.pay_ref).subscribe(data => {
  //console.log(data)
  if (data['message'] != 'Post Not Deleted') {
    this.saveitemList()    
  }else{
   this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger').then(()=>{
    this.loadingController.dismiss()
  })

  } 
},(err) => {
  //console.log(err);
  this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger').then(()=>{
    this.loadingController.dismiss()
  })
  
 }) 
}


saveSubAccountlocal(){
  //console.log('crea accoun')
    this.preparenewaccount()
  // add new account to acount list tobe available in next load
  if (!this.sub_account) {
    this.sub_account = []
  }  
  this.sub_account.push(
    this.selectedAccount
  )  
  this.sub_accountLocalSales.push(
    this.selectedAccount
  )
  //console.log('sub_account' ,this.sub_account )
    this.storage.set('sub_accountLocalSales', this.sub_accountLocalSales).then((response) => {
      //console.log('resoponse set', this.sub_accountLocalSales)
    
      this.saveInvoLocal()
    });
 }

 isFocused(event){
  //console.log('dsdfsdf',event)
}

 saveInvoLocal() {
  //console.log('hahahahaha')
  //let index = this.purchLocal.findIndex(item => item.payInvo.pay_ref == this.payInvo.pay_ref);
  let flt:Array<any> = []
  flt= this.salesLocal.filter(item => item.payInvo.pay_ref == this.payInvo.pay_ref);
  //console.log ('flt',flt )
  //console.log ('this.payInvo', this.payInvo ,this.itemList)
 
  if (flt.length>0) {
    this.salesLocal= this.salesLocal.filter(item => item.payInvo.pay_ref != this.payInvo.pay_ref);
    //case1  فاتور محفوظة محلي فقط مفروض تتعدل وتتحفظ تاني محلي
    //this.salesLocal.splice(index,1) 
    //console.log ('salesLocal',this.salesLocal) 
    this.salesLocal.push({
      "payInvo": this.payInvo,
      "itemList": this.itemList 
    })
  } else {
    //case2 tفاتورة اونلاين تتعدل وتتمسح من الفواتير المعدلة محلي و تضاف مرة تانية محلي
    //console.log ('gggggg',this.salesLocalUpdate)
    let ind:Array<any> = this.salesLocalUpdate.filter(item => item.payInvo.pay_ref != this.payInvo.pay_ref);
    this.salesLocalUpdate = ind
    //console.log ('ind',ind , this.salesLocalUpdate)
    
    this.salesLocalUpdate.push({
      "payInvo": this.payInvo,
      "itemList": this.itemList 
    })   
  }
  
  if(this.payInvo.pay_id != undefined){
    this.sales = this.sales.filter(item => item.payInvo.pay_ref != this.payInvo.pay_ref);
    this.sales.push({
      "payInvo": this.payInvo,
      "itemList": this.itemList 
    }) 
    this.storage.set('sales', this.sales).then((response) => {
    //console.log('sales', response) 
    });
   }
 

  this.storage.set('salesLocalUpdate', this.salesLocalUpdate).then((response) => {
    //console.log('resoponse set', response) 
  });

  this.storage.set('salesLocal', this.salesLocal).then((response) => {
    //console.log('resoponse set', response)
    this.presentToast('تم الحفظ بنجاح', 'success')
    this.back()
  });
}



saveitemList(){  
this.api.saveTswiaitemList(this.itemList).subscribe(data=>{ 
  //console.log(data)  

  let arr:Array<any> = []
  arr.push({
    "payInvo": this.payInvo,
    "itemList": this.itemList 
  })
  this.logHistoryArr.push(
    {
      "id":null,
      "logRef":this.generateRandom2('update tswia'),
      "userId":this.user_info.id,
      "typee":'update tswia',
      "datee": momentObj(new Date()).locale('en').format('YYYY-MM-DD HH:mm:ss'),
      "logStatus":0,
      "logToken":JSON.stringify(arr[0]),
      "yearId":this.year.id,
      "store_id":this.store_info.id
    }
    )

  // 
  this.performSync()
  // this.presentToast('تم الحفظ بنجاح' , 'success') 
  // this.back()
}, (err) => {
  //console.log(err);
  this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
}, () => {
  this.loadingController.dismiss()
}
)      
}

generateRandom2(role):any{
  let da = new Date 
  //console.log(da)
  let randomsNumber = da.getMonth().toString() + da.getDay().toString() + da.getHours().toString()+ da.getMinutes().toString()+da.getSeconds().toString()+da.getMilliseconds().toString() + role
  return this.store_info.store_ref + randomsNumber 
}

saveLogHistory(role2?){  
  //let mdata =  this.prepareLogHistory(itemData , firstq , role) 
  //console.log('this.logHistoryArr[0]',this.logHistoryArr[0])
   let role
   let cust
   let invo 
   if (this.logHistoryArr.length > 1) {
    invo = this.logHistoryArr[1]
    cust = this.logHistoryArr[0]
    role = 'new account'
   } else {
    invo = this.logHistoryArr[0]
    role = undefined
   }
  this.api.saveLogHistoryMultiSales(invo ,cust,role).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Created') { 
  
    if(role2 == 'delete'){
    
      this.presentToast('تم الحذف بنجاح' , 'success') 
     
    }else{
    this.presentToast('تم الحفظ بنجاح' , 'success')

    }
    // this.getStockItems()
   }else{
     this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
   }
 }, (err) => {
   //console.log(err);
   this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
 }) 
}
async  performSync(){
  await this.saveLogHistory()
  await this.getStockItems()
  this.back()
   }


   async  performSyncDel(){
    await this.saveLogHistory('delete')
    await this.getStockItems()
    this.back()
    }
 
async presentAlertConfirm() {
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
          if (this.offline == false && this.payInvo.pay_id != undefined) {
            this.deleteSalesInvo()
          } else if(this.offline == false && this.payInvo.pay_id == undefined) {
            this.deleteSalesInvoLocal()
          }else if( this.offline == true){
            this.deleteSalesInvoLocal()
          }
         
        }
      }
    ]
  });

  await alert.present();
}


delete() {
  this.presentAlertConfirm()
}


deleteSalesInvo(){ 
  this.presentLoadingWithOptions('جاري حذف البيانات ...')
  let arr :Array<any> =[]
  arr.push({
    "payInvo": this.payInvo,
    "itemList": this.itemList 
  })
  this.logHistoryArr.push(
    {
      "id":null,
      "logRef":this.generateRandom2('delete tswia'),
      "userId":this.user_info.id,
      "typee":'delete tswia',
      "datee": momentObj(new Date()).locale('en').format('YYYY-MM-DD HH:mm:ss'),
      "logStatus":0,
      "logToken":JSON.stringify(arr[0]),
      "yearId":this.year.id,
      "store_id":this.store_info.id
    }
    )
   this.api.deleteTswiaInvo(this.payInvo.pay_id).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Deleted') {
   this.deleteSalesitemList()
   }else{
    this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
   }
 },(err) => {
   //console.log(err);
   this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
  }) 
}

deleteSalesInvoLocal(){ 
  this.storage.get('salesLocalDelete').then((response) => {
    if (response) {
      this.salesLocalDelete = response
      //console.log(this.salesLocalDelete) 
    }
  });

  //
 
  if(this.payInvo.pay_id == undefined){
   this.salesLocal= this.salesLocal.filter(item => item.payInvo.pay_ref != this.payInvo.pay_ref);
   //console.log('case undefined' , this.salesLocal)
   this.storage.set('salesLocal', this.salesLocal).then((response) => {
    //console.log('resoponse set', response) 
    this.presentToast('تم الحذف بنجاح' , 'success') 
    this.back()
  });
  }else{
    this.sales = this.sales.filter(item => item.payInvo.pay_ref != this.payInvo.pay_ref);
     //console.log('case defined',this.sales)
     this.storage.set('sales', this.sales).then((response) => {
     //console.log('sales', response) 
    this.salesLocalDelete.push({
      "payInvo": this.payInvo,
      "itemList": this.itemList 
    })
    this.storage.set('salesLocalDelete', this.salesLocalDelete).then((response) => {
      //console.log('resoponse set', response) 
      this.presentToast('تم الحذف بنجاح' , 'success') 
      this.back()
    }); 
  });
  }

}


deleteSalesitemList(){  
   this.api.deleteTswiaitemList(this.payInvo.pay_ref).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Deleted') {
   
      this.sales = this.sales.filter(item => item.payInvo.pay_ref != this.payInvo.pay_ref);
       //console.log(' case ffff ' ,this.sales)
      this.storage.set('sales', this.sales).then((response) => {
      //console.log('sales', response) 
      this.performSyncDel()
      
      });
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
