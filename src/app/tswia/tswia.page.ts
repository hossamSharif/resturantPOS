import { Component, OnInit, ViewChild, ElementRef ,Renderer2,Input} from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable, Subscription } from 'rxjs';
import { AlertController, IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe ,Location} from '@angular/common';
import { Storage } from '@ionic/storage';
import { AuthServiceService } from '../auth/auth-service.service';
import { PrintModalPage } from '../print-modal/print-modal.page';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../sales/pipe';
import { FilterPipe2 } from '../sales/pipe2';
import { FilterPipe3  } from '../sales/pipe3';
import { StockServiceService } from '../syncService/stock-service.service';
import * as momentObj from 'moment';

@Component({
  selector: 'app-tswia',
  templateUrl: './tswia.page.html',
  styleUrls: ['./tswia.page.scss'],
})
export class TswiaPage implements OnInit {
  @ViewChild("dst") nameField: ElementRef;
  @ViewChild('dstPop12') dstPop12;
  @ViewChild('qtyId12') qtyId12; 
  @ViewChild('popInput') popInput; 
  @ViewChild('popover') popover;
  @ViewChild('popoverNotif7') popoverNotif7;
  notifArr:Array<any> =[]
  showNotif = false
  LogHistoryLocalArr:Array<any> =[]
  logHistoryArr:Array<any>=[];
  isOpenNotif = false ;
  subiscribtionNotif:Subscription;
  newNotif = false ; 
  isOpen = false; 
  selectedItemSales29
  sub_account:Array<any> =[]
  sub_accountLocalSales:Array<any> =[]
  sub_accountSales:Array<any> =[]
  initialInvoices:Array<any> =[]
  items:Array<any> =[]
  itemsLocal:Array<any> =[]
  itemList:Array<any> =[]
  salesLocal:Array<any> =[]
  sales:Array<any> =[]
  purchLocal:Array<any> =[] 
  purchase:Array<any> =[]
  randomsNumber:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  sub_nameNew :any = ""
  discountPerc : any = 0
  selectedItem : {id:any ,pay_ref:any,item_name:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,parcode:any,qty:any,tot:any ,dateCreated:any,availQty:any,aliasEn:any,qtyReal:any};
  selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any ,cat_id:any,cat_name:any,phone:any,address:any,currentCustumerStatus:0};
  payInvo : {pay_id:any ,pay_ref:any ,store_id:any,tot_pr:any,pay_date:any,pay_time:any,user_id:any, yearId:any,payComment:any};
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
  
  // اي طريقة دفع ح يكون في حساب مقابل ليها مثلا الكاش ح يتورد في حساب الخزينة وبنكك في حساب بنك الخرطوم اما الشيك فحيكون بالاجل و ح ينزل في  سجل الشيكات ويتحول الي حساب المعين سواء كان اتورد في حساب بنكي او اتسحب كاش واتورد فيحساب الخزينة 
  constructor(private behavApi:StockServiceService ,private _location: Location, private route: ActivatedRoute,private renderer : Renderer2,private modalController: ModalController,private alertController: AlertController, private authenticationService: AuthServiceService,private storage: Storage,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) {
  this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_name:"",cat_id:"",phone:"",address:"",currentCustumerStatus:0};
   
    
    this.printArr.push({
      'payInvo': "",
      'itemList':"",
       'selectedAccount' :"",
        'sub_nameNew' : "",
         "userInfo" : "" ,
         "sub_balanse": 0,
         "balanceStatus": ""
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
      qtyReal:0
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
            this.getSubBalance()
          } else {
            //console.log('no updates')
            this.showNotif = false
          
            
          } 
          })
        }, 10000); 
    } 


    ngOnInit() {
     this.prepareOffline()
     if(this.status == 'new'){
      this.getAppInfo()  
     }else if(this.status == 'initial'){
      this.getAppInfoCase2() 
      this.radioVal2 = 0  
     }
     
    //  this.getStockItems() 
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
            }     element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
          });
          this.searchResult = this.items  
        }
      }); 
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

    didDissmis(){
      this.isOpen = false
      //console.log('dismissOver')
      this.setFocusOnInput('qtyId12')
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
        qtyReal:0
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
  });
    
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
            // this.prepareInvo()
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
    this.storage.get('STORE_INFO').then((response) => {
      if (response) {
        this.store_info = response
         //console.log(response)
         //console.log(this.store_info) 
         this.getItemLocalOff()
      
         this.prepareInvo()
      }
    }); 

    this.storage.get('initialInvoices').then((response) => {
      if (response) {
        this.initialInvoices = response 
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

      this.storage.get('year').then((response) => {
        if (response) {
          this.year = response 
        } 
      });
    }); 

    // this.storage.get('initialInvoices').then((response) => {
    //   this.getSalesAccount() 
    //   if (response) {
    //     this.initialInvoices = response  
    //   }
    // }); 

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
     // debitTot = +debitTot + +this.payInvo.changee
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
        this.payInvo ={pay_id:undefined ,pay_ref:0 ,store_id:"",tot_pr:0,pay_date:"",pay_time:"",user_id:"", yearId:this.year.id,payComment:""} ;
        this.discountPerc = 0
        let d = new Date
      // this.payInvo.pay_date  = d.getMonth().toString() + "/"+ d.getDay().toString()+ "/"+ d.getFullYear().toString() 
       this.payInvo.pay_date = this.datePipe.transform(d, 'yyyy-MM-dd')
       this.payInvo.pay_time = this.datePipe.transform(d, 'HH:mm:ss') 
       this.generateRandom()  
       this.payInvo.store_id =this.store_info.id
       this.payInvo.user_id = this.user_info.id
       this.payInvo.yearId = this.year.id
       //console.log( this.payInvo) 
       this.itemList = []
     //  this.getSalesAccount()  
      // this.setFocusOnInput('dst')
      // this.setFocusOnInput('dstPop')
  }
 
   setFocusOnInput(Input) {
     //console.log('setFocusOnInput')
     if (Input == 'dst') { 
      this.nameField.nativeElement.focus(); 
     } else if(Input == 'dstPop') {
      this.dstPop12.setFocus();
      this.isOpen = true;
      this.clear()
      this.searchResult = this.items
      setTimeout(() => {
          this.popInput.setFocus(); 
      }, 1500);
    
     }else if(Input == 'qtyId12') {
      this.qtyId12.setFocus();  
     }else if(Input == 'popInput'){
      this.popInput.setFocus();  
     }
   }

   isFocused(event){
    //console.log('dsdfsdf',event)
  }

  presentPopoverNotif(e?: Event) {
    //console.log('preent me', e)
     this.notifArr = []
     this.showNotif = false
     this.popoverNotif7.event = e;
     this.isOpenNotif = true;  
   }
  didDissmisNotif(){
    this.isOpenNotif = false
    //console.log('dismissOver') 
  }
  getItems() {
    if (this.offline == false) {
      this.api.getItems().subscribe(data => {
        //console.log(data)
        let res = data
        this.items = res['data']
      }, (err) => {
        //console.log(err);
      })
    } else {
      this.items = this.itemsLocal
    }
  }

 //Yaw
  getSalesAccount(){
    if (this.offline == false) {
    this.api.getSalesAccounts(this.store_info.id , this.year.id).subscribe(data =>{
       let res = data
       this.sub_account = res ['data']
       //console.log(this.sub_account)
       this.getSubBalance()
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
  qtyReal:0
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
    tot:fl[0]['perch_price'],
    availQty:fl[0]['availQty'],
    aliasEn:fl[0]['aliasEn'],
    qtyReal:fl[0]['qtyReal']
  }
  //console.log( this.selectedItem);
  this.setFocusOnInput('qtyId12')
  }else{
    this.presentToast('خطأ في اسم الصنف ', 'danger') 
    this.selectedItem.item_name =""
    this.selectedItem.item_desc =""
  }
  
  
}
generateRandom2(role):any{
  let da = new Date 
  //console.log(da)
  let randomsNumber = da.getMonth().toString() + da.getDay().toString() + da.getHours().toString()+ da.getMinutes().toString()+da.getSeconds().toString()+da.getMilliseconds().toString() + role
  return this.store_info.store_ref + randomsNumber 
}
qtyRealhange(ev){
  //console.log(ev);
  this.selectedItem.tot =  ((this.selectedItem.availQty - this.selectedItem.qtyReal)  * this.selectedItem.perch_price) 
}

pricehange(ev){
  //console.log(ev);
  this.selectedItem.tot =  ((this.selectedItem.availQty - this.selectedItem.qtyReal) * this.selectedItem.perch_price) 
}

payChange(ev){
  //console.log(ev); 
  // if(this.discountPerc>0){
  //   this.payInvo.discount = (+this.payInvo.tot_pr * +this.discountPerc/100).toFixed(2)
  // }
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

deleteItem(index){
//console.log( index); 
this.itemList.splice(index,1)
//console.log( this.itemList); 
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
  this.payInvo.tot_pr = sum.toFixed(2)
  
} 


refresh(para){
  if (para=='account') {
    this.getSalesAccount()
  } else {
   // this.getItems()
    this.getStockItems()
  }
  
}

addTolist() {
    if (this.selectedItem.item_name == "" || this.selectedItem.id == "" ) {
      this.presentToast('الرجاء اختيار الصنف وتحديد الكمية', 'danger')
    } else if(this.selectedItem.qtyReal == this.selectedItem.availQty ){
      this.presentToast(' الكميات متساوية , لا يمكن إضافة العنصر  ', 'danger')
    }   else {
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
        "yearId" :+this.year.id, 
        "item_id" : +this.selectedItem.id,
        "dateCreated" : r,
        "perch_price":this.selectedItem.perch_price,
        "availQty" : this.selectedItem.availQty,
        "qtyReal" : this.selectedItem.qtyReal
        })
      } else {
        //console.log(this.itemList);
        //console.log(fl[0].qtyReal);
        //console.log(+this.selectedItem.qtyReal);

        this.selectedItem.qtyReal = fl[0].qtyReal +this.selectedItem.qtyReal
        let index = this.itemList.map(e => e.item_name).indexOf(this.selectedItem.item_name);
       // this.itemList[index].qtyReal = +this.selectedItem.qtyReal
        this.itemList[index].tot =  ((this.selectedItem.availQty - this.selectedItem.qtyReal) * +this.selectedItem.perch_price)
        
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
        qtyReal:""
      } 
      this.getTotal()
      this.setFocusOnInput('dstPop12')
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

saveIntial(){ 
//   if(this.radioVal == 1){
//    this.payInvo.sub_name = this.sub_nameNew
//    this.payInvo.cust_id = null
//   }  
//   // check if the invoice is exist
//  if(this.initialInvoices.length > 0){ 
//   this.initialInvoices = this.initialInvoices.filter(x=>x['payInvo'].pay_ref != this.payInvo.pay_ref) 
//   }

//   this.initialInvoices.push({
//     "payInvo": this.payInvo,
//     "itemList": this.itemList
//   })
//   this.storage.set('initialInvoices', this.initialInvoices).then((response) => {
//     this.printArr = []
//     this.recalSubBalance()
//     this.printArr.push({
//       'payInvo': this.payInvo,
//       'itemList':this.itemList,
//       'selectedAccount' : this.selectedAccount,
//       'sub_nameNew' : this.sub_nameNew ,
//       "user_name" : this.user_info.full_name ,
//       "sub_balanse": this.selectedAccount.sub_balance,
//       "balanceStatus":  this.selectedAccount.currentCustumerStatus 
//     }) 
//       //console.log(this.printArr)
//       this.presentAlertConfirm()
//       this.presentToast('تم الحفظ بنجاح', 'success')
//       this.prepareInvo()
//       this.status = 'new'
//     });  
}


saveInvoInit() {
  // // if(this.radioVal == 1){
  // //   this.payInvo.sub_name = this.sub_nameNew
  // //   this.payInvo.cust_id = null
  // //  }  
  // this.api.saveSalesInvoInit(this.payInvo).subscribe(data => {
  //   //console.log(data)
  //   this.saveitemListinit()
  // }, (err) => {
  //   //console.log(err);
  //   this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري', 'danger')
  // })
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
    this.payInvo.pay_date = this.datePipe.transform(d, 'yyyy-MM-dd')
    //console.log('save testing', this.payInvo)
    if (this.validate() == true) {
      this.presentLoadingWithOptions('جاري حفظ البيانات ...') 
          if (this.offline == true) {
            this.saveInvoLocal()
          } else {
            this.saveInvo()
          } 
         }
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
  // if (this.selectedAccount.sub_name.length>0 && this.selectedAccount.id == null) {
  //  // this.selectedAccount.sub_name = this.payInvo.sub_name
  // } else {
  //   //console.log('slwcted from drop' ) 
  //     this.selectedAccount.sub_name = this.sub_nameNew
  //     this.payInvo.sub_name  =this.selectedAccount.sub_name
  // }
  //   this.selectedAccount.id=null  
  //   this.selectedAccount.ac_id = 1 
  //   this.selectedAccount.sub_type="debit"
  //   this.selectedAccount.sub_code=null
  //   this.selectedAccount.sub_balance="0"
  //   this.selectedAccount.cat_id = 1
  //   this.selectedAccount.cat_name = 'العملاء'
  //   this.selectedAccount.store_id=this.store_info.id  
}

saveSubAccount(){
  // //console.log('crea accoun')
  // this.preparenewaccount()
  // this.api.saveSubAccount(this.selectedAccount).subscribe(data => {
  // //console.log(data)
  // if (data['message'] != 'Post Not Created') {
  //   this.payInvo.cust_id =  data['message'] 

  //   //حالة الحساب موجود محلي والحفظ انلاين يسحب من المحلي ويضاف سsalesaccount   
  //   if(this.radioVal == 0 && this.selectedAccount.id == null && this.offline == false) {
  //     this.sub_accountLocalSales = this.sub_accountLocalSales.filter(x=>x.sub_name != this.selectedAccount.sub_name)
  //     //console.log('imhereeeeeeeeeeeeeeeeee')
  //     this.storage.set('sub_accountLocalSales', this.sub_accountLocalSales).then((response) => {
  //     //console.log('resoponse set', this.sub_accountLocalSales)
  //     this.selectedAccount.id = this.payInvo.cust_id
  //     this.sub_accountSales.push(this.selectedAccount)
  //     this.storage.set('sub_accountSales', this.sub_accountSales).then((response) => {

  //     })
  //    });
  //  }

   
  //   this.saveInvo()
  // } else {
  //    this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
  // } 
  //   }, (err) => {
  // //console.log(err);
  // this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
  //  },()=>{
  //  this.loadingController.dismiss()
  //  })
}
saveSubAccountInit(){

  // this.preparenewaccount()
  // this.api.saveSubAccount(this.selectedAccount).subscribe(data => {
  // //console.log(data)
  // if (data['message'] != 'Post Not Created') {
  //   this.payInvo.cust_id =  data['message'] 
  //   //console.log('crea accoun' ,  data['message'] )
  //   this.saveInvoInit()
  // } else {
  //    this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
  // } 
  //   }, (err) => {
  // //console.log(err);
  // this.presentToast('لم يتم انشاء حساب للعميل , خطا في الإتصال حاول مرة اخري' , 'danger')
  //  },()=>{
  //  this.loadingController.dismiss()
  //  })
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
    this.api.saveTswiaInvo(this.payInvo).subscribe(data => {
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
    this.printArr.push({
      'payInvo': this.payInvo,
      'itemList':this.itemList,
      'selectedAccount' : this.selectedAccount,
      'sub_nameNew' : this.sub_nameNew ,
      "user_name" : this.user_info.full_name,
      "sub_balanse": this.selectedAccount.sub_balance,
      "balanceStatus": this.selectedAccount.currentCustumerStatus
    }) 
    //console.log(this.printArr)
     // this.presentAlertConfirm()
      this.presentToast('تم الحفظ بنجاح', 'success')
  

       
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
      "balanceStatus":  this.selectedAccount.currentCustumerStatus
     
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


saveitemList(){  
  this.api.saveTswiaitemList(this.itemList).subscribe(data=>{ 
    //console.log(data) 
   //  this.recalSubBalance()
    //console.log(this.selectedAccount.currentCustumerStatus)  
    this.printArr = []
    this.printArr.push({
      'payInvo': this.payInvo,
      'itemList':this.itemList,
      'selectedAccount' : this.selectedAccount,
      'sub_nameNew' : this.sub_nameNew ,
      "user_name" : this.user_info.full_name ,
      "sub_balanse": this.selectedAccount.sub_balance,
      "balanceStatus":this.selectedAccount.currentCustumerStatus
    }) 
    //console.log('printinggg',this.printArr)
    let arr:Array<any> = []
  arr.push({
    "payInvo": this.payInvo,
    "itemList": this.itemList 
  })
    this.logHistoryArr.push(
      {
        "id":null,
        "logRef":this.generateRandom2('insert tswia'),
        "userId":this.user_info.id,
        "typee":'insert tswia',
        "datee": momentObj(new Date()).locale('en').format('YYYY-MM-DD HH:mm:ss'),
        "logStatus":0,
        "logToken":JSON.stringify(arr[0]),
        "yearId":this.year.id,
        "store_id":this.store_info.id
      }
      )
  //   this.sales.push({
  //    "payInvo": this.payInvo,
  //    "itemList": this.itemList 
  //  }) 
  //  this.storage.set('sales', this.sales).then((response) => {
  //  //console.log('sales', response) 
  //  }) 
  //  this.presentAlertConfirm() 
  this.performSync()  
    // this.presentToast('تم الحفظ بنجاح' , 'success')  
    // this.prepareInvo()
   
  }, (err) => {
    //console.log(err);
    this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
  }, () => {
    this.loadingController.dismiss()
  }
  )      
}

async  performSync(){
  await this.saveLogHistory()
  await this.getStockItems()
  }


deleteInitInvo(){

}


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
   
    this.presentToast('تم الحفظ بنجاح' , 'success')
    this.prepareInvo()
  
   }else{
     this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
   }
 }, (err) => {
   //console.log(err);
   this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
 }) 
}


async presentModal(printArr , page) { 
  this.recalSubBalance()
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