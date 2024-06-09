import { Component, OnInit } from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import {  LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common'; 
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router'

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.page.html',
  styleUrls: ['./balance-sheet.page.scss'],
})
export class BalanceSheetPage implements OnInit {
  loading:boolean = false
  showEmpty :boolean = false
  payArray:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  debitSum:any=0
  creditSum:any=0
  constructor(private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
    this.getAppInfo()
  }

  ngOnInit() {

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
      this.search() 
     }
   });
     
 }


search(){
  this.getBalanceSheet()
}


getBalanceSheet(){
  this.loading = true
  this.api.getBalanceSubAccount(this.store_info.id,2).subscribe(data =>{
     //console.log('hhhhhh',data)
     let res = data
     if(res['message'] != 'No record Found'){
       this.payArray = res['data'] 
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


prepareBalances(){
  for (let i = 0; i < this.payArray.length; i++) {
    const element = this.payArray[i];
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
  this.debitSum = this.payArray.reduce( (acc, obj)=> { return acc + +obj.debit; }, 0);
  this.creditSum = this.payArray.reduce( (acc, obj)=> { return acc + +obj.credit; }, 0);
  
}

 
}
