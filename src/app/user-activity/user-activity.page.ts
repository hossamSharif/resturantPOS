import { DatePipe, Location } from '@angular/common';
import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ServicesService } from '../stockService/services.service';
import { Storage } from '@ionic/storage';
import { FilterPipe } from './pipe';
import { FilterPipe2 } from '../sales/pipe2';
import { FilterPipe3 } from '../sales/pipe3';
import { StockServiceService } from '../syncService/stock-service.service';
import * as momentObj from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.page.html',
  styleUrls: ['./user-activity.page.scss'],
})

export class UserActivityPage implements OnInit {
  searchTerm :any
  sub_accountSales:Array<any>=[];
  sub_accountPurch:Array<any>=[];
  searchResult:Array<any>=[];
  LogHistoryLocalArr:Array<any> =[]
  logHistoryArr:Array<any>=[];
  searchMode : boolean =     false
  isOpenNotif = false ;
  subiscribtionNotif:Subscription;
  loading:boolean = false
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any} 
  constructor(private behavApi:StockServiceService ,private _location: Location ,private alertController: AlertController,private route: ActivatedRoute, private rout : Router,private storage: Storage,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
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

   this.storage.get('year').then((response) => {
    if (response) {
      this.year = response 
    } 
  });


  this.storage.get('sub_accountPurch').then((response) => {
    if (response) {
      this.sub_accountPurch = response
       //console.log(this.sub_accountPurch)  
    }
  });
  this.storage.get('sub_accountSales').then((response) => {
    if (response) {
      this.sub_accountSales = response
       //console.log(this.sub_accountPurch)  
    }
  });
   this.storage.get('STORE_INFO').then((response) => {
    
     if (response) {
        this.store_info = response
        //console.log(response)
        //console.log(this.store_info) 
         this.getAllLogHistory()  
     }
   });
    
  this.storage.get('LogHistoryLocal').then((response) => {
    //console.log('LogHistoryLocal',this.LogHistoryLocalArr)  
    if (response) {
      this.LogHistoryLocalArr = response
    }   
   });  
  }

  getAllLogHistory(){
    this.loading = true
    this.api.getAllLogHistory(this.store_info.id,this.year.id).subscribe(data =>{
      //console.log(data)
      let res = data
      this.logHistoryArr = res['data']  
      this.prepareStep1New()
    }, (err) => {
    //console.log(err);
  } ,
    ()=>{
    this.loading = false
  }
  )  
 }

 prepareStep1New() {
  for (let index = 0; index < this.logHistoryArr.length; index++) {
    const element = this.logHistoryArr[index];
    // customers
      if (element.typee.includes('customer') == true) {
      if (element.typee == 'insert customer') {
        element.desc = "قام " + element.full_name + " - بإضافة عميل جديد" + JSON.parse(element.logToken).sub_name

      } else if (element.typee == 'update customer') {
        element.desc = "قام " + element.full_name + " - بتعديل البيانات الشخصية للعميل  " + JSON.parse(element.logToken).sub_name

      } else if (element.typee == 'delete customer') {
        element.desc = "قام " + element.full_name + " - بحذف العميل " + JSON.parse(element.logToken).sub_name

      }
      //  change logStatus to 1 to be egnoring when  run syncFunct()
      // element.logStatus = 1
    }

    // supplier
    if (element.typee.includes('supplier') == true) {


      if (element.typee == 'insert supplier') {
        element.desc = "قام " + element.full_name + " - بإضافة مورد جديد" + JSON.parse(element.logToken).sub_name

      } else if (element.typee == 'update supplier') {
        element.desc = "قام " + element.full_name + " - بتعديل البيانات الشخصية للمورد  " + JSON.parse(element.logToken).sub_name

      } else if (element.typee == 'delete supplier') {
        element.desc = "قام " + element.full_name + " - بحذف المورد " + JSON.parse(element.logToken).sub_name

      }
      //  change logStatus to 1 to be egnoring when  run syncFunct()
      // element.logStatus = 1


    }

    // firstq
    if (element.typee.includes('firstq') == true) {
      if (element.typee == 'insert firstq') {
        element.desc = "قام " + element.full_name + " - بإضافة كمية افتتاحية لصنف جديد" + JSON.parse(element.logToken).item_name
      } else if (element.typee == 'update firstq') {
        element.desc = "قام " + element.full_name + " - بتعديل الكمية افتتاحية الصنف  " + JSON.parse(element.logToken).item_name

      } else if (element.typee == 'delete firstq') {
        element.desc = "قام " + element.full_name + " - بحذف الكمية افتتاحية الصنف " + JSON.parse(element.logToken).item_name

      }
      //  change logStatus to 1 to be egnoring when  run syncFunct()
      // element.logStatus = 1

    }

    // item
    if (element.typee.includes('item') == true) {

      if (element.typee == 'insert item') {
        element.desc = "قام " + element.full_name + " - بإضافة صنف جديد" + JSON.parse(element.logToken).item_name

      } else if (element.typee == 'update item') {
        element.desc = "قام " + element.full_name + " - بتعديل بيانات الصنف  " + JSON.parse(element.logToken).item_name

      } else if (element.typee == 'delete item') {
        element.desc = "قام " + element.full_name + " - بحذف الصنف " + JSON.parse(element.logToken).item_name
      }
      //  change logStatus to 1 to be egnoring when  run syncFunct()
      // element.logStatus = 1 


      //push notif 
      //

    }

    // sales
    if (element.typee.includes('sales') == true) {
      let parseData = JSON.parse(element.logToken)
      //console.log(parseData)
      let id = parseData.payInvo.cust_id
      let fltsub_name = this.sub_accountSales.filter(x => +x.id == +id)
      //console.log(this.sub_accountSales, 'fltsub_name', fltsub_name, JSON.parse(element.logToken).payInvo.cust_id)

      if (element.typee == 'insert sales') {
        element.desc = "قام " + element.full_name + " - بإضافة فاتورة مبيعات " + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr

      } else if (element.typee == 'update sales') {
        element.desc = "قام " + element.full_name + " - بتعديل  فاتورة مبيعات  " + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr

      } else if (element.typee == 'delete sales') {
        element.desc = "قام " + element.full_name + " -بحذف فاتورة مبيعات  " + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr

      }
      //  change logStatus to 1 to be egnoring when  run syncFunct()
      // element.logStatus = 1 

    }

    // purchase
    if (element.typee.includes('purchase') == true) {
      let parseData = JSON.parse(element.logToken)
      //console.log(parseData)
      let id = parseData.payInvo.cust_id
      let fltsub_name = this.sub_accountSales.filter(x => +x.id == +id)
      if (element.typee == 'insert purchase') {
        element.desc = "قام " + element.full_name + " - بإضافة فاتورة مشتريات"  + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr
      } else if (element.typee == 'update purchase') {
        element.desc = "قام " + element.full_name + " - بتعديل  فاتورة مشتريات  " + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr
      } else if (element.typee == 'delete purchase') {
        element.desc = "قام " + element.full_name + " -بحذف فاتورة مشتريات  " + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr
      }
      //  change logStatus to 1 to be egnoring when  run syncFunct()
      // element.logStatus = 1
    }

    // journal
    if (element.typee.includes('journal') == true) {

      if (element.typee == 'insert journal') {
        element.desc = "قام " + element.full_name + " بإضافة  " + JSON.parse(element.logToken).j_type + " بتاريخ : " + JSON.parse(element.logToken).j_date + " - بقيمة: " + JSON.parse(element.logToken).j_pay + " " + JSON.parse(element.logToken).standard_details


      } else if (element.typee == 'update journal') {
        element.desc = "قام " + element.full_name + " بتعديل  " + JSON.parse(element.logToken).j_type + " بتاريخ : " + JSON.parse(element.logToken).j_date + " - بقيمة: " + JSON.parse(element.logToken).j_pay + " " + JSON.parse(element.logToken).standard_details


      } else if (element.typee == 'delete purchase') {
        element.desc = "قام " + element.full_name + " بحذف  " + JSON.parse(element.logToken).j_type + " بتاريخ : " + JSON.parse(element.logToken).j_date + " - بقيمة: " + JSON.parse(element.logToken).j_pay + " " + JSON.parse(element.logToken).standard_details

      }
      //  change logStatus to 1 to be egnoring when  run syncFunct()
      //  element.logStatus = 1
      // set to storage    
    }

    // tswia
    if (element.typee.includes('tswia') == true) {

      if (element.typee == 'insert tswia') {
        element.desc = "قام " + element.full_name + " بإضافة سجل تسوية جردية  " + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي التسوية : " + JSON.parse(element.logToken).payInvo.tot_pr


      } else if (element.typee == 'update tswia') {
        element.desc = "قام " + element.full_name + " بتعديل سجل تسوية جردية  " + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي التسوية : " + JSON.parse(element.logToken).payInvo.tot_pr


      } else if (element.typee == 'delete tswia') {
        element.desc = "قام " + element.full_name + " بحذف  " + " بتعديل سجل تسوية جردية  " + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي التسوية : " + JSON.parse(element.logToken).payInvo.tot_pr
      }
       

    }


  }
  
    
}
 

 searchItem(ev){ 
  this.searchMode = true
  const filterPipe = new FilterPipe;  
  let  fiteredArr :any
  fiteredArr = filterPipe.transform(this.logHistoryArr,ev.target.value); 
  this.searchResult = fiteredArr   
}


}
