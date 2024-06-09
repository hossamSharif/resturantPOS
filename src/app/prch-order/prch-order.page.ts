import { Component, OnInit, ViewChild, ElementRef ,Renderer2,Input} from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import { AlertController, IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { AuthServiceService } from '../auth/auth-service.service';
import { PrintModalPage } from '../print-modal/print-modal.page';
import { ItemModalPage } from '../item-modal/item-modal.page';
import { FilterPipe } from '../sales/pipe';
import { FilterPipe2 } from '../sales/pipe2';
import { FilterPipe3 } from '../sales/pipe3';

@Component({
  selector: 'app-prch-order',
  templateUrl: './prch-order.page.html',
  styleUrls: ['./prch-order.page.scss'],
})
export class PrchOrderPage implements OnInit {

 
  @ViewChild("dstP") nameField: ElementRef;
  @ViewChild('qtyIdP6') qtyIdP6; 
  @ViewChild('dstPop7') dstPop7; 
  @ViewChild('popInput6') popInput2; 
  @ViewChild('popover6') popover2;
sub_account:Array<any> =[]
sub_accountLocalPurch:Array<any> =[]
items:Array<any> =[]
isOpen = false; 
sub_accountPurch:Array<any> =[]

color :any ='dark'
itemsLocal:Array<any> =[]
itemList:Array<any> =[]
purchLocal:Array<any> =[] 
purchase:Array<any> =[]
randomsNumber:Array<any> =[]
store_info : {id:any , location :any ,store_name:any , store_ref:any }
user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
sub_nameNew :any = ""
selectedItem : {id:any ,pay_ref:any,item_name:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,parcode:any,qty:any,tot:any ,dateCreated:any,aliasEn:any};
selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any,cat_id:any,cat_name:any,phone:any,address:any};
payInvo : {pay_id:any ,pay_ref:any ,store_id:any,tot_pr:any,pay:any,pay_date:any,pay_time:any,user_id:any,cust_id:any,pay_method:any,discount:any ,changee:any,sub_name:any,payComment:any,nextPay:any};
discountPerc :any = 0
radioVal : any = 0
radioVal3 : any = 0
printMode :boolean = false
offline: boolean = false;
printArr:Array<any> =[]
firstq : {id:any ,item_id:any , store_id:any , quantity :any ,	fq_year:any ,	pay_price:any ,	perch_price:any }
showMe :any =null
getItemLoader:boolean = false
searchLang :any = 0
searchTerm : any = ""
aliasTerm :any =""
searchResult :Array<any> =[]
aliasResult :Array<any> =[]
year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}

// اي طريقة دفع ح يكون في حساب مقابل ليها مثلا الكاش ح يتورد في حساب الخزينة وبنكك في حساب بنك الخرطوم اما الشيك فحيكون بالاجل و ح ينزل في  سجل الشيكات ويتحول الي حساب المعين سواء كان اتورد في حساب بنكي او اتسحب كاش واتورد فيحساب الخزينة 
constructor(private renderer : Renderer2,private modalController: ModalController,private alertController: AlertController, private authenticationService: AuthServiceService,private storage: Storage,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) {
  this.printArr.push({
    'payInvo': "",
    'itemList':"",
     'selectedAccount' :"",
      'sub_nameNew' : ""
  })

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
    aliasEn:""
  }
     
  }

async presentAlertConfirm() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'تأكيد!',
    mode:'ios' ,
    message: 'هل تريد طباعة فاتورة ؟ ',
    buttons: [
      {
        text: 'إلغاء',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
          //console.log('Confirm Cancel: blah'); 
          this.prepareInvo()
        }
      }, {
        text: 'موافق',
        id: 'confirm-button',
        handler: () => {
          if(this.radioVal3 == 0){
            this.presentModal(this.printArr , 'perchOrderAr')
          }else if(this.radioVal3 == 1){
            this.presentModal(this.printArr , 'perchOrderEn')
          }
        }
      }
    ]
  });

  await alert.present();
}

async priceChangeAlertConfirm() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'تأكيد!',
    mode:'ios' ,
    message: 'هل تريد تعديل اسعار البيع والشراء',
    buttons: [
      {
        text: 'إلغاء',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
          //console.log('Confirm Cancel: blah'); 
          this.addTolist() 
        }
      }, {
        text: 'موافق',
        id: 'confirm-button',
        handler: () => {
           this.updateItemDetail()
        }
      }
    ]
  });

  await alert.present();
}


updateItemDetail(){
  this.presentLoadingWithOptions('جاري تعديل البيانات ...')
  this.api.updateItem(this.selectedItem).subscribe(data => {
  //console.log(data)
  if (data['message'] != 'Post Not Updated') {
   this.presentToast('تم التعديل بنجاح' , 'success')
   this.getStockItemsAfterUpdate()
  }else{
  this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
  }
}, (err) => {
  //console.log(err);
  this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
},() => {
 this.loadingController.dismiss()
}) 
}

Print(elem){ 
    this.printMode = true 
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

ngOnInit() {
  this.prepareOffline()
  this.getAppInfo()  
 // this.getItems()
  this.getStockItems()  
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
       this.prepareInvo()
    }
  });
  this.storage.get('searchLang').then((response) => {
    if (response) {
      this.searchLang = response
      //console.log('searchLang' ,this.searchLang) 
    }
  });   
}

prepareOffline(){
  this.storage.get('itemsLocal').then((response) => {
    if (response) {
      this.itemsLocal = response 
       //console.log(this.itemsLocal)
       this.items = this.itemsLocal  
    }
  });  
  this.storage.get('purchLocal').then((response) => {
   if (response) {
     this.purchLocal = response
     //console.log('purchLocal',this.purchLocal) 
   }
 });
 this.storage.get('purchase').then((response) => {
  if (response) {
    this.purchase = response 
     //console.log(this.purchase)  
  }
}); 

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


radioChange(ev){
  //console.log(ev.target.value) 
 }
 radio3Change(ev){
  //console.log(ev.target.value) 
 }

 presentPopover(e?: Event) {
  //console.log('preent me', e)
   this.popover2.event = e;
   this.isOpen = true;
   this.clear()
   this.searchResult = this.items
   setTimeout(() => {
   this.setFocusOnInput('popInput2')
   }, 2000);
 }
 
 
 didDissmis(){
  this.isOpen = false
  //console.log('dismissOver')
  this.setFocusOnInput('qtyIdP6')
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
    qty: 0,
    tot: 0, 
    aliasEn:""
  }
 }else{
  this.searchTerm = "" 
 }
}


prepareInvo(){ 
  this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_name:"",cat_id:"",phone:"",address:""};
  this.sub_nameNew = ""
  this.radioVal = 0
  this.payInvo ={pay_id:undefined ,pay_ref:0 ,store_id:"",tot_pr:0,pay:0,pay_date:"",pay_time:"",user_id:"",cust_id:null,pay_method:"",discount:0 ,changee:0,sub_name:"",payComment:"",nextPay:null};
  this.discountPerc = 0
  let d = new Date
// this.payInvo.pay_date  = d.getMonth().toString() + "/"+ d.getDay().toString()+ "/"+ d.getFullYear().toString() 
 this.payInvo.pay_date = this.datePipe.transform(d, 'yyyy-MM-dd')
 
 this.payInvo.pay_time = this.datePipe.transform(d, 'HH:mm:ss') 
 this.generateRandom()  
 this.payInvo.store_id =this.store_info.id
 this.payInvo.user_id = this.user_info.id
 //console.log( this.payInvo) 
 this.itemList = []
 this.getSalesAccount()  
// this.setFocusOnInput('dstPop7')
}
  
setFocusOnInput(Input) {
  //console.log('setFocusOnInput')
  if (Input == 'dstP') { 
    this.nameField.nativeElement.focus(); 
   } else if(Input == 'dstPop7') {
    this.dstPop7.setFocus();
    this.isOpen = true;
    this.clear()
    this.searchResult = this.items
    setTimeout(() => {
        this.popInput2.setFocus(); 
    }, 1500);
  
   }else if(Input == 'qtyIdP6') {
    this.qtyIdP6.setFocus();  
   }else if(Input == 'popInput2'){
    this.popInput2.setFocus();  
   }
}

getStockItems(pickName?) {
  this.storage.get('year').then((response) => {
    if (response) {
      this.year = response 
      if (this.offline == false) {
        this.api.stockItems(1,this.year.id).subscribe(data => {
          //console.log(data)
          let res = data
          this.items = res['data']
          this.items.forEach(element => {
            element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
          });
          this.searchResult = this.items
          if(pickName){
            this.pickDetail(pickName , 'afterSave') 
          }
        }, (err) => {
          //console.log(err);
        },
          () => {
          }
        )
      } else {
        this.items = this.itemsLocal
        this.items.forEach(element => {
          element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
        });
        this.searchResult = this.items
      }
    } 
  });
 

}


// sumStockItems(pickName?) {
//   if (this.offline == false) {
//     this.api.stockItems(1).subscribe(data => {
//       //console.log(data)
//       let res = data
//       let arr = res['data']
//       for (let index = 0; index < this.items.length; index++) {
//         const element = this.items[index];
//         let flt = arr.filter(x=>x.id == element.id)
//         if(flt.length>0){
//           element.perchQuantity =  +element.perchQuantity + +flt[0].perchQuantity
//         //  element.firstQuantity =  +element.firstQuantity + +flt[0].firstQuantity
//           element.salesQuantity =  +element.salesQuantity + +flt[0].salesQuantity
//         }
//       } 
//       this.items.forEach(element => {
//         element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
//       });
//       this.searchResult = this.items
//       if(pickName){
//         this.pickDetail(pickName , 'afterSave') 
//       }
//     }, (err) => {
//       //console.log(err);
//     },
//       () => {
//       }
//     )
//   } else {
//     this.items = this.itemsLocal
//     this.items.forEach(element => {
//       element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
//     });
//     this.searchResult = this.items
//   }

// }





getStockItemsAfterUpdate() {
  let fl : Array<any>=[]
      if(this.searchLang == 1){
        fl= this.items.filter(x=>x.item_desc == this.selectedItem.item_desc)
       //console.log('hyrr',fl);
     }else{
        fl= this.items.filter(x=>x.item_name == this.selectedItem.item_name)
       //console.log(fl);
     }
        
    let qt = +this.selectedItem.qty
    let perch = +this.selectedItem.perch_price
    let pay = +this.selectedItem.pay_price

    //console.log(fl);
    this.selectedItem = {
      id:fl[0]['id'],
      dateCreated:fl[0]['dateCreated'],
      pay_ref:this.payInvo.pay_ref,
      item_desc:fl[0]['item_desc'],
      item_name:fl[0]['item_name'],
      item_unit:fl[0]['item_unit'],
      parcode:fl[0]['parcode'],
      pay_price:pay,
      perch_price:perch,
      qty:qt,
      tot:fl[0]['perch_price'],
      aliasEn:fl[0]['aliasEn']
    }
    
    this.addTolist()
  
  if (this.offline == false) {
    this.getItemLoader =true
    this.api.stockItems(1,this.year.id).subscribe(data => {
      //console.log(data)
      let res = data
      this.items = res['data']
       this.sumStockItemsAfterUpdate()
    }, (err) => {
      //console.log(err);
      this.getItemLoader =false
    },
      () => {
      }
    )
  } else {
    this.items = this.itemsLocal
    this.items.forEach(element => {
      element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
    });
    this.searchResult = this.items
  } 
}

sumStockItemsAfterUpdate() { 
  if (this.offline == false) {
    this.getItemLoader =true
    this.api.stockItems(1,this.year.id).subscribe(data => {
      //console.log(data)
      let res = data
      let arr = res['data']
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        let flt = arr.filter(x=>x.id == element.id)
        if(flt.length>0){
          element.perchQuantity =  +element.perchQuantity + +flt[0].perchQuantity
         // element.firstQuantity =  +element.firstQuantity + +flt[0].firstQuantity
          element.salesQuantity =  +element.salesQuantity + +flt[0].salesQuantity
        }
      }   
      this.items.forEach(element => {
        element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
      });
      this.searchResult = this.items
      //console.log('searchResult after Update',this.searchResult)
      this.getItemLoader =false
      this.storage.set('itemsLocal', this.items).then((response) => {
      //console.log('resoponse set', response)
      this.storage.get('itemsLocal').then((response2) => {
        if (response) {
          this.itemsLocal = response2 
          this.searchResult = [] 
           this.items = this.itemsLocal  
           this.searchResult = this.items
        //   this.loadingController.dismiss() 
        }
      }); 
    });  
    }, (err) => {
      //console.log(err);
      this.getItemLoader =false
    },
      () => {
      }
    )
  } else {
    this.items = this.itemsLocal
    this.items.forEach(element => {
      element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
    });
    this.searchResult = this.items
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
  if(+this.itemList[i].quantity > 0 && +this.itemList[i].perch_price > 0){
    this.itemList[i].tot = +this.itemList[i].quantity * +this.itemList[i].perch_price
    this.discountPerc = 0
    this.payInvo.discount = 0
    this.hideMe(i)
    this.getTotal() 
  }else{
    this.presentToast("خطأ في الإدخال ", "danger")
  }
}
 

ionViewDidEnter(){
  
}


async presentModal2(id?, status?) {
  // if (id !='null' && status == 'edit') {
  //    let fl= this.items.filter(x=>x.id == id)
  // //console.log(fl);

  // this.selectedItem = {
  //   id:fl[0]['id'],
  //   item_desc:fl[0]['item_desc'],
  //   model:fl[0]['model'],
  //   item_name:fl[0]['item_name'],
  //   min_qty:fl[0]['min_qty'],
  //   part_no:fl[0]['part_no'],
  //   brand:fl[0]['brand'],
  //   item_unit:fl[0]['item_unit'],
  //   item_parcode:fl[0]['item_parcode'],
  //   pay_price:fl[0]['pay_price'],
  //   perch_price:fl[0]['perch_price']
  // }

   
  // }
 

  const modal = await this.modalController.create({
    component: ItemModalPage ,
    componentProps: {
      "item": this.selectedItem,
      "status": status
    }
  });
  
  modal.onDidDismiss().then((dataReturned) => {
    if (dataReturned !== null) {
      //console.log(dataReturned )
      this.doAfterDissmiss(dataReturned)
    }
  });

  return await modal.present(); 
}

getItems(pickName?) {
  if (this.offline == false) {
    this.api.getItems().subscribe(data => {
      //console.log(data)
      let res = data
      this.items = res['data']
      this.searchResult = this.items
      if(pickName){
        this.pickDetail(pickName , 'afterSave') 
      }
    }, (err) => {
      //console.log(err);
    })
  } else {
    this.items = this.itemsLocal 
    this.searchResult = this.items
  }
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

generateRandom():any{
let da = new Date 
//console.log(da)
let randomsNumber = da.getMonth().toString() + da.getDay().toString() + da.getHours().toString()+ da.getMinutes().toString()+da.getSeconds().toString()+da.getMilliseconds().toString()
this.payInvo.pay_ref = this.store_info.store_ref + randomsNumber
//console.log(randomsNumber)
//console.log(this.payInvo.pay_ref)  
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
    qty:"",
    tot:item.perch_price, 
    aliasEn:item.aliasEn
  } 
    this.searchTerm = item.item_name
    //console.log( this.selectedItem); 
    this.didDissmis()
    
  }

pickDetail(ev , notev?){
  let evVal 
  if(notev){
   evVal = ev
   this.searchLang = 0
  }else{
  evVal = ev.target.value
  }
  //console.log('evVal',evVal);
  let fl : Array<any>=[]
  if(this.searchLang == 1){
    fl= this.items.filter(x=>x.item_desc == evVal)
   //console.log('hyrr',fl);
 }else{
    fl= this.items.filter(x=>x.item_name == evVal)
   //console.log(fl);
 }

  
//console.log(fl);
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
  qty:0,
  tot:fl[0]['perch_price'],
   aliasEn:fl[0]['aliasEn']
}
//console.log( this.selectedItem);
this.setFocusOnInput('qtyIdP6')

}

qtyhange(ev){
//console.log(ev);
this.selectedItem.tot = (this.selectedItem.qty * +this.selectedItem.perch_price).toFixed(2)
}


payPricehange(ev){
  if((+this.selectedItem.perch_price >= +this.selectedItem.pay_price) && (+this.selectedItem.perch_price > 0 && +this.selectedItem.pay_price >0)){
    this.presentToast('سعر الشراء اعلي من سعر البيع ' , 'warning')
  }
//console.log(ev);
this.selectedItem.tot = (this.selectedItem.qty * +this.selectedItem.perch_price).toFixed(2)
}

perchPricehange(ev){
  if((this.selectedItem.perch_price >= this.selectedItem.pay_price) &&  this.selectedItem.perch_price > 0 && this.selectedItem.pay_price >0){
    this.presentToast('سعر الشراء اعلي من سعر البيع ' , 'warning')
  }
//console.log(ev);
this.selectedItem.tot = (this.selectedItem.qty * +this.selectedItem.perch_price).toFixed(2)
}

payChange(ev){
//console.log(ev); 
this.payInvo.changee = +( this.payInvo.tot_pr - +this.payInvo.discount) - ev.target.value 
}

discountChange(ev){
  //console.log('discountChange' ,ev); 
  this.discountPerc = ((+this.payInvo.discount /+this.payInvo.tot_pr) * 100 )
  this.payInvo.changee = +( this.payInvo.tot_pr - ev.target.value) - this.payInvo.pay
}

discountPerChange(ev){
  //console.log('discountPerChange',ev);
  this.payInvo.discount = (+this.payInvo.tot_pr * +this.discountPerc/100).toFixed(2)
  this.payInvo.changee = +( this.payInvo.tot_pr -  this.payInvo.discount ) - this.payInvo.pay
}
deleteItem(index){
//console.log( index); 
this.itemList.splice(index,1)
//console.log( this.itemList);
this.payInvo.pay =0
this.payInvo.discount=0
this.getTotal()
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

getTotal(){
let sum = this.itemList.reduce( (acc, obj)=> { return acc + +obj.tot; }, 0);
//console.log('sum', sum)
this.payInvo.tot_pr = sum - +this.payInvo.discount
this.payInvo.changee = +(sum - +this.payInvo.discount) - this.payInvo.pay
this.payInvo.tot_pr = this.payInvo.tot_pr.toFixed(2)
this.payInvo.changee = this.payInvo.changee.toFixed(2)
} 

chechPrice(cases?){
  if (this.selectedItem.item_name == "" || this.selectedItem.id == "" || +this.selectedItem.qty == 0) {
    this.presentToast('الرجاء اختيار الصنف وتحديد الكمية', 'danger')
  } else {
    if (cases == 'check'){
        if(+this.selectedItem.perch_price >= +this.selectedItem.pay_price){
          this.priceChangeAlertConfirm()
        }else{
          this.addTolist()
        }
      }else if(cases == 'uncheck'){
      ///update item => getiTEmstock and sysnc=> reselectItem => addtolist\
      this.updateItemDetail()
      }  
  }
 
}

// 1386.00  =>  1490.00


addTolist() { 
  if (this.selectedItem.item_name == "" || this.selectedItem.id == "" || +this.selectedItem.qty == 0) {
    this.presentToast('الرجاء ادختيار الصنف وتحديد الكمية', 'danger')
  } else {
    let fl: any = []
    if (this.itemList.length > 0) {
      fl = this.itemList.filter(x => x.item_name == this.selectedItem.item_name &&  x.perch_price == this.selectedItem.perch_price)
    }
    if (fl.length == 0) {
      let d =   new Date
      let r= this.datePipe.transform(d, 'dd-MM-YYYY')

      this.itemList.push({
      "id" : 'NULL',
      "pay_ref" :this.selectedItem.pay_ref,
      "item_name" :this.selectedItem.item_name,
      "pay_price" :this.selectedItem.pay_price,
      "quantity" : +this.selectedItem.qty,
      "tot" :this.selectedItem.tot, 
      "store_id" :+this.store_info.id, 
      "item_id" : +this.selectedItem.id,
      "dateCreated" : r,
      "perch_price":this.selectedItem.perch_price
      })
    } else {
      //console.log(this.itemList);
      //console.log(fl[0].quantity);
      //console.log(+this.selectedItem.qty);

      this.selectedItem.qty = +fl[0].quantity + +this.selectedItem.qty
      let index = this.itemList.map(e => e.item_name).indexOf(this.selectedItem.item_name);
      this.itemList[index].quantity = +this.selectedItem.qty
      this.itemList[index].tot = (+this.selectedItem.qty * +this.selectedItem.perch_price).toFixed(2)
     // this.itemList[index].tot.toFixed(2)
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
      qty: 0,
      tot: 0,
      aliasEn:""
    }
    this.getTotal()

  }

}

validate():boolean{
  let fl :any = []
  if (this.sub_account) {
     fl = this.sub_account.filter(x=>x.sub_name == this.sub_nameNew )
  //console.log(fl)
  }
  
if (this.itemList.length == 0  || this.payInvo.pay_ref == "" ) {
  this.presentToast('الرجاء ادخال اصناف الي القائمة','danger')
  return false
}else if( this.radioVal == 1 && this.sub_nameNew =="") {
  this.presentToast('sالرجاء إختيار حساب العميل','danger')
  return false
}else if( this.radioVal == 0 && this.selectedAccount.sub_name =="") {
  this.presentToast('wالرجاء إختيار حساب العميل','danger')
  return false
}
else if(this.payInvo.cust_id == null && this.radioVal == 0 && this.selectedAccount.sub_name =="") {
  this.presentToast('الرجاء إختيار حساب العميل','danger')
  return false
}else if(+this.payInvo.cust_id == 0 && this.radioVal == 0) {
  this.presentToast('الرجاء إختيار حساب العميل','danger')
  return false
}
else if(this.payInvo.pay_date == "" || this.payInvo.pay_date == undefined) {
  this.presentToast('الرجاء تحديد التاريخ ','danger')
  return false
}else if(this.payInvo.changee < 0 ) {
  this.presentToast('الرجاء مراجعة المبلغ المستلم والخصم  ','danger')
  return false
}else if(this.radioVal == 1 && fl.length > 0) {
  this.presentToast('العميل موجود مسبقا , الرجاء اختيارة من قائمة العملاء','danger')
  return false
}
 else {
  return true
}
}

save() { 
  let d : Date = this.payInvo.pay_date 
  this.payInvo.sub_name = this.selectedAccount.sub_name 
  this.payInvo.pay_date = this.datePipe.transform(d, 'yyyy-MM-dd')
  //console.log('save testing',this.payInvo ,  this.payInvo.sub_name)
    if (this.validate() == true) {
       this.presentLoadingWithOptions('جاري حفظ البيانات ...')
        // حساب محفوظ اوننلاين وموجود في قائمة العملاء
       if(this.radioVal == 0 && this.selectedAccount.id != null){
        if (this.offline == true) {
       this.presentToast('لا يوجد اتصال بالإنترنت',"danger")
        }else{
         this.saveInvo() 
        }
       } 
       // حساب محفوظ محلي وموجود في قائمة العملاء
       else if(this.radioVal == 0 && this.selectedAccount.id == null && this.selectedAccount.sub_name!="") {
        if (this.offline == true) {
          this.presentToast('لا يوجد اتصال بالإنترنت',"danger")
        }else{
          this.saveSubAccount()
        }
      }
      //حساب جديد
       else if(this.radioVal == 1) {
        //console.log(this.radioVal,'saveSubAccountlocal()')
        if (this.offline == true) {
          //console.log('saveSubAccountlocal()')
          this.presentToast('لا يوجد اتصال بالإنترنت',"danger")
        }else{
          this.saveSubAccount()
        }
        
      } 
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
    sub_balance:fl[0]['sub_balance'],
    cat_id:fl[0]['cat_id'],
    cat_name:fl[0]['cat_name'],
    phone:fl[0]['phone'],
    address:fl[0]['address']

  }
  //console.log( this.selectedAccount);
  this.payInvo.cust_id = this.selectedAccount.id
  this.payInvo.sub_name = this.selectedAccount.sub_name
  //  this.setFocusOnInput()
}else{
    this.presentToast('خطأ في اسم الحساب ', 'danger') 
    this.selectedItem.item_name =""
  }
  }

preparenewaccount(){ 
  if (this.selectedAccount.sub_name.length>0 && this.selectedAccount.id == null) {
    // this.selectedAccount.sub_name = this.payInvo.sub_name  
  } else {
     //console.log('slwcted from drop' ) 
      this.selectedAccount.sub_name = this.sub_nameNew
      this.payInvo.sub_name  =this.selectedAccount.sub_name  
}
  this.selectedAccount.id=null  
  this.selectedAccount.ac_id = 2
  this.selectedAccount.sub_type="credit"
  this.selectedAccount.sub_code=null
  this.selectedAccount.sub_balance="0"
  this.selectedAccount.cat_id = 2
  this.selectedAccount.cat_name = 'الموردين'
  this.selectedAccount.store_id=this.store_info.id  
  //console.log('preparenewaccount' , this.selectedAccount)
}


saveSubAccount(){
//console.log('crea accoun')      
this.preparenewaccount()
this.api.saveSubAccount(this.selectedAccount).subscribe(data => {
//console.log(data)
if (data['message'] != 'Post Not Created') {
  this.payInvo.cust_id =  data['message'] 
   //حالة الحساب موجود محلي والحفظ انلاين يسحب من المحلي ويضاف سsalesaccount   
   if(this.radioVal == 0 && this.selectedAccount.id == null && this.offline == false) {
    this.sub_accountLocalPurch = this.sub_accountLocalPurch.filter(x=>x.sub_name != this.selectedAccount.sub_name)
    //console.log('imhereeeeeeeeeeeeeeeeee')
    this.storage.set('sub_accountLocalPurch', this.sub_accountLocalPurch).then((response) => {
    //console.log('resoponse set', this.sub_accountLocalPurch)
    this.selectedAccount.id = this.payInvo.cust_id
    this.sub_accountPurch.push(this.selectedAccount)
    this.storage.set('sub_accountPurch', this.sub_accountPurch).then((response) => {

    })
   });
  }
  this.saveInvo()
}else {
   this.presentToast('لم يتم انشاء حساب للمورد , خطا في الإتصال حاول مرة اخري' , 'danger')
} 
  }, (err) => {
//console.log(err);
this.presentToast('لم يتم انشاء حساب للمورد , خطا في الإتصال حاول مرة اخري' , 'danger')
 },()=>{
 this.loadingController.dismiss()
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
  this.sub_accountLocalPurch.push(
    this.selectedAccount
  )
  this.storage.set('sub_accountLocalPurch', this.sub_accountLocalPurch).then((response) => {
    //console.log('resoponse set', this.sub_accountLocalPurch)
   // this.payInvo.cust_id =  data['message']
    this.saveInvoLocal()
  });
 }

 saveInvoLocal() {
  //console.log('resoponse set', this.payInvo.sub_name)
 // this.payInvo.sub_name = this.selectedAccount.sub_name
  this.purchLocal.push({
    "payInvo": this.payInvo,
    "itemList": this.itemList 
  })
  this.storage.set('purchLocal', this.purchLocal).then((response) => {
    //console.log('resoponse set', response)
    this.printArr = []
  this.printArr.push({
    'payInvo': this.payInvo,
    'itemList':this.itemList,
    'selectedAccount' : this.selectedAccount,
    'sub_nameNew' : this.sub_nameNew
  }) 
  //console.log(this.printArr)
    this.presentAlertConfirm()
    this.presentToast('تم الحفظ بنجاح', 'success')
  });
}

saveInvo(){
  this.api.savePerchOrderInvo(this.payInvo).subscribe(data => {
  //console.log(data)
  this.saveitemList()
    }, (err) => {
  //console.log(err);
  this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
  })
}

saveitemList(){  
this.api.savePerchOrderitemList(this.itemList).subscribe(data=>{ 
  //console.log(data) 
  this.printArr = []
  this.printArr.push({
    'payInvo': this.payInvo,
    'itemList':this.itemList,
    'selectedAccount' : this.selectedAccount,
    'sub_nameNew' : this.sub_nameNew
  }) 
  //console.log(this.printArr)
 
  this.presentAlertConfirm() 
  this.presentToast('تم الحفظ بنجاح' , 'success')  
}, (err) => {
  //console.log(err);
  this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
}, () => {
  this.loadingController.dismiss()
}
)      
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
   this.prepareInvo()
  }
});

return await modal.present(); 
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
//
doAfterDissmiss(data){
  if (data.role == 'save' ) {
    //console.log('edit' ,data.data)
    this.saveItem(data.data )  
  } 
}

saveItem(mdata){ 
  this.presentLoadingWithOptions('جاري حفظ البيانات ...')
 this.api.saveitemMulti(mdata[0]).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Created') { 
     this.firstq = {id:null ,item_id:data['message'] , store_id:this.store_info.id , quantity :mdata[1].quantity ,pay_price:mdata[0].pay_price,perch_price:mdata[0].perch_price ,fq_year:'2022'}
     this.saveFierstQty(mdata[0].item_name) 
   }else{
     this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
   }
  
 }, (err) => {
   //console.log(err);
   this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
 }) 
}

async saveFierstQty(item_name){  
this.api.saveFirstQty(this.firstq).subscribe(data=>{ 
 //console.log(data)  
  //this.getItems(item_name) 
 this.getStockItems(item_name)
 this.presentToast('تم الحفظ بنجاح' , 'success')
}, (err) => {
 //console.log(err);
 this.presentToast('1لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')

 this.loadingController.dismiss()

}, () => {
 this.loadingController.dismiss()
}
)      
}


 



}