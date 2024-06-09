import { Component, OnInit,Input } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
 
import { ServicesService } from '../stockService/services.service';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.page.html',
  styleUrls: ['./item-modal.page.scss'],
})
export class ItemModalPage implements OnInit {
  shortLink: string = "";
    loading: boolean = false; // Flag variable
    file: File = null; // Variable to store file
    uploadedFiles
  @Input() item: any;
  @Input() status: any;
  @Input() filterArrayOrign: any;
  @Input() filterArray: any;
  @Input() brandList: any;
  @Input() modelList: any;
  @Input() firstq: any;
  @Input() colSetting: any;
  segme
  selectedItem : {id:any ,item_name:any,model:any  ,part_no:any  ,min_qty:any ,brand:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,item_parcode:any,aliasEn:any};
  firstqObj : {id:any ,item_id:any , store_id:any , quantity :any ,	fq_year:any ,	pay_price:any ,	perch_price:any }
  colSettingpr : {id:any ,item_name:any ,model:any ,part_no:any  ,min_qty:any ,brand:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,item_parcode:any,profit:any,instock:any,total:any,lastSold:any,edit:any,delete:any,aliasEn:any};
 
  segment :any ='manual'
  price : {payval:any,perchval:any ,type:any, status:any} 
  constructor(private loadingController:LoadingController,private api:ServicesService,private modalController: ModalController,private toast :ToastController) {
    this.selectedItem = {id:"" ,item_name:"",model:"",part_no:""  ,min_qty:0 ,brand:"",pay_price:"",perch_price:"",item_unit:"",item_desc:"",item_parcode:"",aliasEn:""};   
    this.firstqObj = {id:"" ,item_id:"" , store_id:"" , quantity :0 ,	fq_year:"" ,	pay_price:"" ,	perch_price:"" }
    this.colSettingpr = {id:true ,item_name:true ,model:true ,part_no:true  ,min_qty:true ,brand:true,pay_price:true,perch_price:true,item_unit:true,item_desc:true,item_parcode:true,profit:true,instock:true,total:true,lastSold:true,edit:true,delete:true,aliasEn:true};
   
    this.price = {payval:0,perchval:0 ,type: 'pay', status:'plus'}  
  }

  ngOnInit() {
   //console.log(this.item, this.status)
   this.checkstatus()
  }

  fileChange(element) {
    //console.log('file', element.target.files[0]['name']);
    this.uploadedFiles = element.target.files[0];
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

  upload() {  
    let formData = new FormData();
    formData.append("avatar", this.uploadedFiles);
      // for(let i =0; i < this.uploadedFiles.length; i++){
      // formData.append("files", this.uploadedFiles[i], this.uploadedFiles[i]['name']);
      //   }
    
    //console.log(formData)
    this.api.uploadItems(formData).subscribe((response) => {
      //console.log('response received is ', response);
      this.loadingController.dismiss()
      this.presentToast('تم الحفظ بنجاح' , 'success')
    },(error)=>{ 
      this.presentToast("خطأ في الإتصال بالسيرفر")
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


 
 
  
 
  

   checkstatus(){
    if ( this.status == 'edit') { 
    this.selectedItem = {id:this.item.id ,item_name:this.item.item_name,model:this.item.model,part_no:this.item.part_no  ,min_qty:this.item.min_qty ,brand:this.item.brand,pay_price:this.item.pay_price,perch_price:this.item.perch_price,item_unit:this.item.item_unit,item_desc:this.item.item_desc,item_parcode:this.item.item_parcode, aliasEn:this.item.aliasEn }; 
    this.firstqObj = {id:this.firstq.id ,item_id:this.firstq.item_id,
      store_id:this.firstq.store_id,
      quantity:this.firstq.quantity  ,
      fq_year:this.firstq.fq_year ,
      pay_price:this.firstq.pay_price,perch_price:this.firstq.perch_price}; 
     
      } else if (this.status == 'settings'){  
        this.colSettingpr = {id: this.colSetting.id ,item_name:this.colSetting.item_name ,model:this.colSetting.model ,part_no:this.colSetting.part_no  ,min_qty:this.colSetting.min_qty ,brand:this.colSetting.brand,pay_price:this.colSetting.pay_price,perch_price:this.colSetting.perch_price,item_unit:this.colSetting.item_unit,item_desc:this.colSetting.item_desc,item_parcode:this.colSetting.item_parcode,profit:this.colSetting.profit,instock:this.colSetting.instock,total:this.colSetting.total,lastSold:this.colSetting.lastSold,edit:this.colSetting.edit,delete:this.colSetting.delete,aliasEn:this.colSetting.aliasEn};
      }  else if (this.status == 'filter'){  
         this.filterArray = this.filterArrayOrign
         //console.log(this.filterArray)
      }  
   }


 typeChange(ev){
  //console.log(ev.target.value) 
 }

 statusChange(ev){
  //console.log(ev.target.value)  
 }

  async save(){ 
  //  await this.modalController.dismiss(this.selectedItem , this.status);
    await this.modalController.dismiss([this.selectedItem ,this.firstqObj ], this.status );

  }

  async setColomns(){ 
    await this.modalController.dismiss(this.colSettingpr , this.status);
  }

brandChange(ev){
//console.log(ev.target.checked)

}

modelChange(ev){
  //console.log(ev.target.checked)

}

  async setFilter(){
    this.filterArray = this.filterArrayOrign
    let flt :Array<any> = []
    for (let index = 0; index < this.brandList.length; index++) {
      const element = this.brandList[index];
      if (element.selected == true) {
        let fltbre:Array<any>= [] 
        fltbre =   this.filterArray.filter(x=> x.brand == element.brand)
        if(fltbre.length>0){
          fltbre.forEach(element => {
            flt.push(element)
          });
        }

      } 
    }


    for (let index = 0; index < this.modelList.length; index++) {
      const element = this.modelList[index];
      if (element.selected == true) {
        let fltbre:Array<any>= [] 
        fltbre =   this.filterArray.filter(x=> x.model == element.model)
        if(fltbre.length>0){
          fltbre.forEach(element => {
            flt.push(element)
          });
        }
      }
    }
 this.filterArray = flt
    await this.modalController.dismiss([this.filterArrayOrign ,this.filterArray ,this.modelList , this.brandList ,'filter' ] , this.status);
 
  }

  async clearFilter(){
    this.modelList.forEach(element => {
      element.selected = false
    });

    this.brandList.forEach(element => {
      element.selected = false
    });
    this.filterArray = this.filterArrayOrign

    await this.modalController.dismiss([this.filterArrayOrign ,this.filterArray ,this.modelList , this.brandList ,'clear' ] , this.status);
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
