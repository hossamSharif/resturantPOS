import { Component, OnInit,Input } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
 
import { ServicesService } from '../stockService/services.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-firstq-modal',
  templateUrl: './firstq-modal.page.html',
  styleUrls: ['./firstq-modal.page.scss'],
})
export class FirstqModalPage implements OnInit {
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File = null; // Variable to store file
  uploadedFiles
//@Input() item: any;
//@Input() status: any;
status = 'price'
segme
selectedItem : {id:any ,item_name:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,item_parcode:any};
segment :any ='xls'
store_info : {id:any , location :any ,store_name:any , store_ref:any }
user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
price : {payval:any,perchval:any ,type:any, status:any} 
constructor(private storage: Storage,private loadingController:LoadingController,private api:ServicesService,private modalController: ModalController,private toast :ToastController) {
  this.selectedItem = {id:"" ,item_name:"",pay_price:"",perch_price:"",item_unit:"",item_desc:"",item_parcode:""};   
  this.price = {payval:0,perchval:0 ,type: 'pay', status:'plus'}  
}
  ngOnInit() {
   // //console.log(this.item, this.status)
   // this.checkstatus()
   this.getAppInfo()
   }
 
   fileChange(element) {
     //console.log('file', element.target.files[0]['name']);
     this.uploadedFiles = element.target.files[0];
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
        //console.log('store_info',this.store_info) 
      
     }
   });
 }

    truncateItems(){
     this.presentLoadingWithOptions('uploading ...')
     this.api.truncateItems().subscribe((data) => {
     //console.log(' received is ', data);
     if (data['message'] != 'Post not delete') {
       this.upload()
     } else {
       this.presentToast("خطأ في الإتصال بالسيرفر")
     }
   },(error)=>{ 
     this.presentToast("خطأ في الإتصال بالسيرفر")
   }
   )
    }
 
    deleteByStore(){
      let da = new Date 
      //console.log(da)
      let fq_year = da.getFullYear().toString() 
      this.presentLoadingWithOptions('uploading ...')
      this.api.deleteFristq(this.store_info.id ,fq_year).subscribe((data) => {
      //console.log(' received is ', data);
      if (data['message'] != 'Post not delete') {
      this.upload()
      } else {
        this.presentToast("خطأ في الإتصال بالسيرفر" ,'danger')
        this.loadingController.dismiss()
      }
    },(error)=>{ 
      this.presentToast("خطأ في الإتصال بالسيرفر",'danger')
      this.loadingController.dismiss()
    }
    )
     }

   upload() {  
     let formData = new FormData();
     formData.append("avatar", this.uploadedFiles);
       // for(let i =0; i < this.uploadedFiles.length; i++){
       // formData.append("files", this.uploadedFiles[i], this.uploadedFiles[i]['name']);
       //   }
     
     //console.log(formData)
     this.api.uploadFq(formData).subscribe((response) => {
       //console.log('response received is ', response);
       this.loadingController.dismiss()
       this.presentToast('تم الحفظ بنجاح' , 'success')
     },(error)=>{ 
       this.presentToast("خطأ في الإتصال بالسيرفر",'danger')
       this.loadingController.dismiss()
     }
     )
   }
 
   async presentLoadingWithOptions(msg?) {
     const loading = await this.loadingController.create({
       spinner: 'bubbles',
       mode:'ios',
       // duration: 5000,
       message: msg,
       translucent: true,
      // cssClass: 'custom-class custom-loading',
       backdropDismiss: false
     });
     await loading.present();
   
     const { role, data } = await loading.onDidDismiss();
     //console.log('Loading dismissed with role:', role);
   }
 
   onChange(event) {
     this.file = event.target.files[0];
   }
 
 // OnClick of button Upload
   onUpload() {
       this.loading = !this.loading;
       //console.log(this.file);
       this.api.upload2(this.file).subscribe(
           (event: any) => {
               if (typeof (event) === 'object') {
 
                   // Short link via api response
                   this.shortLink = event.link;
 
                   this.loading = false; // Flag variable 
               }
           }
       );
   }
 
   segmentChanged(ev){
       //console.log(ev.target.value) 
    }
 
    //  checkstatus(){
    //    if ( this.status == 'edit') {
    //      this.selectedItem = {id:this.item.id ,item_name:this.item.item_name,pay_price:this.item.pay_price,perch_price:this.item.perch_price,item_unit:this.item.item_unit,item_desc:this.item.item_desc,item_parcode:this.item.item_parcode}; 
    //    } else  {   
    //    }  
    // }
 
  typeChange(ev){
   //console.log(ev.target.value) 
  }
 
  statusChange(ev){
   //console.log(ev.target.value)  
  }
 
   async save(){ 
     await this.modalController.dismiss(this.selectedItem , this.status);
   }
   
   async updatePrice(){ 
     await this.modalController.dismiss(this.price , this.status);
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
 
   validate():boolean{
     if (this.selectedItem.item_name == ""  || +this.selectedItem.perch_price == 0 || +this.selectedItem.pay_price == 0 ) {
       this.presentToast('الرجاء ادخال البيانات المطلوبة','danger')
       return false
     }  else {
       return true
     }
   }
 
   async closeModal() { 
     await this.modalController.dismiss();
   }

}
