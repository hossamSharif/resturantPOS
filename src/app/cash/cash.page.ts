import { Component, OnInit, ViewChild, ElementRef ,Renderer2,Input} from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { from, Observable } from 'rxjs';
import { AlertController, IonInput, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { AuthServiceService } from '../auth/auth-service.service';
import { AccountModalPage } from '../account-modal/account-modal.page';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.page.html',
  styleUrls: ['./cash.page.scss'],
})
export class CashPage implements OnInit {
  sub_accountFrom:Array<any> =[] 
  itemList:Array<any> =[] 
  sub_accountTo:Array<any> =[] 
  randomsNumber:Array<any> =[]
  jdetail_fromArr :Array<any> =[]
  journalType :Array<any> =[]
  journalTypeDetails :Array<any> =[]
  jType : any;
  pay:any = 0
  jdetail_toArr :Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  selectedFromAccountArr:Array<any> =[] 
  selectedToAccountArr:Array<any> =[]  
  selectedItem : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any,debit:any ,credit:any, currentType:any}; 
  selectedFromAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any,debit:any ,credit:any, currentType:any}; 
  selectedFromAccount2 : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any,debit:any ,credit:any, currentType:any}; 
  selectedFromAccount3 : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any,debit:any ,credit:any, currentType:any}; 
  selectedToAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,credit:any ,debit:any, currentType:any}; 
  selectedToAccount2 : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,credit:any ,debit:any, currentType:any}; 
  selectedToAccount3 : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,credit:any ,debit:any, currentType:any}; 
  selectedJtype : {id:any ,type_name:any,sub_name:any,type_desc:any,debitac_id:any,creditac_id:any,default_val:any ,default_details:any ,store_id:any}; 
 	
  payInvo : {rec_id:any ,rec_ref:any,rec_type:any ,rec_date:any,rec_detailes:any,rec_pay:any,user_id:any,ac_id:any,store_id:any};
  showMe :any =null
  journal : {j_id:any ,j_ref:any,j_details:any ,j_type:any,invo_ref:any,j_desc:any,j_date:any,store_id:any,user_id:any,j_pay:any,standard_details:any};

  jdetail_from : {id:any ,j_id:any,j_ref:any ,ac_id:any,credit:any,debit:any,j_desc:any,j_type:any,store_id:any};
  jdetail_from2 : {id:any ,j_id:any,j_ref:any ,ac_id:any,credit:any,debit:any,j_desc:any,j_type:any,store_id:any};
  jdetail_from3 : {id:any ,j_id:any,j_ref:any ,ac_id:any,credit:any,debit:any,j_desc:any,j_type:any,store_id:any};
  jdetail_to : {id:any ,j_id:any,j_ref:any ,ac_id:any,credit:any,debit:any,j_desc:any,j_type:any,store_id:any};
  jdetail_to2 : {id:any ,j_id:any,j_ref:any ,ac_id:any,credit:any,debit:any,j_desc:any,j_type:any,store_id:any};
  jdetail_to3 : {id:any ,j_id:any,j_ref:any ,ac_id:any,credit:any,debit:any,j_desc:any,j_type:any,store_id:any};
  showFrom :boolean =false
  showTo:boolean = false
  showFrom3 :boolean =false
  showTo3:boolean = false
///
coloredMsgFrom:boolean = false
coloredMsgFrom3:boolean = false
coloredMsgTo:boolean = false
coloredMsgTo3:boolean = false
// new aproch
device:any =''
  constructor(private platform :Platform ,private modalController: ModalController,private alertController: AlertController, private authenticationService: AuthServiceService,private storage: Storage,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) {
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
   this.storage.get('STORE_INFO').then((response) => {
     if (response) {
       this.store_info = response
        //console.log(response)
        //console.log(this.store_info) 
        this.getAllAccounts()
        this.getJournalType()     
        this.prepareInvo()
        
     }
   });
  }
 

coleredMsgFromFunc(){
  if (this.showFrom == true && this.selectedFromAccount2.sub_name ==""){
    this.coloredMsgFrom = true
  }else if (this.showFrom3 == true && this.selectedFromAccount3.sub_name ==""){
    this.coloredMsgFrom3 = true
  } 

  if (this.showTo == true && this.selectedToAccount2.sub_name ==""){
    this.coloredMsgTo = true
  }else if (this.showTo3 == true && this.selectedToAccount3.sub_name ==""){
    this.coloredMsgTo3 = true
  }
  setTimeout(() => {
    this.coloredMsgFrom = false
    this.coloredMsgFrom3 = false
    this.coloredMsgTo = false
    this.coloredMsgTo3 = false

  }, 10000);
}

//  jTypeChange(ev){
//   this.selectedToAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,credit:"",debit:"" ,currentType:""};
//   this.selectedToAccount2 = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,credit:"",debit:"" ,currentType:""};
//   this.selectedToAccount3 = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,credit:"",debit:"" ,currentType:""};
//   this.selectedFromAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,debit:"",credit:"",currentType:""}; 
//   this.selectedFromAccount2 = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,debit:"",credit:"",currentType:""}; 
//   this.selectedFromAccount3 = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,debit:"",credit:"",currentType:""}; 
 
//   this.showFrom = false
//   this.showFrom3 = false
//   this.showTo = false
//   this.showTo3 = false
//   this.journal.j_details=""
//   //console.log(ev.target.value) 
//   //console.log(this.jType) 
//   let fl= this.journalType.filter(x=>x.type_name == ev.target.value)
//   let flDetails = this.journalTypeDetails.filter(x=>x.jType_id == fl[0].id)
//   this.selectedJtype = fl[0]
//   //console.log('im here', fl ,fl[0])
// //show account feilds
// this.journal.j_details=this.selectedJtype.type_desc

// if (+fl[0].from_count ==  2 ) {
//   this.showFrom = true
//   this.showFrom3 = false
// } else if(+fl[0].from_count == 3) {
//   this.showFrom3 = true
//   this.showFrom = true
// }

// if (+fl[0].to_count == 2) {
//   this.showTo = true
//   this.showTo3 = false
// } else if(+fl[0].to_count == 3) {
//   this.showTo = true
//   this.showTo3 = true
// }
// //
// let fromAccount :Array<any> = []
// let toAccount :Array<any> = []
// for (let i = 0; i <  flDetails.length; i++) {
//   const element =  flDetails[i];
//   if(element.type_ac == 'debit'){
//    fromAccount.push(element)
//   }else if(element.type_ac == 'credit'){
//     toAccount.push(element) 
//   }
// }
// //console.log('from' ,fromAccount)
// //console.log('to', toAccount)
// if(fromAccount){
//   for (let i = 0; i <  fromAccount.length; i++) {
//     const element =  fromAccount[i];
//     let flAccounts = this.sub_accountFrom.filter(x=>x.id == element.ac_id)
//     //console.log(fromAccount[0].sub_name)
//         if (i == 0) {
//           this.pickAccountFrom('ev', 1,flAccounts[0].sub_name)
//         }else if(i == 1){
//           this.pickAccountFrom('ev', 2,flAccounts[0].sub_name) 
//         }else if(i == 2){
//           this.pickAccountFrom('ev', 3,flAccounts[0].sub_name)
//         } 
//   }
 
// }

// if(toAccount){
//   for (let i = 0; i <  toAccount.length; i++) {
//     const element =  toAccount[i];
//     let flAccounts = this.sub_accountTo.filter(x=>x.id == element.ac_id)
//      //console.log(flAccounts[0].sub_name)
//         if (i == 0) {
//           this.pickAccountTo('ev', 1,flAccounts[0].sub_name)
//         }else if(i == 1){
//           this.pickAccountTo('ev', 2,flAccounts[0].sub_name)
//         }else if(i == 2){
//           this.pickAccountTo('ev', 3,flAccounts[0].sub_name)
//         } 
//   }
// }
// //  for (let i = 0; i <  flDetails.length; i++) {
// //    const element =  flDetails[i];
// //    if(element.type_ac == 'debit'){
// //     let flAccounts = this.sub_accountFrom.filter(x=>x.id == element.ac_id)
// //     //console.log(flAccounts[0].sub_name)
// //     if (i == 0) {
// //       this.pickAccountFrom('ev', 1,flAccounts[0].sub_name)
// //     }else if(i == 1){
// //       this.pickAccountFrom('ev', 2,flAccounts[0].sub_name)
// //     }else if(i == 2){
// //       this.pickAccountFrom('ev', 3,flAccounts[0].sub_name)
// //     }
// //    }else if(element.type_ac == 'credit'){
// //     let flAccounts = this.sub_accountTo.filter(x=>x.id == element.ac_id)
// //     //console.log(flAccounts[0].sub_name)
// //     if (i == 0) {
// //       this.pickAccountTo('ev',  1,flAccounts[0].sub_name)
// //     }else if(i ==1){
// //       this.pickAccountTo('ev',  2,flAccounts[0].sub_name)
// //     }else if(i ==2){
// //       this.pickAccountTo('ev', 3,flAccounts[0].sub_name)
// //     }
// //    }
// //  }



//     // if (this.selectedJtype.debitac_id != null) {
//     //   let fname = this.sub_accountFrom.filter(x => x.id == this.selectedJtype.debitac_id)
//     //   //console.log(fname)
//     //   this.pickAccountFrom(fname[0].sub_name, 4)
//     // } else if (this.selectedJtype.debitac_id == null) {
//     //   this.selectedFromAccount = { id: "", ac_id: "", sub_name: "", sub_type: "", sub_code: "", sub_balance: "", store_id: this.store_info.id, debitTot: "", creditTot: "", currentType: "" };
//     // }
//     // if (this.selectedJtype.creditac_id != null) {
//     //   let cname = this.sub_accountTo.filter(x => x.id == this.selectedJtype.creditac_id)
//     //   this.pickAccountTo(cname[0].sub_name, 1)
//     // } else if (this.selectedJtype.creditac_id == null) {
//     //   this.selectedToAccount = { id: "", ac_id: "", sub_name: "", sub_type: "", sub_code: "", sub_balance: "", store_id: this.store_info.id, creditTot: "", debitTot: "", currentType: "" };

//     // }  

//   this.payInvo.rec_detailes = fl[0].default_details 
//   this.payInvo.rec_pay = fl[0].default_val 
//   this.coleredMsgFromFunc()
//  }
 

 radioChange(ev){
  //console.log(ev)
 }


 pickAccount(ev , index ,sub_name?){
  let s :string
  if (sub_name) {
    s=sub_name
  } else {
    s= ev.target.value
  }
  let fl= this.sub_accountTo.filter(x=>x.sub_name ==  s)
  //console.log(s,this.sub_accountTo,fl);
  let bl :any 
  let ctype :any ;
 if(fl[0].debit > 0){
  ctype = 'debit'
 }else if(fl[0].credit > 0){
  ctype = 'credit' 
 }
  
  //console.log( this.selectedFromAccount); 
   
  this.selectedFromAccount = {
   id:fl[0]['id'],
   ac_id:fl[0]['ac_id'],
   sub_name:fl[0]['sub_name'],
   sub_type:fl[0]['sub_type'],
   sub_code:fl[0]['sub_code'], 
   store_id:fl[0]['store_id'],
   sub_balance:fl[0]['sub_balance'] ,
   currentType:ctype,
   debit:+fl[0]['debit'],  
   credit:+fl[0]['credit'] 
 } 


 this.selectedItem ={
  id:"NULL",
   ac_id:this.selectedFromAccount.id,
   sub_name:this.selectedFromAccount.sub_name,
   sub_type:this.selectedFromAccount.sub_type,
   sub_code:this.selectedFromAccount.sub_code, 
   store_id:this.selectedFromAccount.store_id,
   sub_balance:this.selectedFromAccount.sub_balance ,
   currentType:this.selectedFromAccount.currentType,
   debit:this.selectedFromAccount.debit,  
   credit:this.selectedFromAccount.credit 
 }
 
 //console.log('kjdh', this.selectedItem);
 //console.log(this.selectedItem )
}


 addTolist() {
  if (this.selectedItem.sub_name == "" || this.selectedItem.id == "" ) {
    this.presentToast('الرجاء اختيار الحساب ', 'danger')
  }else if(+this.pay == 0){
    this.presentToast('الرجاء ادخال المبلغ ', 'danger')
  }  else {
    let fl: any = []
    if (this.itemList.length > 0) {
      fl = this.itemList.filter(x => x.ac_id == this.selectedItem.ac_id)
    }

    if (fl.length == 0) {
      let debit :any=0 
      let credit :any=0 
      let currentType :any ="" 
      if(this.jType == 1 ){
       debit = +this.pay
      // currentType = "debit"
      }else if(this.jType == 2){
        credit = +this.pay
       // currentType = "credit"
      }
      this.itemList.push({
      "id": "NULL" ,
      "j_id":this.journal.j_id , 
      "ac_id":this.selectedItem.id ,
      "j_ref":this.journal.j_ref ,
      "j_desc":this.selectedItem.sub_type,
      "j_type":"",
      "credit": credit,
      "debit": debit,
      "store_id":this.store_info.id ,
      "sub_code":this.selectedItem.sub_code,
      "sub_name":this.selectedItem.sub_name 
    })
    } 
    
    // else {
    //   this.presentToast('الحساب موجود مسبقا في القائمة , يمكنك تعديل قيمة المبلغ', 'danger')
    // }
    this.getTotal()
    this.pay = 0
    this.selectedItem = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,credit:"",debit:"",currentType:""}; 
    this.selectedFromAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,credit:"",debit:"",currentType:""}; 
  }

}


 deleteItem(index){
  //console.log( index); 
  this.itemList.splice(index,1)
  //console.log( this.itemList);
  this.pay = 0 
  this.getTotal()
  }
  
 


 generateRandom(type):any{
  let da = new Date 
  //console.log(da)
  let randomsNumber = da.getMonth().toString() + da.getDay().toString() + da.getHours().toString()+ da.getMinutes().toString()+da.getSeconds().toString()+da.getMilliseconds().toString()
  if (type == 'invo') {
    this.payInvo.rec_ref = this.store_info.store_ref +"INV"+ randomsNumber 
    this.journal.invo_ref = this.payInvo.rec_ref 
  }else{
    this.journal.j_ref = this.store_info.store_ref + "JO" + randomsNumber 
    this.jdetail_from.j_ref = this.journal.j_ref
    this.jdetail_to.j_ref = this.journal.j_ref
  }
  //console.log(randomsNumber)
  //console.log(this.payInvo.rec_ref ,this.journal.j_ref)  
 }

 

hideMe(i){
  this.showMe = null 
}

editCell(i){ 
  if(this.jType  == 1){
    if(+this.itemList[i].debit > 0){
      this.hideMe(i)
      this.getTotal() 
    }else{
      this.presentToast("خطأ في الإدخال ", "danger")
    }
  }else if(this.jType  == 2){
    if(+this.itemList[i].credit > 0){
      this.hideMe(i)
      this.getTotal() 
    }else{
      this.presentToast("خطأ في الإدخال ", "danger")
    }
  } 
}



getTotal(){
  if(this.jType  == 1){
    let sum = this.itemList.reduce( (acc, obj)=> { return acc + +obj.debit; }, 0);
    //console.log('sum', sum)
    this.journal.j_pay = sum  

  } else if(this.jType  == 2){
    let sum = this.itemList.reduce( (acc, obj)=> { return acc + +obj.credit; }, 0);
    //console.log('sum', sum)
    this.journal.j_pay = sum  
  } 
} 

qtyClick(i){
  //console.log(i)
  this.showMe = i
}

pickAccountTo(ev ,index ,sub_name?){
  let s :string
  if (sub_name) {
    s = sub_name
  } else {
    s = ev.target.value
  }
  let fl= this.sub_accountTo.filter(x=>x.sub_name ==  s)
  //console.log(s,this.sub_accountTo,fl);
  let bl :any 
  let ctype :any 
  if(fl[0].debit > 0){
    ctype = 'debit'
   }else if(fl[0].credit > 0){
    ctype = 'credit'
  
   }
  if(index == 1 ){
     this.selectedToAccount = {
    id:fl[0]['id'],
    ac_id:fl[0]['ac_id'],
    sub_name:fl[0]['sub_name'],
    sub_type:fl[0]['sub_type'],
    sub_code:fl[0]['sub_code'], 
    store_id:fl[0]['store_id'],
    sub_balance:fl[0]['sub_balance'] ,
    currentType:ctype, 
     debit:+fl[0]['debit'],  
     credit:+fl[0]['credit'] 
     
  }
  
  
  //console.log('kjdh', this.selectedToAccount);
  }else if(index == 2){
    this.selectedToAccount2 = {
      id:fl[0]['id'],
      ac_id:fl[0]['ac_id'],
      sub_name:fl[0]['sub_name'],
      sub_type:fl[0]['sub_type'],
      sub_code:fl[0]['sub_code'], 
      store_id:fl[0]['store_id'],
      sub_balance:bl ,
      currentType:ctype,
      debit:+fl[0]['debit'],  
     credit:+fl[0]['credit']      
  }  
}else if(index == 3){
  this.selectedToAccount3 = {
    id:fl[0]['id'],
    ac_id:fl[0]['ac_id'],
    sub_name:fl[0]['sub_name'],
    sub_type:fl[0]['sub_type'],
    sub_code:fl[0]['sub_code'], 
    store_id:fl[0]['store_id'],
    sub_balance:bl ,
    currentType:ctype,
    debit:+fl[0]['debit'],  
     credit:+fl[0]['credit']
      
}

}
 

}
 
 prepareInvo(){ 

  this.jType = 1
  this.selectedItem = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,credit:"",debit:"",currentType:""}; 
  this.selectedFromAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,credit:"",debit:"",currentType:""}; 
 
  this.payInvo ={rec_id:undefined ,rec_ref:0 ,store_id:this.store_info.id,rec_date:"", user_id:"",ac_id:0,rec_detailes:"",rec_pay:0,rec_type:""};
 
  this.journal = {j_id:undefined ,j_ref:"",j_details:"" ,j_type:"",invo_ref:"",j_desc:"",j_date:"",store_id:this.store_info.id,user_id:"",j_pay:"",standard_details:""};
  
  this.jdetail_fromArr =[]
  this.jdetail_toArr =[]

  let d = new Date
  // this.payInvo.pay_date  = d.getMonth().toString() + "/"+ d.getDay().toString()+ "/"+ d.getFullYear().toString() 
  this.payInvo.rec_date = this.datePipe.transform(d, 'yyyy-MM-dd') 
  this.journal.j_date = this.datePipe.transform(d, 'yyyy-MM-dd')
  this.generateRandom('invo')  
  this.generateRandom('journal')

  this.payInvo.store_id =this.store_info.id
  this.payInvo.user_id = this.user_info.id
  this.journal.invo_ref = this.payInvo.rec_ref
  this.journal.store_id =this.store_info.id
  this.journal.user_id = this.user_info.id

  this.journal.store_id = this.store_info.id
  this.journal.user_id = this.user_info.id
  this.jdetail_from.store_id =this.store_info.id
  this.jdetail_from.j_ref =this.journal.j_ref
  this.jdetail_to.j_ref =this.journal.j_ref
  this.jdetail_to.store_id =this.store_info.id
  
  //console.log('fgdfdgdfgd', this.payInvo)  
  this.getAllAccounts()  
}

 getAllAccounts(){
  this.api.getAllAccounts(this.store_info.id,1).subscribe(data =>{
     let res = data
     this.sub_accountFrom = res ['data']
     this.sub_accountTo = res ['data']
     this.prepareCurrentBalnces()
     //console.log(this.sub_accountFrom)
   }, (err) => {
   //console.log(err);
 })  
 } 

 prepareCurrentBalnces(){
  for (let i = 0; i < this.sub_accountFrom.length; i++) {
    const element = this.sub_accountFrom[i];
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
  this.sub_accountTo = this.sub_accountFrom
  
}


 getJournalType(){
  this.api.getJournalType(this.store_info.id).subscribe(data =>{
     let res = data
     this.journalType = res ['data'] 
     //console.log('sasasa',this.journalType)
     this.getJournalTypeDetails()
   }, (err) => {
   //console.log(err);
 })  
 }

 getJournalTypeDetails(){
  this.api.getJournalTypeDetails(this.store_info.id).subscribe(data =>{
     let res = data
     this.journalTypeDetails = res ['data'] 
     //console.log(this.journalTypeDetails)
   }, (err) => {
   //console.log(err);
 })  
 }

 payChange(ev){
  //console.log( ev.target.value);
  this.jdetail_from.debit =  ev.target.value
  this.jdetail_to.credit =  ev.target.value
}


 validate():boolean{
  if ( +this.journal.j_pay == 0  ) {
  this.presentToast('الرجاء ادخال معاملات ','danger')
    return false
  }else if(this.journal.j_details == ""){
    this.presentToast('الرجاء ادخال البيان ','danger')
  } else {
    return false
  }
 }
 
setStandard(){
  let from2:any = ""
   let from3 :any = ""
  let to2 :any = ""
    let to3 :any = ""
  if (this.showFrom == true && this.selectedFromAccount2.sub_name  != undefined){
    from2 =  ' , ' + this.selectedFromAccount2.sub_name 
  }else if(this.showFrom3 == true && this.selectedFromAccount3.sub_name  != undefined){
    from3 = ' , ' + this.selectedFromAccount3.sub_name
  }

  if (this.showTo == true && this.selectedToAccount2.sub_name != undefined){
    to2 = ' , ' + this.selectedToAccount2.sub_name
  }else if(this.showTo3 == true && this.selectedToAccount3.sub_name != undefined){
    to3 = ' , ' + this.selectedToAccount3.sub_name
  }

  this.journal.standard_details =  'من حساب ' + this.selectedFromAccount.sub_name  + from2  + from3 +  ' الي حساب ' + this.selectedToAccount.sub_name  + to2  + to3
 
}

 prepare4save(){
  this.payInvo.rec_date  =  this.journal.j_date
  let d : Date = this.payInvo.rec_date   
 
  this.payInvo.rec_date = this.datePipe.transform(d, 'yyyy-MM-dd')
  //this.journal.j_desc = this.selectedJtype.type_desc
 // this.journal.j_details =  this.selectedJtype.type_desc

 if(this.jType  == 1){
  this.jdetail_from = {
       id :  "NULL"  ,
       j_id :this.journal.j_id , 
       ac_id : 46 ,
       j_ref :this.journal.j_ref ,
       j_desc :"",
       j_type : "",
       credit : this.journal.j_pay,
       debit : 0,
       store_id : this.store_info.id
  }

  this.jdetail_fromArr.push(this.jdetail_from )

  for (let i = 0; i < this.itemList.length; i++) {
    const element = this.itemList[i];
    this.jdetail_toArr.push(element)
   }

} else if(this.jType  == 2){
  this.jdetail_to = {
    id :  "NULL"  ,
    j_id :this.journal.j_id , 
    ac_id : 46 ,
    j_ref :this.journal.j_ref ,
    j_desc :"",
    j_type :  "",
    credit : this.journal.j_pay,
    debit : 0,
    store_id : this.store_info.id
}

this.jdetail_toArr .push(this.jdetail_to )

 for (let i = 0; i < this.itemList.length; i++) {
  const element = this.itemList[i];
  this.jdetail_fromArr.push(element)
 }
} 



  
 }


  save() { 
   this.prepare4save()
    if (  this.validate() == true) {
       this.presentLoadingWithOptions('جاري حفظ البيانات ...') 
       this.saveJournal()   
    }  
  }



  async presentModalSales(type?, sub_name? , cust_id?) { 
  if(this.selectedToAccount.ac_id == 8 ){
    type = 'sales' // حساب المبيعات
    if(this.selectedFromAccount2.sub_name == "" && this.showFrom == true){
      this.presentToast('الرجاء اختيار حساب العميل' , 'warning')
    }else if(this.selectedFromAccount2.sub_name != "" && this.showFrom == true){
    
    sub_name = this.selectedFromAccount2.sub_name // حساب العميل
    cust_id = this.selectedFromAccount2.id // حساب المورد
    }
  }
  if(this.selectedFromAccount.ac_id == 9 ){
    type = 'purch'  // حساب المشتريات
    if(this.selectedToAccount2.sub_name == "" && this.showTo == true){
      this.presentToast('الرجاء اختيار حساب المورد' , 'warning')
    }else if(this.selectedToAccount2.sub_name != "" && this.showTo == true){
    
     sub_name = this.selectedToAccount2.sub_name // حساب المورد
     cust_id = this.selectedToAccount2.id // حساب المورد
    }
  }


    const modal = await this.modalController.create({
      component: AccountModalPage ,
      componentProps: {
        "type": type,
        "sub_name": sub_name , 
         "cust_id" : cust_id
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
 
  doAfterDissmiss(data?){
    if (data.role == 'sales' ) {
        //console.log('sales' ,data.data)
        this.journal.j_details = this.journal.j_details + ", " + data.data[1] + ' , رقم :  ' + data.data[0].pay_id + ' بتاريخ ' + data.data[0].pay_date + ', إجمالي : ' + (+data.data[0].tot_pr - +data.data[0].discount) 
      } else if(data.role == 'purch'){
        this.journal.j_details = this.journal.j_details + ", " + data.data[1] + ' , رقم :  ' + data.data[0].pay_id + ' بتاريخ ' + data.data[0].pay_date + ', إجمالي : ' + (+data.data[0].tot_pr - +data.data[0].discount) 
      } 
  }

  saveInvo(){
    this.api.saveExpenseInvo(this.payInvo).subscribe(data => {
     //console.log(data)
     this.saveJournal()
       }, (err) => {
     //console.log(err);
     this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
      })
    }


  saveJournal() {
    this.api.saveJournal(this.journal).subscribe(data => {
      //console.log(data)
      this.jdetail_from.j_id = data['message']
      this.jdetail_to.j_id = data['message']
     
      this.saveJournalFrom()
    }, (err) => {
      //console.log(err);
      this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري', 'danger')
    })
  }

  saveJournalFrom() {
    this.api.saveJournalFrom(this.jdetail_fromArr).subscribe(data => {
      //console.log(data)
      this.saveJournalTo()
    }, (err) => {
      //console.log(err);
      this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري', 'danger')
    })
  }

  saveJournalTo() {
    this.api.saveJournalTo(this.jdetail_toArr).subscribe(data => {
      //console.log(data)
      this.prepareInvo()
      this.presentToast('تم الحفظ بنجاح' , 'success')  
    }, (err) => {
      //console.log(err);
      this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري', 'danger')
    })
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
  


}

