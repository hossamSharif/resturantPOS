import { Component, OnInit } from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable } from 'rxjs';
import { AlertController, IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ItemModalPage } from '../item-modal/item-modal.page';
import { Storage } from '@ionic/storage'; 
@Component({
  selector: 'app-account-tree',
  templateUrl: './account-tree.page.html',
  styleUrls: ['./account-tree.page.scss'],
})
export class AccountTreePage implements OnInit {

  account_category:Array<any> =[]
  sub_account:Array<any> =[]
  main_account:Array<any> =[]
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  selectedMainAccount : {ac_id:any ,actype_id:any,ac_name:any,ac_code:any,eng_name:any,ac_type:any};
  selectedAccount : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any,cat_id:any,cat_name:any};
  selectedCategory : {id:any ,cat_name:any};
  payInvo : {id:any ,ac_id:any,sub_name:any,sub_type:any,sub_code:any,sub_balance:any,store_id:any,cat_id:any,cat_name:any};
  status :any = 'save'
  
 
  
  constructor(private storage: Storage,private alertController: AlertController,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
    this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_id:"",cat_name:""};
  this.selectedCategory = {id:"" ,cat_name:""};
   
    this.payInvo = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:"",cat_id:"",cat_name:""};
  this.selectedMainAccount = {ac_id:"" ,actype_id:"",ac_name:"",ac_code:"",eng_name:"",ac_type:""};
   
    this.store_info = {id:"" ,store_ref:"" , store_name:"" , location :"" }
    this.getAppInfo()
   }

  ngOnInit() {
    
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

  pickAccount(ev){
    this.selectedCategory.cat_name = ""
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
      cat_id:fl[0]['cat_id'] ,
      cat_name:fl[0]['cat_name'] 
    }
    //console.log( this.selectedAccount);
     this.payInvo = this.selectedAccount
     this.status = 'edit'
     let flm = this.main_account.filter(x=>x.ac_id == +this.selectedAccount.ac_id)
     this.pickMainAccount(flm[0]['ac_name'],'fisrtLoad')
     let flmc = this.account_category.filter(x=>x.id == +this.selectedAccount.cat_id)
     this.pickAccountCategory(flmc[0]['cat_name'],'fisrtLoad')
  }else{
    this.presentToast(' خطأ في اسم الحساب ', 'danger')
  }
  }

  pickAccountCategory(ev,cat?){
    let evVal 
    if(cat){
     evVal = ev
    }else{
    evVal = ev.target.value
    }
    //console.log('evVal',evVal);

    
    let fl= this.account_category.filter(x=>x.cat_name == evVal)
    //console.log(fl);
    if (fl.length > 0) {
    this.selectedCategory = {
      id:fl[0]['id'],
      cat_name:fl[0]['cat_name'] 
    }
    this.selectedAccount.cat_id =  fl[0]['cat_id'] 
    this.selectedAccount.cat_name =  fl[0]['cat_name']
    this.payInvo.cat_id = this.selectedCategory.id 
    this.payInvo.cat_name = this.selectedCategory.cat_name 
  }else{
    this.presentToast(' خطأ في اسم التصنيف ', 'danger')   
  }
  }
  

  pickMainAccount(ev , cust?){
    let evVal 
    if(cust){
     evVal = ev
    }else{
    evVal = ev.target.value
    }
    //console.log('evVal',evVal); 
    let fl= this.main_account.filter(x=>x.ac_name == evVal)
    //console.log(fl);  
    if (fl.length > 0) {
    this.selectedMainAccount = {
      ac_id:fl[0]['ac_id'],
      ac_name:fl[0]['ac_name'],
      actype_id:fl[0]['actype_id'],
      ac_code:fl[0]['ac_code'],
      eng_name:fl[0]['eng_name'], 
      ac_type:fl[0]['ac_type'] 
    }
    //console.log( this.selectedMainAccount);
    this.payInvo.ac_id = this.selectedMainAccount.ac_id
    this.payInvo.sub_type = this.selectedMainAccount.ac_type
    this.payInvo.store_id = this.store_info.id
    

  //  this.setFocusOnInput()
  }else{
    this.presentToast('خطأ في اسم الحساب ', 'danger') 
   
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
       this.getAllAccount() 
     }
   });
 }


 prepareInvo(){ 
  this.selectedAccount = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id ,cat_id:"" ,cat_name:""};
  this.selectedCategory = {id:"" ,cat_name:""};
 
  this.payInvo = {id:"" ,ac_id:"",sub_name:"",sub_type:"",sub_code:"",sub_balance:"",store_id:this.store_info.id,cat_id:"",cat_name:""};
  this.selectedMainAccount = {ac_id:"" ,actype_id:"",ac_name:"",ac_code:"",eng_name:"",ac_type:""};
  this.status = 'save'
}


refresh(){
  this.presentLoadingWithOptions()
  this.prepareInvo()
}



 getAllAccount() {
  this.api.getAllAccounts(this.store_info.id,1).subscribe(data => {
    //console.log(data)
    let res = data
    this.sub_account = res['data'] 
    this.getMainAccount()
  }, (err) => {
    //console.log(err);
  })
 }

 getAccountCategory() {
  this.api.getAccountCategory(this.store_info.id).subscribe(data => {
    //console.log(data)
    let res = data
    this.account_category = res['data'] 
    //console.log(this.account_category)
  }, (err) => {
    //console.log(err);
  })
 }

 getMainAccount() {
  this.api.getMainAccounts().subscribe(data => {
    //console.log(data)
    let res = data
    this.main_account = res['data'] 
    this.getAccountCategory()
  }, (err) => {
    //console.log(err);
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

  save(){
    if (this.validate() == true) {
      this.presentLoadingWithOptions('جاري حفظ البيانات ...')
      let accountList : Array<any> = []
      accountList.push(this.payInvo)
    this.api.createMultiAccount(accountList).subscribe(data => {
      //console.log(data)
      if (data['message'] != 'Post Not Created') {
       this.prepareInvo()
       this.presentToast('تم الحفظ بنجاح' , "success")
       this.getAllAccount()
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
  }

  update(){
    if (this.validate() == true) {
      this.presentLoadingWithOptions('جاري حفظ البيانات ...')
    this.api.updateSubAccount(this.payInvo).subscribe(data => {
      //console.log(data)
      if (data['message'] != 'Post Not Created') {
       this.prepareInvo()
       this.presentToast('تم التعديل بنجاح' , "success")
       this.getAllAccount()
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
  }

  validate():boolean{
    let fl :any =[]
    if (this.sub_account) {
       fl = this.sub_account.filter(x=>x.sub_name == this.payInvo.sub_name )
       if(fl.length>0 && this.status != 'edit'){
        this.presentToast('تطابق في اسم الحساب مع حساب موجود مسبقا   ','danger') 
       }
    }
    if (this.payInvo.sub_name == "") {
      this.presentToast('الرجاء ادخال اسم الحساب ','danger')
      return false
    }else if( this.selectedMainAccount.ac_id == "" || this.selectedMainAccount.ac_name == "" ) {
      this.presentToast(' الرجاء اختيار الحساب الرئيسي','danger')
      return false
    } 
     else {
      return true
    }
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
             this.delete()
           
          }
        }
      ]
    });
  
    await alert.present();
  }

  delete(){ 
    this.presentLoadingWithOptions('جاري حذف البيانات ...')
   this.api.deleteSubAccont(this.payInvo.id).subscribe(data => {
     //console.log(data)
     if (data['message'] != 'Post Not Deleted') {
      this.presentToast('تم الحذف بنجاح' , 'success')
      this.prepareInvo()
      this.getAllAccount() 
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