import { Component, OnInit, ViewChild, ElementRef ,Renderer2,Input} from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable, Subscription } from 'rxjs';
import { AlertController, Platform ,IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe ,Location} from '@angular/common';
import { Storage } from '@ionic/storage';
import { AuthServiceService } from '../auth/auth-service.service';
import { PrintModalPage } from '../print-modal/print-modal.page';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPipe } from '../sales/pipe';
import { FilterPipe2 } from '../sales/pipe2';
import { FilterPipe3  } from '../sales/pipe3';

import { StockServiceService } from '../syncService/stock-service.service';
import * as momentObj from 'moment';
import { DomSanitizer } from '@angular/platform-browser'; 
import { formatDate } from '@angular/common'; 
//import { toHex } from 'utils';

@Component({
  selector: 'app-pos-sales',
  templateUrl: './pos-sales.page.html',
  styleUrls: ['./pos-sales.page.scss'],
})
export class PosSalesPage implements OnInit {
  @ViewChild("dst") nameField: ElementRef;
  @ViewChild('dstPop') dstPop;
  @ViewChild('qtyId') qtyId; 
  @ViewChild('popInput') popInput; 
  @ViewChild('popover') popover;
  @ViewChild('popoverNotif') popoverNotif;
  isOpen = false; 
  isOpenNotif = false ;
  newNotif = false ; 
  sub_account:Array<any> =[]
  sub_accountLocalSales:Array<any> =[]
  sub_accountSales:Array<any> =[]
  initialInvoices:Array<any> =[]
  items:Array<any> =[]
  itemsLocal:Array<any> =[]
  itemList:Array<any> =[]
  salesLocal:Array<any> =[]
  sales:Array<any> =[]
  notifArr:Array<any> =[]
  LogHistoryLocalArr:Array<any> =[]
  purchLocal:Array<any> =[] 
  purchase:Array<any> =[]
  randomsNumber:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  sub_nameNew :any = ""
  discountPerc : any = 0
  selectedItem : {id:any ,pay_ref:any,item_name:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,parcode:any,qty:any,tot:any ,dateCreated:any,availQty:any,aliasEn:any,tax:any , disc:any};
  selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,cat_id:any,cat_name:any,phone:any,address:any,currentCustumerStatus:0};
  payInvo : {pay_id:any ,pay_ref:any ,store_id:any,tot_pr:any,pay:any,pay_date:any,pay_time:any,user_id:any,cust_id:any,pay_method:any,discount:any ,changee:any,sub_name:any,payComment:any,nextPay:any, yearId:any , companyId:any,taxTot:any,backed:any , recived:any};
  company : { id: any , phone: any, phone2  :any, address :any, logoUrl:any,engName:any,arName:any ,tradNo:any , vatNo:any};

  radioVal : any = 0
  radioVal2 : any = 0
  printMode :boolean = false
  printArr:Array<any> =[]
  offline: boolean = false;
  color :any ='dark'
  showMe = null
  status:any = 'new'
  searchLang :any = 0
  currentCustumerStatus :any
  searchTerm : any = ""
  aliasTerm :any =""
  searchResult :Array<any> =[]
  aliasResult :Array<any> =[]
  finalResult :Array<any> =[]
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
  loadingItems:boolean = false
  logHistoryArr:Array<any>=[];
  subiscribtionItem:Subscription
  subiscribtionNotif:Subscription
  showNotif = false
  device :any = "" 
  currenQty:any = 0
  firstQty:any = 0
  perchTotQty:any = 0
  payTotQty:any = 0
  perchTot :any = 0
  qtyReal:any = 0
  availQty :any = 0 
  brandList:Array<any> =[]
  filteredItems: Array<any> =[]
  taxAll : any = 0
  netTot : any = 0
  discTot : any = 0

 qrcodedata: string = null;

  constructor(private sanitizer : DomSanitizer,  private rout : Router ,private platform:Platform,private behavApi:StockServiceService ,private _location: Location, private route: ActivatedRoute,private renderer : Renderer2,private modalController: ModalController,private alertController: AlertController, private authenticationService: AuthServiceService,private storage: Storage,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) {
  this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_name:"",cat_id:"",phone:"",address:"",currentCustumerStatus:0};
    this.route.queryParams.subscribe(params => {
      //console.log(params.payInvo,'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
      if (params && params.payInvo) {
        this.status = 'initial'
        this.payInvo = JSON.parse(params.payInvo);
      //  this.payInvo.yearId = this.year.id
        if(this.payInvo.cust_id == null){
          this.radioVal =  1
          this.sub_nameNew = JSON.parse(params.sub_name)
        }else{
          this.selectedAccount.sub_name = JSON.parse(params.sub_name);
        }
        this.user_info = JSON.parse(params.user_info);
        this.store_info = JSON.parse(params.store_info);
        this.itemList = JSON.parse(params.itemList);
        //console.log('lksjda',this.payInvo, this.store_info,  this.user_info ,this.itemList ,this.selectedAccount.sub_name )
        this.discountPerc = ((+this.payInvo.discount /+this.payInvo.tot_pr) * 100 ).toFixed(2)
        this.prepareOffline()
        this.getAppInfoCase2()
      } 
    });
    
    this.printArr.push({
      'payInvo': "",
      'itemList':"",
       'selectedAccount' :"",
        'sub_nameNew' : "",
         "userInfo" : "" ,
         "sub_balanse": 0,
         "balanceStatus": "",
         "company": "" ,
         "qrcodedata": "" 
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
      availQty:0,
      aliasEn:"",
      tax:0 ,
      disc:0
    }
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


    segmentChanged(ev) {
      this.filteredItems = this.items.filter(item => item.brand === ev.detail.value);
    }

    ionViewDidLeave(){
      //console.log('ionViewWillLeave')
     
    //  this.subiscribtionNotif.unsubscribe()
     } 

    ionViewDidEnter(){
      setTimeout(() => {
        //check all changes in case notif arr >0 
        //  this.subiscribtionNotif = this.behavApi.currentNotif.subscribe(notif=>{
        //   //console.log('notif page currentNotif behavApiRespnse',notif) 
        //    if(notif.length == 0){
        //     this.notifArr = []
        //    }else{
        //     this.notifArr =  notif[0]  
        //    }

        //   if(this.notifArr.length> 0){ 
        //     this.showNotif = true
        //     this.itemsLocal = notif[1] 
        //     this.items =  this.itemsLocal
        //     this.searchResult = this.items
        //     this.sub_accountSales = notif[2] 
        //     //console.log(this.sub_accountLocalSales)  
        //     this.storage.get('LogHistoryLocal').then((response) => { 
        //       if (response) {
        //         this.LogHistoryLocalArr = response  
        //       } 
        //     });
        //     this.getSubBalance()
        //   } else {
        //     //console.log('no updates')
        //     this.showNotif = false
          
            
        //   } 
        //   })
        }, 10000); 
    } 

    // async presentAlertConfirmSync(type , flt) {
    //   let msg:string = ''
    //   msg = 'توجد تحديثات في الإصناف , هل تريد المزامنة؟'
    //   const alert = await this.alertController.create({
    //     cssClass: 'my-custom-class',
    //     header: 'تأكيد!',
    //     mode:'ios' ,
    //     message: msg,
    //     buttons: [
    //       {
    //         text: 'إلغاء',
    //         role: 'cancel',
    //         cssClass: 'secondary',
    //         id: 'cancel-button',
    //         handler: (blah) => {
    //           flt.forEach(element => {
    //             let indx = this.notifArr.findIndex(e=>e.logRef === element.logRef)
    //             //console.log ('founded in local ' , indx)
    //             if(indx!=-1){ 
    //               element.logStatus = 0
    //             }  
    //           });
    //           this.storage.set('LogHistoryLocal',flt).then((response) => {
         
    //           })  
    //         }
    //       }, {
    //         text: 'موافق',
    //         id: 'confirm-button',
    //         handler: () => {
    //         if(type == 'item'){
    //           this.getStockItems('sync item',flt) 
    //         }else if(type == 'customers'){
    //           this.getSalesAccount('sync both',flt)
    //         }else if(type == 'both'){
    //           this.bothItemAndAccount('sync both',flt)
    //         } 
    //         }
    //       }
    //     ]
    //   });
    //   await alert.present(); 
    //  }
 

    ngOnInit() {
      this.checkPlatform()
      if(this.device == 'mobile'){
         this.rout.navigate(['folder/sales-mob']);  
       } 
     this.prepareOffline()
     if(this.status == 'new'){
      this.getAppInfo()  
    // this.newLogic()
     }else if(this.status == 'initial'){
      this.getAppInfoCase2() 
      this.radioVal2 = 0  
     }
    // this.getStockItems()
    
    }

    presentPopover(e?: Event) {
     //console.log('preent me', e)
      this.popover.event = e;
      this.isOpen = true;
      this.clear()
      this.searchResult = this.items
      setTimeout(() => {
      this.setFocusOnInput('popInput')
      }, 2000);
    }

    presentPopoverNotif(e?: Event) {
      //console.log('preent me', e)
       this.notifArr = []
       this.showNotif = false
       this.popoverNotif.event = e;
       this.isOpenNotif = true;  
     }

    didDissmis(){
      this.isOpen = false
      //console.log('dismissOver')
      this.getItemPaysByItemId()
      this.setFocusOnInput('qtyId')
    }

    didDissmisNotif(){
      this.isOpenNotif = false
      //console.log('dismissOver') 
    }

    async bothItemAndAccount(status,flt){
      await this.getAllStockItemsWithouteCounts()
      await this.getSalesAccount(status,flt)
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
        availQty:0,
        aliasEn:"",
        tax:0 ,
        disc : 0
      }
     }else{
      this.searchTerm = "" 
     }
    }

    getStockItems() {
    this.storage.get('year').then((response) => {
     if (response) {
      this.year = response
      //console.log('this.year.id',this.year.id)
      if (this.offline == false) {
        this.loadingItems = true
        this.api.stockItems(1,this.year.id).subscribe(data => {
          console.log(data)
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
          this.searchResult = this.items
          this.loadingItems = false 
          this.storage.set('itemsLocal' , this.items).then((response) => {
             
          }); 
        }, (err) => {
          this.loadingItems = false
          //console.log(err);
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
        });
        this.searchResult = this.items
      }
      } 
    }); 
    }

    getBrands() {
      this.api.getBrands().subscribe(data => { 
        let res = data
        this.brandList = res['data'] 
        console.log(this.brandList) 
      this.filteredItems = this.items.filter(item => item.brand === this.brandList[0].brand);
       
      }, (err) => { 

      },
        () => {
         
        }
      ) 
      }


    getAllStockItemsWithouteCounts() {
      this.storage.get('year').then((response) => {
       if (response) {
        this.year = response
        //console.log('this.year.id',this.year.id)
        if (this.offline == false) {
          this.loadingItems = true
          this.api.getAllStockItemsWithouteCounts(1,this.year.id).subscribe(data => {
            //console.log(data)
            let res = data
            this.items = res['data']
            // this.items.forEach(element => {
            //   if(+element.tswiaQuantity > 0){
            //     element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 
    
            //   }else if(+element.tswiaQuantity < 0){
            //     element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
            //   } 
            //   element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
            // });
            // this.searchResult = this.items
            this.loadingItems = false 
            this.storage.set('itemsLocal' , this.items).then((response) => {
               
            }); 
             
           
          }, (err) => {
            this.loadingItems = false
            //console.log(err);
          },
            () => {
              this.loadingItems = false
            }
          )
        } else {
          this.items = this.itemsLocal
          // this.items.forEach(element => {
          //   if(+element.tswiaQuantity > 0){
          //     element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 
  
          //   }else if(+element.tswiaQuantity < 0){
          //     element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
          //   }
  
          //   element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
          // });
          this.searchResult = this.items
        }
        } 
    }); 
    }



  //    getStockItems() {
  //     if (this.offline == false) {
  //       this.api.stockItems2(1 , this.year.id).subscribe(data => {
  //         //console.log(data)
  //         let res = data
  //         this.items = res['data']
  //         this.sumStocksItems()
  //       }, (err) => {
  //         //console.log(err);
  //       },
  //         () => {
  //         }
  //       )
  //     } else {
  //       this.items = this.itemsLocal
  //       this.items.forEach(element => {
  //         element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
  //       });
  //       this.searchResult = this.items
  //     }
  //   }

  // sumStocksItems(){
  //   this.api.stockItems(1 , this.year.id).subscribe(data => {
  //     //console.log(data)
  //     let res = data
  //     let arr = res['data']
  //     for (let index = 0; index < this.items.length; index++) {
  //       const element = this.items[index];
  //       let flt = arr.filter(x=>x.id == element.id)
  //       if(flt.length>0){
  //         element.perchQuantity =  +element.perchQuantity + +flt[0].perchQuantity
  //        // element.firstQuantity =  +element.firstQuantity + +flt[0].firstQuantity
  //         element.salesQuantity =  +element.salesQuantity + +flt[0].salesQuantity
  //       }
  //     } 
  //     this.items.forEach(element => {
  //       element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
  //     });

  //      //remove 0 an - quntity
  //      // this.items = this.items.filter(x=> x.quantity > 0)
  //     this.searchResult = this.items
  //   }, (err) => {
  //     //console.log(err);
  //   },
  //     () => {
  //     }
  //   )
  // }

 afterSync(flt){
  //push flt to local after chanch the logStatus to 1
  flt.forEach(element => {
   if(this.LogHistoryLocalArr.some(e => e.logRef === element.logRef) == false) {
     this.LogHistoryLocalArr.push(element)
   }else{
    //get index of it and replace it with value from flt
    let index = this.LogHistoryLocalArr.findIndex(x => x.logRef === element.logRef);
    if(index != -1){
      this.LogHistoryLocalArr[index] = element
    }
   }
    
  });

 //set loghistory locally  
 //console.log ('finish ' ,  this.LogHistoryLocalArr)
  this.storage.set('LogHistoryLocal',this.LogHistoryLocalArr).then((response) => {
         
  }) 
 }

  async presentAlertConfirm(initial?) {
    let msg:string = 'هل تريد طباعة فاتورة ؟ '
    if(initial){
       msg   = 'هل تريد حذف السجل ؟ '
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'تأكيد!',
      mode:'ios' ,
      message: msg,
      buttons: [
        {
          text: 'إلغاء',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
          //console.log('Confirm Cancel: blah'); 
           this.prepareInvo()
           // this.back()
          }
        }, {
          text: 'موافق',
          id: 'confirm-button',
          handler: () => {
            if(initial){
            this.deleteSalesInvoInit()
            }else{
              this.presentModal(this.printArr , 'sales')
            } 
          }
        }
      ]
    });
  
    await alert.present();
  }

  Print(elem){ 
      this.printMode = true 
      var mywindow = window.open('', 'PRINT', 'height=400,width=600'); 
      mywindow.document.write('<html><head>'); 
      mywindow.document.write('<style type="text/css">')
      mywindow.document.write('.sumsDiv{border-style: solid;border-color: gray;border-width: .5px;} .flr{ display: block; float: right; } .show{ } .hide{width:0px;height:0px} .w45 {width:45%} .w50 {width:50%} .w100 {width:100%} td, th {border: 1px solid #dddddd;text-align: center;padding: 8px;} tr:nth-child(even) {background-color: #dddddd;} .table{text-align: center;width: 100%; margin: 12px;}.ion-margin{ margin: 10px; } .ion-margin-top{ margin-top: 10px; } .rtl {  direction: rtl; } .ion-text-center{ text-align: center; } .ion-text-end{ text-align: left; } .ion-text-start{ text-align: right; }')
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

  getOffliemode(){
    this.storage.get('offline').then((response) => {
        this.offline = response
        //console.log('mooooode',this.offline)
        if (this.offline == true) {
          this.color= 'dark'
        }else if(this.offline == false){
          this.color = 'primary'
        } else{
          this.SetOffliemode()
        }
    });
  }

  SetOffliemode(){
    this.storage.set('offline' , false).then((response) => {
        this.offline = response
        this.color = 'primary'
        
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
    this.storage.get('company').then((response) => {
      this.company = response[0] 
      console.log(this.company)
    })
    this.storage.get('STORE_INFO').then((response) => {
      if (response) {
        this.store_info = response
         //console.log(response)
         //console.log(this.store_info) 
         this.getItems()
        // this.getItemLocalOff()
        // this.getAccountOffline()
        //this.getSalesAccount()
        this.prepareInvo()
      }
    }); 
    this.storage.get('LogHistoryLocal').then((response) => {
      //console.log('LogHistoryLocal',this.LogHistoryLocalArr)  
      if (response) {
        this.LogHistoryLocalArr = response
      }   
    });
    this.storage.get('initialInvoices').then((response) => {
      if (response) {
        this.initialInvoices = response 
      }
    });  
    this.storage.get('LogHistoryLocal').then((response) => { 
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

    this.getBrands()

  }
  
  getAppInfoCase2(){  
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
      }  
    }); 
    this.storage.get('LogHistoryLocal').then((response) => {
      //console.log('LogHistoryLocal',this.LogHistoryLocalArr)  
      if (response) {
        this.LogHistoryLocalArr = response
      }   
    });
    // this.storage.get('initialInvoices').then((response) => {
    //   this.getSalesAccount() 
    //   if (response) {
    //     this.initialInvoices = response  
    //   }
    // }); 
   
    this.storage.get('searchLang').then((response) => {
      if (response) {
        this.searchLang = response
        //console.log('searchLang' ,this.searchLang) 
      }
    }); 
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
       this.getSubBalance()
    }
   }); 
  }

 // ne logic 
 async  newLogic(){
  //console.log('new logic')
    await this.getAppInfo() 
    await this.prepareInvo()
 }
 
 getItemLocalOff(){
  this.storage.get('itemsLocal').then((response) => {
    if (response) {
      this.itemsLocal = response 
       //console.log(this.itemsLocal)  
       this.items = this.itemsLocal
      //  this.items.forEach(element => {
      //   if(+element.tswiaQuantity > 0){
      //     element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 
      //   }else if(+element.tswiaQuantity < 0){
      //     element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
      //   }     element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
      // });
      this.searchResult = this.items  
    }
  }); 
 }

 getAccountOffline(){
  this.storage.get('sub_accountSales').then((response) => {
    if (response) {
      this.sub_account= response  
       //console.log(this.sub_accountLocalSales)  
       this.getSubBalance()
       this.addSubaccountLocal()
    }
  });
 }


 //end of new logic

  radioChange(ev){
    //console.log(ev.target.value) 
   }

  recalSubBalance(){
    // adding new change to subbalances
    this.sub_account.forEach(element => {
      element.sub_balance = 0 
      let debitTot = +element.changeeTot + +element.fromDebitTot
      let creditTot = +element.purchChangeeTot + +element.toCreditTot
      if(this.radioVal == 0  && this.selectedAccount.id == element.id){
        debitTot = +debitTot + +this.payInvo.changee
      }
    
      if (debitTot == creditTot) {
        element.sub_balance = 0
        element.currentCustumerStatus = ''
      }else if(debitTot > creditTot ){
        element.sub_balance = (+debitTot - +creditTot).toFixed(2)
        element.currentCustumerStatus = 'debit'
        if(+this.selectedAccount.id == +element.id){
          this.selectedAccount.sub_balance = element.sub_balance 
          this.selectedAccount.currentCustumerStatus = element.currentCustumerStatus 
          }
      }else if(creditTot > debitTot ){
        element.sub_balance = (+creditTot - +debitTot).toFixed(2)
        element.currentCustumerStatus = 'credit'
        if( +this.selectedAccount.id == +element.id){
          this.selectedAccount.sub_balance = element.sub_balance 
          this.selectedAccount.currentCustumerStatus = element.currentCustumerStatus
          }
      }
    });
    //console.log('recalSubBalance',this.sub_account)
  }

   getSubBalance(){
    // payTot' => $payTot ,
    //      'tot_prTot' => $tot_prTot ,
    //      'changeeTot' => $changeeTot ,
    //      'purchPayTot' => $purchPayTot ,
    //      'purchTot_prTot' => $purchTot_prTot ,
    //      'purchChangeeTot' => $purchChangeeTot ,
    // 'fromDebitTot' => $fromDebitTot ,
    // 'fromCreditTot' => $fromCreditTot ,
    //  'toDebitTot' => $toDebitTot ,
    // 'toCreditTot' => $toCreditTot   
    this.sub_account.forEach(element => {
      element.sub_balance = 0
      let debitTot = +element.changeeTot + +element.fromDebitTot
      let creditTot = +element.purchChangeeTot + +element.toCreditTot
      if (debitTot == creditTot) {
        element.sub_balance = 0
        this.currentCustumerStatus = ''
   
       }else if(debitTot > creditTot ){
        
         element.sub_balance = (+debitTot - +creditTot).toFixed(2)
        this.currentCustumerStatus = 'debit'
  
       }else if(creditTot > debitTot ){
         element.sub_balance = (+creditTot - +debitTot).toFixed(2)
        this.currentCustumerStatus = 'credit'
       }
    });
    //console.log('balances',this.sub_account)
   }

   radioChange2(ev ,form?){
    //console.log(ev.target.value)  
    //console.log(this.status) 
    if(form == 'from'){
      if(ev.target.value == 1 && this.status == 'initial'){  
        this.status = 'toFinal'
        this.payInvo.yearId = this.year.id
        if(this.itemList.length>0){
          this.itemList.forEach(element =>{
            element.yearId =this.year.id
          })
        }
        //console.log('convert invo to final',this.status)
      }else if(ev.target.value == 0 && this.status == 'toFinal'){ 
        this.status = 'initial'
        //console.log('from final to initial',this.status)
      }
    } 
   }

  prepareInvo(){  
        this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_id:"",cat_name:"",phone:"",address:"", currentCustumerStatus:0};
        this.sub_nameNew = ""
        this.radioVal = 0
        this.radioVal2 = 0
        this.payInvo ={pay_id:undefined ,pay_ref:0 ,store_id:"",tot_pr:0,pay:0,pay_date:"",pay_time:"",user_id:"",cust_id:null,pay_method:"",discount:0 ,changee:0,sub_name:"",payComment:"",nextPay:null, yearId:this.year.id , companyId:this.company.id,recived:0,taxTot:0,backed:0};
        this.discountPerc = 0
        let d = new Date
      // this.payInvo.pay_date  = d.getMonth().toString() + "/"+ d.getDay().toString()+ "/"+ d.getFullYear().toString() 
       this.payInvo.pay_date = this.datePipe.transform(d, 'yyyy-MM-dd')
       this.payInvo.pay_time = this.datePipe.transform(d, 'HH:mm:ss') 
       this.generateRandom()  
       this.payInvo.store_id =this.store_info.id
       this.payInvo.user_id = this.user_info.id
       this.payInvo.yearId = this.year.id
       //console.log(this.payInvo) 
       this.itemList = []
       this.getAccountOffline()
      // this.getSalesAccount()   
      // this.setFocusOnInput('dst')
      // this.setFocusOnInput('dstPop')
  }
 
   setFocusOnInput(Input) {
     //console.log('setFocusOnInput')
     if (Input == 'dst') { 
      this.nameField.nativeElement.focus(); 
     } else if(Input == 'dstPop') {
      this.dstPop.setFocus();
      this.isOpen = true;
      this.clear()
      this.searchResult = this.items
      setTimeout(() => {
          this.popInput.setFocus(); 
      }, 1500);
    
     }else if(Input == 'qtyId') {
      this.qtyId.setFocus();  
     }else if(Input == 'popInput'){
      this.popInput.setFocus();  
     }
   }

   isFocused(event){
    //console.log('dsdfsdf',event)
  }

   

  getItems() {
    if (this.offline == false) {
      this.api.getItems().subscribe(data => { 
        let res = data
        this.items = res['data']
        this.items.forEach(element => {
          this.sanitizer.bypassSecurityTrustResourceUrl(element['imgUrl']);
        });
           console.log(this.items)
      }, (err) => {
        //console.log(err);
      })
    } else {
      this.items = this.itemsLocal
    }
  }

 //Yaw
  getSalesAccount(status?,flt?){
    if (this.offline == false) {
    this.api.getSalesAccounts(this.store_info.id , this.year.id).subscribe(data =>{
       let res = data
       this.sub_account = res ['data']
       //console.log(this.sub_account)
       this.getSubBalance()
       this.addSubaccountLocal()
       if(status == 'sync both'){
        this.storage.set('sub_accountSales' , this.sub_account).then((response) => {
          if (response) { 
             
          }
         });
        this.afterSync(flt)
       }
       
     }, (err) => {
     //console.log(err);
   }) 
  }else{
    this.MixSubaccountSalesOffline()
   } 
  } 

  //  prepareCustSupl(){
  //   this.sub_account.forEach(element => {
  //     if(element.cat_id == 1){ 
      
         
  //         let tot_pr = element. 
  //         let discount =  element.
  //         let totAfterDiscout =   + tot_pr - +discount 
  //         let pay =  
  //         let balance = +totAfterDiscout - +pay
  //        // this.debitors = this.debitors + +balance
  //        if(+element.debit > 0){
  //         element.debit = +element.debit + +balance
  //         }else if(+element.debit == 0 && +element.credit == 0){
  //           element.debit = +element.debit + +balance
  //         }else if(+element.credit > 0){
  //           if(balance >= element.credit){
  //             element.debit = +balance - +element.credit
  //             element.credit = 0
  //           }else if(balance  <  element.credit){
  //             element.credit = +element.credit - +balance
  //             element.debit = 0
  //           }
  //         }
             
  //     } else if(element.cat_id == 2){
  //       let fltPurch : Array<any> = []
  //       fltPurch = this.purchase.filter(x=>x.cust_id == element.id)
  //       //console.log('fltPurch',fltPurch)
  //       if(fltPurch.length>0){
  //         let tot_pr =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.tot_pr; }, 0); 
  //         let discount =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.discount; }, 0);
  //         let totAfterDiscout =   + tot_pr - +discount 
  //         let pay =  fltPurch.reduce( (acc, obj)=> { return acc + +obj.pay; }, 0);
  //         let balance = +totAfterDiscout - +pay
  //        // this.creditors = this.creditors + +balance
  //        if(+element.credit > 0){
  //         element.credit = +element.credit + +balance
  //         }else if(+element.debit == 0 && +element.credit == 0){
  //           element.credit = +element.credit + +balance
  //         }else if(+element.debit > 0){
  //           if(balance >= element.debit){
  //             element.credit = +balance - +element.debit
  //             element.debit = 0
  //           }else if(balance  <  element.debit){
  //             element.debit = +element.debit - +balance
  //             element.credit = 0
  //           }
  //         }
          
  //       }
  //     } 
  //   });
  // }
   //Yaw
   addSubaccountLocal(){
    if (this.sub_account) {
      if (this.sub_accountLocalSales) {
        for (let i = 0; i < this.sub_accountLocalSales.length; i++) {
          const element = this.sub_accountLocalSales[i];
          this.sub_account.push(element)
        }
      }
    } else{
      if (this.sub_accountLocalSales) {
        this.sub_account = this.sub_accountLocalSales 
      }
    } 
    }
//Yaw
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

generateRandom():any{
  let da = new Date 
  //console.log(da)
  let randomsNumber = da.getMonth().toString() + da.getDay().toString() + da.getHours().toString()+ da.getMinutes().toString()+da.getSeconds().toString()+da.getMilliseconds().toString()
  this.payInvo.pay_ref = this.store_info.store_ref + randomsNumber
  //console.log(randomsNumber)
  //console.log(this.payInvo.pay_ref)  
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
    cat_name:fl[0]['cat_name'],
    phone:fl[0]['phone'],
    address:fl[0]['address'],
    currentCustumerStatus:fl[0]['currentCustumerStatus']
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
  tot:item.pay_price,
  availQty:item.quantity,
  aliasEn:item.aliasEn ,
  tax:item.tax,
  disc:0
} 
 this.searchTerm = item.item_name
  //console.log( this.selectedItem); 
  this.didDissmis()
  //perform calculate here so moataz can get the qty
}


getItemPaysByItemId(){  
  this.api.getItemQtyPaysByItemId(this.store_info.id ,this.selectedItem.id,this.year.id).subscribe(data =>{
     console.log('getItemPaysByItemId',data)
     let res = data
     if(res['message'] != 'No record Found'){
       this.payTotQty = res['data'][0].salesQuantity 
     }
       this.getQtyPurchByItemId() 
    
   }, (err) => {
   //console.log(err);
   this.presentToast('1خطا في الإتصال حاول مرة اخري' , 'danger')
  
 },
 ()=>{
 })  
 }

 getQtyPurchByItemId(){ 
  this.api.getQtyPurchByItemId(this.store_info.id ,this.selectedItem.id,this.year.id).subscribe(data =>{
     //console.log('purch',data)
     let res = data
     if(res['message'] != 'No record Found'){
       this.perchTotQty = res['data'][0].perchQuantity 
       this.firstQty =    res['data'][0].firstQuantity 
     } 
     this.getQtyTswiaByItemId() 
   }, (err) => {
   //console.log(err);
   this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
 },
 ()=>{
  
 })  
 }


 getQtyTswiaByItemId(){  
  this.api.getQtyTswiaByItemId(this.store_info.id ,this.selectedItem.id,this.year.id).subscribe(data =>{
     console.log('getQtyTswiaByItemId',data)
     let res = data
     if(res['message'] != 'No record Found'){
      this.availQty = res['data'][0].availQty   
      this.qtyReal = res['data'][0].qtyReal   
     } 
     this.getQtyTotalItemId()  
   }, (err) => {
   //console.log(err);
   this.presentToast('  خطا في الإتصال حاول مرة اخري' , 'danger')
 },
 ()=>{

 })  
 }

 getQtyTotalItemId(){  
  //console.log('perchTotQty',this.perchTotQty ,this.payTotQty )
  //تجميع الكيات السالبة وتحويلها لموجب لإضافتها للمشتريات
  if( (+this.availQty  - +this.qtyReal) < 0 ){ 
    this.perchTotQty = +this.perchTotQty +  Math.abs((+this.availQty  - +this.qtyReal))  
  }else if((+this.availQty  - +this.qtyReal) > 0 ){
    this.payTotQty = +this.payTotQty + (+this.availQty  - +this.qtyReal)  
  } 
  this.availQty = + this.perchTotQty  - +  this.payTotQty
  console.log(this.payTotQty , this.payTotQty)
} 



pickDetail(ev){ 
  let fl : Array<any>=[]
  if(this.searchLang == 1){
     fl= this.items.filter(x=>x.item_desc == ev.target.value)
    //console.log('hyrr',fl);
  } else {
     fl= this.items.filter(x=>x.item_name == ev.target.value)
    //console.log(fl);
  }
 

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
    qty:"",
    tot:fl[0]['pay_price'],
    availQty:fl[0]['quantity'],
    aliasEn:fl[0]['aliasEn'],
    tax:fl[0]['tax'] ,
    disc:fl[0]['disc'] 
  }
  //console.log( this.selectedItem);
  this.setFocusOnInput('qtyId')
  }else{
    this.presentToast('خطأ في اسم الصنف ', 'danger') 
    this.selectedItem.item_name =""
    this.selectedItem.item_desc =""
  } 
}

qtyhange(ev){
  //console.log(ev);
  this.selectedItem.tot =  (this.selectedItem.qty * +this.selectedItem.pay_price).toFixed(2)

  let fl : Array<any> = []
  if (this.itemList.length > 0) {
      fl = this.itemList.filter(x => x.item_name == this.selectedItem.item_name )
    if (fl.length> 0){
      //console.log(fl)
      if(+this.selectedItem.qty + +fl[0].quantity > +this.selectedItem.availQty){
        this.presentToast('الصنف موجود بالقائمة , مجموع الكمية الجديد اكبر من المتوفر في المخزن','warning')
       }
    }else{
      if(+this.selectedItem.qty > +this.selectedItem.availQty){
        this.presentToast('الكمية في المخزن غير كافية','warning')
       }
    }
  }else{
    if(+this.selectedItem.qty > +this.selectedItem.availQty){
      this.presentToast('الكمية في المخزن غير كافية','warning')
     }
  }

 
}

pricehange(ev){
  //console.log(ev);
  this.selectedItem.tot =  (this.selectedItem.qty * +this.selectedItem.pay_price).toFixed(2)
}

getTotal(){
  let sum = this.itemList.reduce( (acc, obj)=> { return acc + (+obj.quantity * +obj.pay_price); }, 0);
 // let sum = this.itemList.reduce( (acc, obj)=> { return acc + +(+obj.quntity * +obj.pay_price); }, 0);
  this.payInvo.taxTot = this.itemList.reduce((acc, obj)=> { return acc + (+obj.pay_price * (+obj.tax/100)); }, 0);
 // this.taxTot = this.itemList.reduce( (acc, obj)=> { return acc + (+obj.pay_price * (+obj.tax/100)); }, 0);
  console.log('sum', sum)
  
  //
  this.payInvo.tot_pr = +sum - +this.payInvo.discount

  this.taxAll = this.payInvo.tot_pr + +this.payInvo.taxTot
  

  this.payInvo.changee = +this.taxAll - +this.payInvo.pay
  
  

  this.payInvo.tot_pr = this.payInvo.tot_pr.toFixed(2)

  this.payInvo.changee = this.payInvo.changee.toFixed(2)
} 

payChange(ev){
  //console.log(ev); 
  // if(this.discountPerc>0){
  //   this.payInvo.discount = (+this.payInvo.tot_pr * +this.discountPerc/100).toFixed(2)
  // }
  this.payInvo.recived = ev.target.value
  this.payInvo.backed = +this.taxAll - ev.target.value 
  this.payInvo.changee = +this.taxAll - ev.target.value   

}

discountChange(ev){
  //console.log('discountChange' ,ev); 
 //this.discountPerc = ((+this.payInvo.discount /+this.payInvo.tot_pr) * 100 ).toFixed(2)
this.getTotal()
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
this.discountPerc=0
this.payInvo.discount=0 
this.netTot=0 
this.taxAll=0 
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




refresh(para){
  if (para=='account') {
    this.getSalesAccount()
  } else {
   // this.getItems()
    this.getAllStockItemsWithouteCounts()
  }
  
}

addTolist() {
    if (this.selectedItem.item_name == "" || this.selectedItem.id == "" || +this.selectedItem.qty == 0 ) {
      this.presentToast('الرجاء اختيار الصنف وتحديد الكمية', 'danger')
    }else {
      let fl: any = []
      if (this.itemList.length > 0) {
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
        "quantity" : +this.selectedItem.qty,
        "tot" :this.selectedItem.tot, 
        "store_id" :+this.store_info.id, 
        "yearId" :+this.year.id, 
        "item_id" : +this.selectedItem.id,
        "dateCreated" : r,
        "perch_price":this.selectedItem.perch_price ,
        "tax":this.selectedItem.tax ,
        "disc":this.selectedItem.disc 

        })
      } else {
        //console.log(this.itemList);
        //console.log(fl[0].quantity);
        //console.log(+this.selectedItem.qty);

        this.selectedItem.qty = +fl[0].quantity + +this.selectedItem.qty
        let index = this.itemList.map(e => e.item_name).indexOf(this.selectedItem.item_name);
        this.itemList[index].quantity = +this.selectedItem.qty
        this.itemList[index].tot =  (this.selectedItem.qty * +this.selectedItem.pay_price).toFixed(2)
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
        availQty:0,
        aliasEn:"",
        tax:0 ,
        disc : 0
      }
      this.discountPerc = 0
      this.payInvo.discount = 0 
      this.getTotal()
      this.setFocusOnInput('dstPop')
    }
   
  }

  addTolistClick(item) {
    this.selectedItem = item
    console.log(item)
    this.selectedItem = {
      id: item.id,
      dateCreated: "", 
      pay_ref:this.payInvo.pay_ref,
      item_desc: item.item_desc,
      item_name: item.item_name,
      item_unit: item.item_unit,
      parcode:item.parcode,
      pay_price: item.pay_price,
      perch_price: item.item_name,
      qty: 1,
      tot: +item.pay_price + (+item.tax/100 *  +item.pay_price)  ,
      availQty:0,
      aliasEn:+item.aliasEn ,
      tax:item.tax ,
      disc:item.disc  

    }

    // if (this.selectedItem.item_name == "" || this.selectedItem.id == "" || +this.selectedItem.qty == 0 ) {
    //   this.presentToast('الرجاء اختيار الصنف وتحديد الكمية', 'danger')
    // }else {
      let fl: any = []
      if (this.itemList.length > 0) {
        fl = this.itemList.filter(x => x.item_name == this.selectedItem.item_name &&  x.pay_price == this.selectedItem.pay_price)
      }

      if (fl.length == 0) {
        let d =   new Date
        let r= this.datePipe.transform(d, 'dd-MM-YYYY')
         this.selectedItem.qty =1
        this.itemList.push({
        "id" : 'NULL',
        "pay_ref" :this.selectedItem.pay_ref,
        "item_name" :this.selectedItem.item_name,
        "pay_price" :this.selectedItem.pay_price,
        "quantity" : +this.selectedItem.qty,
        "tot" :this.selectedItem.tot, 
        "store_id" :+this.store_info.id, 
        "yearId" :+this.year.id, 
        "item_id" : +this.selectedItem.id,
        "dateCreated" : r,
        "perch_price":this.selectedItem.perch_price,
        "tax":this.selectedItem.tax ,
        "disc":this.selectedItem.disc
        })
      } else {
        //console.log(this.itemList);
        //console.log(fl[0].quantity);
        //console.log(+this.selectedItem.qty);
        this.selectedItem.qty = 1
        this.selectedItem.qty = +fl[0].quantity + +this.selectedItem.qty
        let index = this.itemList.map(e => e.item_name).indexOf(this.selectedItem.item_name);
        this.itemList[index].quantity = +this.selectedItem.qty
        this.itemList[index].tot =  (this.selectedItem.qty * +this.selectedItem.pay_price).toFixed(2)
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
        availQty:0,
        aliasEn:"",
        tax:fl[0]['tax'] ,
        disc:fl[0]['disc'] 
      }
      this.discountPerc = 0
      this.payInvo.discount = 0 
      this.getTotal() 
  }



  qtyClick(i){
    //console.log(i)
    this.showMe = i
  }

  hideMe(i){
    this.showMe = null 
  }

  editCell(i){
    if(+this.itemList[i].quantity > 0 && +this.itemList[i].pay_price > 0){
      this.itemList[i].tot = +this.itemList[i].quantity * +this.itemList[i].pay_price
      this.discountPerc = 0
      this.payInvo.discount = 0
      this.hideMe(i)
      this.getTotal() 
    }else{
      this.presentToast("خطأ في الإدخال ", "danger")
    }
   
  }


validate():boolean{
  let fl :any =[]
  if (this.sub_account) {
     fl = this.sub_account.filter(x=>x.sub_name == this.sub_nameNew )
  //console.log(fl)
  }
  if (this.itemList.length == 0  || this.payInvo.pay_ref == "" ) {
    this.presentToast('الرجاء ادخال اصناف الي القائمة','danger')
    return false
  }
  else if(this.payInvo.pay_date == "" || this.payInvo.pay_date == undefined) {
    this.presentToast('الرجاء تحديد التاريخ ','danger')
    return false
  }else if(this.payInvo.changee < 0 ) {
    this.presentToast('الرجاء مراجعة المبلغ المستلم والخصم  ','danger')
    return false
  } else {
    return true
  }
}

saveIntial(){ 
  if(this.radioVal == 1){
   this.payInvo.sub_name = this.sub_nameNew
   this.payInvo.cust_id = null
  }  
  // check if the invoice is exist
 if(this.initialInvoices.length > 0){ 
  this.initialInvoices = this.initialInvoices.filter(x=>x['payInvo'].pay_ref != this.payInvo.pay_ref) 
  }

  this.initialInvoices.push({
    "payInvo": this.payInvo,
    "itemList": this.itemList
  })

  this.storage.set('initialInvoices', this.initialInvoices).then((response) => {
    this.printArr = []
    this.recalSubBalance()
    this.printArr.push({
      'payInvo': this.payInvo,
      'itemList':this.itemList,
      'selectedAccount' : this.selectedAccount,
      'sub_nameNew' : this.sub_nameNew ,
      "user_name" : this.user_info.full_name ,
      "sub_balanse": this.selectedAccount.sub_balance,
      "balanceStatus":  this.selectedAccount.currentCustumerStatus ,
      "company": this.company ,
      "qrcodedata":this.qrcodedata  
      
    }) 
      //console.log(this.printArr)
      this.presentAlertConfirm()
      this.presentToast('تم الحفظ بنجاح', 'success')
      this.prepareInvo()
      this.status = 'new'
    });  
}


saveInvoInit() {
  // if(this.radioVal == 1){
  //   this.payInvo.sub_name = this.sub_nameNew
  //   this.payInvo.cust_id = null
  //  }  
  this.api.saveSalesInvoInit(this.payInvo).subscribe(data => {
    //console.log(data)
    this.saveitemListinit()
  }, (err) => {
    //console.log(err);
    this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري', 'danger')
  })
}
 
deleteInitial(){
  if(this.initialInvoices.length > 0){ 
     this.initialInvoices = this.initialInvoices.filter(x=>x['payInvo'].pay_ref != this.payInvo.pay_ref) 
    } 
     this.storage.set('initialInvoices', this.initialInvoices).then((response) => { 
      this.presentToast('تم الحذف بنجاح' , 'success') 
      this.status = 'new'
      this.prepareInvo()
      });    
}


deleteSalesInvoInit(){ 
  if(this.status != 'toFinal'){
    this.presentLoadingWithOptions('جاري حذف البيانات ...') 
  } 
 
   this.api.deleteSalesInvoInit(this.payInvo.pay_id).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Deleted') {
   this.deleteSalesitemListInit()
   }else{
    this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
   }
 },(err) => {
   //console.log(err);
   this.presentToast('لم يتم حذف البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
  }) 
}


deleteSalesitemListInit(){  
  this.api.deleteSalesitemListInit(this.payInvo.pay_ref).subscribe(data => {
  //console.log(data)
  if (data['message'] != 'Post Not Deleted') { 
    if(this.status != 'toFinal'){
      this.presentToast('تم الحذف بنجاح' , 'success') 
     this.prepareInvo()
    } 
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

  save() {
    let d: Date = this.payInvo.pay_date
    this.payInvo.sub_name = this.selectedAccount.sub_name
    this.payInvo.pay_date = this.datePipe.transform(d, 'yyyy-MM-dd')
    //console.log('save testing', this.payInvo, this.payInvo.sub_name)
    if (this.validate() == true) {
      this.presentLoadingWithOptions('جاري حفظ البيانات ...')
      // initial invoice
      if (this.radioVal2 == 0 && this.radioVal == 0 && this.status== 'new') {
        //console.log('new initial')
        this.saveInvoInit()
      } else if (this.radioVal2 == 0 && this.radioVal == 1 && this.status== 'new') {
        // update initialInvoices
        //console.log('save sub account initial')
        this.saveSubAccountInit()
      }else if(this.radioVal2 == 0 && this.status== 'initial') {
        // update initialInvoices
        //console.log('update initial')
        this.updateInitInvo()
      } else {
        // حساب محفوظ اوننلاين وموجود في قائمة العملاء
        if (this.radioVal == 0 && this.selectedAccount.id != null) {
          if (this.offline == true) {
            this.saveInvoLocal()
          } else {
            this.saveInvo()
          }
        }
        // حساب محفوظ محلي وموجود في قائمة العملاء
        else if (this.radioVal == 0 && this.selectedAccount.id == null && this.selectedAccount.sub_name != "") {
          if (this.offline == true) {
            this.saveInvoLocal()
          } else {
            this.saveSubAccount()
          }
        }

        
        //حساب جديد
        else if (this.radioVal == 1) {
          //console.log(this.radioVal, 'saveSubAccountlocal()')
          if (this.offline == true) {
            //console.log('saveSubAccountlocal()')
            this.saveSubAccountlocal()
          } else {
            this.saveSubAccount()
          } 
        }
      }
    }
  }


  // prepareLogHistory(itemData , firstq , role){
  //   this.logHistoryArr = []
  //  let dt = new Date()
  //  let typee = "" 
  //    if(role == 'insert'){
  //      typee = "insert firstq"
  //        itemData.id = firstq.item_id
  //      this.logHistoryArr.push(
  //        {
  //          "id":this.firstq.id,
  //          "logRef":this.generateRandom(typee),
  //          "userId": this.user_info.id,
  //          "typee":typee,
  //          "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
  //          "logStatus":0,
  //          "logToken": JSON.stringify(firstq)  ,
  //          "yearId": this.year.id,
  //          "store_id" :this.store_info.id
  //        }
  //        )

  //        typee = "insert item"
  //        this.logHistoryArr.push(
  //          {
  //            "id":null,
  //            "logRef":this.generateRandom(typee),
  //            "userId":this.user_info.id,
  //            "typee":typee,
  //            "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
  //            "logStatus":0,
  //            "logToken":JSON.stringify(itemData)  ,
  //            "yearId":this.year.id,
  //            "store_id":this.store_info.id
  //          }
  //          )
  //    } else {
  //     // typee = "insert firstq"
  //      // firstq.item_id =  itemData.id 
  //      // this.logHistoryArr.push(
  //      //   {
  //      //     "id":this.firstq.id,
  //      //     "logRef":this.generateRandom(),
  //      //     "userId": this.user_info.id,
  //      //     "typee":typee,
  //      //     "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
  //      //     "logStatus":0,
  //      //     "logToken": JSON.stringify(firstq)  ,
  //      //     "yearId": this.year.id,
  //      //     "store_id" :this.store_info.id
  //      //   }
  //      //   )
  //      if(role == 'update' ){
  //        typee = "update item" 
  //      }else if(role == 'delete' ){
  //        typee = "delete item" 
  //      }
  //        this.logHistoryArr.push(
  //          {
  //            "id":null,
  //            "logRef":this.generateRandom(typee),
  //            "userId":this.user_info.id,
  //            "typee":typee,
  //            "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
  //            "logStatus":0,
  //            "logToken":JSON.stringify(itemData)  ,
  //            "yearId":this.year.id,
  //            "store_id":this.store_info.id
  //          }
  //          )
  //        }
  //      return this.logHistoryArr
  //    }


      saveLogHistory(){  
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
          this.logHistoryArr = []
          this.presentAlertConfirm() 
          this.presentToast('تم الحفظ بنجاح' , 'success')
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
  await this.getAllStockItemsWithouteCounts()
  }



  back(){
    this._location.back()
  }

  updateInitInvo(){
    this.api.updateInitSalesInvo(this.payInvo).subscribe(data => {
    //console.log(data)
     this.deleteSalesitemListInit4update()
      }, (err) => {
      //console.log(err);
      this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger').then(()=>{
        this.loadingController.dismiss()
      })
     })
  }


    deleteSalesitemListInit4update(){  
      this.api.deleteSalesitemListInit(this.payInvo.pay_ref).subscribe(data => {
      //console.log(data)
      if (data['message'] != 'Post Not Deleted') { 
        this.saveitemListinit()   
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


    preparenewaccount(){ 
      if (this.selectedAccount.sub_name.length>0 && this.selectedAccount.id == null) {
      // this.selectedAccount.sub_name = this.payInvo.sub_name
      } else {
        //console.log('slwcted from drop' ) 
          this.selectedAccount.sub_name = this.sub_nameNew
          this.payInvo.sub_name  =this.selectedAccount.sub_name
      }
        this.selectedAccount.id=null  
        this.selectedAccount.ac_id = 1 
        this.selectedAccount.sub_type="debit"
        this.selectedAccount.sub_code=null
        this.selectedAccount.sub_balance="0"
        this.selectedAccount.cat_id = 1
        this.selectedAccount.cat_name = 'العملاء'
        this.selectedAccount.store_id=this.store_info.id  
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
      this.sub_accountLocalSales = this.sub_accountLocalSales.filter(x=>x.sub_name != this.selectedAccount.sub_name)
      //console.log('imhereeeeeeeeeeeeeeeeee')
      this.storage.set('sub_accountLocalSales', this.sub_accountLocalSales).then((response) => {
      //console.log('resoponse set', this.sub_accountLocalSales)
      this.selectedAccount.id = this.payInvo.cust_id
      this.sub_accountSales.push(this.selectedAccount)
      this.storage.set('sub_accountSales', this.sub_accountSales).then((response) => {

      })
     });
    }
    
    this.selectedAccount.id = data['message'] 

    this.logHistoryArr.push(
      {
        "id":null,
        "logRef":this.generateRandom2('insert customer'),
        "userId":this.user_info.id,
        "typee":'insert customer',
        "datee": momentObj(new Date()).locale('en').format('YYYY-MM-DD HH:mm:ss'),
        "logStatus":0,
        "logToken":JSON.stringify(this.selectedAccount)  ,
        "yearId":this.year.id,
        "store_id":this.store_info.id
      }
    )
   
    this.saveInvo()
  } else {
     this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
  } 
    }, (err) => {
  //console.log(err);
  this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
   },()=>{
   this.loadingController.dismiss()
   })
}
saveSubAccountInit(){
  this.preparenewaccount()
  this.api.saveSubAccount(this.selectedAccount).subscribe(data => {
  //console.log(data)
  if (data['message'] != 'Post Not Created') {
    this.payInvo.cust_id =  data['message'] 
    //console.log('crea accoun' ,  data['message'] )
    this.saveInvoInit()
  } else {
     this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
  } 
    }, (err) => {
  //console.log(err);
  this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
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
  this.sub_accountLocalSales.push(
    this.selectedAccount
  )
  this.storage.set('sub_accountLocalSales', this.sub_accountLocalSales).then((response) => {
    //console.log('resoponse set', this.sub_accountLocalSales)
   // this.payInvo.cust_id =  data['message']
    this.saveInvoLocal()
  });
 }

  saveInvo() {
    this.api.saveSalesInvo(this.payInvo).subscribe(data => {
      //console.log(data)
      this.saveitemList()
    }, (err) => {
      //console.log(err);
      this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري', 'danger')
    })
  }

  saveInvoLocal() {
    this.salesLocal.push({
      "payInvo": this.payInvo,
      "itemList": this.itemList
    })
    this.storage.set('salesLocal', this.salesLocal).then((response) => {
      //console.log('resoponse set', response)
    this.printArr = []
    this.recalSubBalance()
    this.printArr.push({
      'payInvo': this.payInvo,
      'itemList':this.itemList,
      'selectedAccount' : this.selectedAccount,
      'sub_nameNew' : this.sub_nameNew ,
      "user_name" : this.user_info.full_name,
      "sub_balanse": this.selectedAccount.sub_balance,
      "balanceStatus": this.selectedAccount.currentCustumerStatus ,
      "company": this.company ,
      "qrcodedata":this.qrcodedata
    }) 
    //console.log(this.printArr)
      this.presentAlertConfirm()
      this.presentToast('تم الحفظ بنجاح', 'success')
      if(this.initialInvoices.length > 0){ 
        this.initialInvoices = this.initialInvoices.filter(x=>x['payInvo'].pay_ref != this.payInvo.pay_ref) 
        this.storage.set('initialInvoices', this.initialInvoices).then((response) => {
         
        });
      }
    });
  }

 saveitemListinit(){  
  this.api.saveSalesitemListInit(this.itemList).subscribe(data=>{ 
    //console.log(data) 
     this.recalSubBalance()
    //console.log(this.selectedAccount.currentCustumerStatus)  
    //console.log(this.printArr) 
    this.printArr = []
    this.recalSubBalance()
    this.printArr.push({
      'payInvo': this.payInvo,
      'itemList':this.itemList,
      'selectedAccount' : this.selectedAccount,
      'sub_nameNew' : this.sub_nameNew ,
      "user_name" : this.user_info.full_name ,
      "sub_balanse": this.selectedAccount.sub_balance,
      "balanceStatus":  this.selectedAccount.currentCustumerStatus,
      "company": this.company  ,
      "qrcodedata":this.qrcodedata
    }) 
      //console.log(this.printArr)
      this.presentAlertConfirm()
      this.presentToast('تم الحفظ بنجاح', 'success')
      this.prepareInvo()
      this.status = 'new'
  }, (err) => {
    //console.log(err);
    this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
  }, () => {
    this.loadingController.dismiss()
  }
  )      
}

async saveitemList(){  
  this.api.saveSalesitemList(this.itemList).subscribe(data=>{ 
    //console.log(data) 
     this.recalSubBalance()
    //console.log(this.selectedAccount.currentCustumerStatus) 
    this.printArr = []
    this.printArr.push({
      'payInvo': this.payInvo,
      'itemList':this.itemList,
      'selectedAccount' : this.selectedAccount,
      'sub_nameNew' : this.sub_nameNew ,
      "user_name" : this.user_info.full_name ,
      "sub_balanse": this.selectedAccount.sub_balance,
      "balanceStatus":this.selectedAccount.currentCustumerStatus,
      "company": this.company ,
      "qrcodedata":this.qrcodedata
    }) 

    //console.log('printinggg',this.printArr)
    this.sales = this.sales.filter(item => item.payInvo.pay_ref != this.payInvo.pay_ref);
    //console.log(' case ffff ' ,this.sales)

    this.sales.push({
     "payInvo": this.payInvo,
     "itemList": this.itemList 
    }) 
  let arr:Array<any> = []
  arr.push({
    "payInvo": this.payInvo,
    "itemList": this.itemList 
  })
    this.logHistoryArr.push(
      {
        "id":null,
        "logRef":this.generateRandom2('insert sales'),
        "userId":this.user_info.id,
        "typee":'insert sales',
        "datee": momentObj(new Date()).locale('en').format('YYYY-MM-DD HH:mm:ss'),
        "logStatus":0,
        "logToken":JSON.stringify(arr[0]),
        "yearId":this.year.id,
        "store_id":this.store_info.id
      }
      )

      // this.storage.set('sales', this.sales).then((response) => {
      // //console.log('sales', response) 
      // })

      if (this.status == 'toFinal') {
        this.deleteSalesInvoInit()
      }
   
    // //console.log(this.printArr)
    // if(this.initialInvoices.length > 0){ 
    //   this.initialInvoices = this.initialInvoices.filter(x=>x['payInvo'].pay_ref != this.payInvo.pay_ref) 
    //   this.storage.set('initialInvoices', this.initialInvoices).then((response) => {
    //     //console.log(this.initialInvoices , 'initialInvoices')
    //   });
    // }
    
     
  this.performSync()    
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

deleteInitInvo(){

}

prepareQrcode(){
  const isoDate = formatDate(this.payInvo.pay_date, 'yyyy-MM-dd', 'en-US');

// Convert time to ISO format 
const isoTime = this.payInvo.pay_time  + 'Z';
// Concatenate date and time
const isoDateTime = isoDate + 'T' + isoTime;
console.log(isoDateTime); // 2022-02-10T10:30:00Z
 
const companyNameHex = this.stringToHex(this.company.engName);
const companyNameTag = "01"  
let companyNameLengthHex = this.toHex((this.company.engName.length).toFixed(0));
if (companyNameLengthHex.length == 1) { 
  companyNameLengthHex = "0" + companyNameLengthHex; 
}
const companyInitial = companyNameTag + companyNameLengthHex + companyNameHex
console.log("company" ,companyNameHex ,companyNameLengthHex , companyInitial)

const companyVatHex =  this.stringToHex(this.company.vatNo.toString());
const companyVatTag = "02"
let companyVatLengthHex = this.toHex((this.company.vatNo.toString().length).toFixed(0));
if (companyVatLengthHex.length == 1) {
  companyVatLengthHex = "0" + companyVatLengthHex; 
}
const companyVatIntial = companyVatTag + companyVatLengthHex + companyVatHex
console.log("companyVat" ,companyVatHex ,companyVatLengthHex , companyVatIntial)

const dateTimeHex = this.stringToHex(isoDateTime.toString()); 
const dateTimeTag = "03"
let dateTimeLengthHex = this.toHex((isoDateTime.toString().length).toFixed(0));
if (dateTimeLengthHex.length == 1) {
  dateTimeLengthHex = "0" + dateTimeLengthHex; 
}
const dateTimeInitial = dateTimeTag + dateTimeLengthHex + dateTimeHex
console.log("dateTime" ,dateTimeHex ,dateTimeLengthHex , dateTimeInitial)

const totalHex = this.stringToHex((this.taxAll.toFixed(2)).toString());
const totalTag = "04"
let totalLengthHex = this.toHex(((this.taxAll.toFixed(2)).toString().length).toFixed(0));
if (totalLengthHex.length == 1) {
  totalLengthHex = "0" + totalLengthHex; 
}
const totalIntial = totalTag + totalLengthHex + totalHex
console.log("total" ,totalHex ,totalLengthHex , totalIntial)

const taxHex = this.stringToHex((this.payInvo.taxTot.toFixed(2)).toString());
const taxTag = "05"
let taxLengthHex = this.toHex(((this.payInvo.taxTot.toFixed(2)).toString().length).toFixed(0));
if (taxLengthHex.length == 1) {
  taxLengthHex = "0" + taxLengthHex; 
}
const  taxInitial = taxTag + taxLengthHex + taxHex
console.log("tax" ,taxHex ,taxLengthHex , taxInitial )
// // QR code data 
// const qrData = {
//   companyName: 'My Company',
//   vatNo: '987654321',
//   dateTime: '2022-02-10T10:30:00Z',
//   total: 99.99 
// };

// Convert object to JSON string
// const qrJson = JSON.stringify(qrData);

// Encode JSON to Base64
const qrBase64 = btoa(companyInitial+companyVatIntial+dateTimeInitial+totalIntial+taxInitial);
this.qrcodedata = qrBase64
this.printArr[0].qrcodedata = this.qrcodedata
console.log(this.qrcodedata); 
}

 stringToHex(str) {
  let hex = ''; 
  for(let i = 0; i < str.length; i++) {
    hex += this.toHex(str.charCodeAt(i)); 
  } 
  return hex;
}

toHex(num) {
  return parseInt(num, 10).toString(16);
}


async presentModal(printArr , page) { 
 this.recalSubBalance()
 this.prepareQrcode()
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



}
