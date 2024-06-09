import { Component, HostListener, OnInit,ViewChild ,ElementRef} from '@angular/core';
import { ServicesService } from "../stockService/services.service";
import { Observable, Subscription } from 'rxjs';
import { AlertController, IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ItemModalPage } from '../item-modal/item-modal.page';
import { Storage } from '@ionic/storage';
import * as XLSX from 'xlsx'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as momentObj from 'moment';
import { StockServiceService } from '../syncService/stock-service.service';
import domtoimage from 'dom-to-image';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit { 
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.hideMe('3')
}  

@ViewChild('popoverNotif33') popoverNotif33;
isOpen = false; 
subiscribtionItem:Subscription
subiscribtionNotif:Subscription
 
notifArr:Array<any> =[]
showNotif = false
LogHistoryLocalArr:Array<any> =[]
logHistoryArr:Array<any>=[];
isOpenNotif = false ; 
newNotif = false ; 
sortStatus:Array<any> =[]
items:Array<any> =[]
  searcResult:Array<any> =[]
  searchMode :boolean = false
  searchTerm :any
  selectedItem : {id:any ,item_name:any ,model:any ,part_no:any  ,min_qty:any ,brand:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,item_parcode:any,aliasEn:any};
  firstq : {id:any ,item_id:any , store_id:any , quantity :any ,	fq_year:any ,	pay_price:any ,	perch_price:any }
 
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any}
  itemSstock : {id:any ,item_id:any , store_id:any , quantity :any }
  store_tot :any = 0
  store_fltTot :any = 0
  loading:boolean = false
  partnoFilterArray:Array<any>;
  filterArrayOrign:Array<any>;
  sortingArrayOrign:Array<any>;
  filterArray:Array<any>;
  brandFilterArray:Array<any>;
  brandList:Array<any>=[];
  modelList:Array<any> =[];
  itemsLocal : Array<any> = [] ;
  showMe = null
  filterMode :boolean = false
  exportMode :boolean = false
  showBrand:boolean = false
  showMdel:boolean = false
  selectedItem2 : {id:any ,item_name:any ,model:any ,part_no:any  ,min_qty:any ,brand:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,item_parcode:any,aliasEn:any};
  colSetting : {id:any ,item_name:any ,model:any ,part_no:any  ,min_qty:any ,brand:any,pay_price:any,perch_price:any,item_unit:any,item_desc:any,item_parcode:any,profit:any,instock:any,total:any,lastSold:any,edit:any,delete:any,aliasEn:any};
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
  
  logHistoryObj : {id:any,	logRef:any,	userId:any,	typee:any,	datee:any,	logStatus:any,	logToken:any,	yearId:any,	store_id:any}
  fileName= 'items.xlsx'; 
  @ViewChild('exceltable') exceltable !: ElementRef; 

  
  constructor(private file: File, private fileOpener: FileOpener,private behavApi:StockServiceService,private storage: Storage,private alertController: AlertController,private modalController: ModalController,private loadingController:LoadingController, private datePipe:DatePipe,private api:ServicesService,private toast :ToastController) { 
    this.store_info = {id:"" ,store_ref:"" , store_name:"" , location :"" }
    this.selectedItem2 = {id:null ,item_name:"" ,model:"" ,part_no:""  ,min_qty:0 ,brand:"",pay_price:0,perch_price:0,item_unit:"",item_desc:"",item_parcode:"",aliasEn:""};
    this.colSetting = {id:true ,item_name:true ,model:true ,part_no:true  ,min_qty:true ,brand:true,pay_price:true,perch_price:true,item_unit:true,item_desc:true,item_parcode:true,profit:true,instock:true,total:true,lastSold:true,edit:true,delete:true,aliasEn:true};
    this.getAppInfo()
  }
 
    async presentModal(id?, status?) {
      if (id !='null' && status == 'edit') {
         let fl= this.items.filter(x=>x.id == id)
      //console.log(fl);
      this.selectedItem = {
        id:fl[0]['id'],
        item_desc:fl[0]['item_desc'],
        model:fl[0]['model'],
        item_name:fl[0]['item_name'],
        min_qty:fl[0]['min_qty'],
        part_no:fl[0]['part_no'],
        brand:fl[0]['brand'],
        item_unit:fl[0]['item_unit'],
        item_parcode:fl[0]['item_parcode'],
        pay_price:fl[0]['pay_price'],
        perch_price:fl[0]['perch_price'],
        aliasEn:fl[0]['aliasEn']
      }   
      }
     
      
      const modal = await this.modalController.create({
        component: ItemModalPage ,
        componentProps: {
          "item": this.selectedItem,
          "colSetting": this.colSetting, 
          "filterArrayOrign": this.filterArrayOrign, 
          "filterArray": this.filterArray, 
          "brandList": this.brandList, 
          "modelList": this.modelList,  
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


    didDissmis(){
      this.isOpenNotif = false
      //console.log('dismissOver')
      
    }

    presentPopover(e?: Event) {
      //console.log('preent me', e)
       this.popoverNotif33.event = e;
       this.isOpenNotif = true;  
       this.showNotif = false
     }
   
    prClick(i , item){
      //console.log(i)
      this.showMe = i
      this.selectedItem2 = {id:item.id ,item_name:item.item_name ,model:item.model ,part_no:item.part_no  ,min_qty:item.min_qty ,brand:item.brand,pay_price:item.pay_price,perch_price:item.perch_price,item_unit:item.item_unit,item_desc:item.item_desc,item_parcode:item.item_parcode,aliasEn:item.aliasEn};
    
    }
  
    hideMe(i){
      this.showMe = null 
     this.selectedItem2 = {id: null ,item_name:"" ,model:"" ,part_no:""  ,min_qty:0 ,brand:"",pay_price:0,perch_price:0,item_unit:"",item_desc:"",item_parcode:"",aliasEn:""};

    }
 

    update(mdata){ 
       this.presentLoadingWithOptions('جاري تعديل البيانات ...')
       this.api.updateItem(mdata[0]).subscribe(data => {
       //console.log(data)
       if (data['message'] != 'Post Not Updated') {
        this.presentToast('تم التعديل بنجاح' , 'success')
          this.saveLogHistory(mdata[0] , undefined ,'update') 

         //   this.getStockItems() 
         
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

  


  doit(){
    //console.log('hi man ')
  }
  
    editCell(i , item){
      this.presentLoadingWithOptions('جاري تعديل البيانات ...')
      let fl = this.items.filter(x=>x.id == item.id)
      if(this.selectedItem2.perch_price > 0 && this.selectedItem2.pay_price > 0 && this.selectedItem2.item_name != ""){
        //console.log(this,this.selectedItem2)
        this.api.updateItem(this.selectedItem2).subscribe(data => {
          //console.log(data)
          let res = data 
          if (data['message'] != 'Post Not Updated') {
            for (let index = 0; index < this.items.length; index++) {
              const element = this.items[index];
              if (element.id == item.id) {
                element.perch_price = this.selectedItem2.perch_price
                element.pay_price = this.selectedItem2.pay_price
                element.brand = this.selectedItem2.brand
                element.item_desc = this.selectedItem2.item_desc 
                element.item_name = this.selectedItem2.item_name 
                element.item_parcode = this.selectedItem2.item_parcode 
                element.model = this.selectedItem2.model 
                element.part_no = this.selectedItem2.part_no 
                element.item_unit = this.selectedItem2.item_unit 
                element.aliasEn = this.selectedItem2.aliasEn 
              } 
            } 
            this.saveLogHistory(item ,  undefined , 'update')
            //console.log('update' , item)
            this.loadingController.dismiss()
            this.presentToast('تم التعديل بنجاح' , 'success')
           
          }else{ 
            this.presentToast('لم يتم  تعديل البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
            
            this.loadingController.dismiss()
          }
          this.hideMe(i)
        }, (err) => {
        //console.log(err);
        this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
      } ,
        ()=>{
        this.hideMe(i)
        this.loadingController.dismiss()
      }
      )   
      }else{
        this.presentToast("خطأ في الإدخال ", "danger")
      }
     
    }

    doAfterDissmiss(data){
      if (data.role == 'edit' ) {
        //console.log('edit' ,data.data)
         this.update(data.data)
      } else if(data.role == 'save') {
        //console.log('save')
        this.save(data.data )  
      }else if(data.role == 'dele') {
        //console.log('dele') 
         this.delete()   
      }else if(data.role == 'price' && data.data.status == 'plus') {
        //console.log('plus') 
        this.incresePrice(data.data) 
      }else if(data.role == 'price' && data.data.status == 'minus') {
        //console.log('plus') 
        this.decreasePrice(data.data) 
      } else if(data.role == 'settings' ) {
        //console.log('settings' , data.data) 
        this.setColSetting(data.data)
     //   this.decreasePrice(data.data) 
      } 
      else if(data.role == 'filter' ) {
        if(data.data[4] == 'filter'){
          //console.log('filter' , data.data) 
          this.applyFilter(data.data)
          this.filterArray = data.data[1]
          this.store_fltTot =  data.data[1].reduce( (acc, obj)=> { return acc + (+obj.perch_price * +obj.quantity ); }, 0);
        }else if(data.data[4] == 'clear'){
          this.removeFilter()
        }
       
     
      } 
    }

    ngOnInit() {
      this.loading = true
      this.setSortArayy()
      //  setTimeout(() => {
      //   this.subiscribtionItem = this.behavApi.currentItem.subscribe(items=>{
      //     //console.log('items page behavApiRespnse',items)
      //     if(items.length >0){
      //        this.items = items
      //       this.prepareOnNotif()
      //     }
      //   })
    
      //    this.subiscribtionNotif= this.behavApi.currentNotif.subscribe(notif=>{
      //     //console.log('notif page currentNotif behavApiRespnse',notif)
      //     this.notifArr = notif
      //    })
      //   }, 10000); 
      }

      ionViewDidEnter(){
        setTimeout(() => {
          // //check all changes in case notif arr >0 
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
          //     this.prepareOnNotif()
          //     this.storage.get('LogHistoryLocal').then((response) => { 
          //       if (response) {
          //         this.LogHistoryLocalArr = response  
          //       } 
          //     });
            
            
          //   } else {
          //     //console.log('no updates')
          //     this.showNotif = false 
          //   } 
          //   })
          }, 10000); 
      } 

    ionViewDidLeave(){
      //console.log('ionViewWillLeave') 
     // this.subiscribtionNotif.unsubscribe()
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
     this.storage.get('STORE_INFO').then((response) => {
      this.loading = true
       if (response) {
          this.store_info = response
          //console.log(response)
          //console.log(this.store_info) 
        //  this.getStockItems()  
       }
     });
     this.storage.get('itemsLocal').then((response) => {
      if (response) {
         this.items = response
         //console.log(response)
         //console.log('items' ,this.items)
        // this.prepareOnNotif() 
         this.getStockItems()  
      }
    });
    this.storage.get('LogHistoryLocal').then((response) => {
      //console.log('LogHistoryLocal',this.LogHistoryLocalArr)  
      if (response) {
        this.LogHistoryLocalArr = response
      }   
    });
      this.storage.get('colSetting').then((response) => {
       if (response) {
         this.colSetting = response
           //console.log('colSetting',this.colSetting)  
       }
     });
    
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

    
    
    createPdf() {
      this.exportMode = true
    
      let pdfBlock: any = document.getElementById('exceltable');
      let options = {
        background: 'white',
        height: pdfBlock.clientWidth,
        width: pdfBlock.clientHeight,
      };
      domtoimage
        .toPng(pdfBlock, options)
        .then((fileUrl) => {
          var doc = new jsPDF('p', 'mm', 'a4');
          doc.addImage(fileUrl, 'PNG', 10, 10, 240, 180);
          doc.save('items.pdf');

          // let docRes = doc.output();
          // let buffer = new ArrayBuffer(docRes.length);
          // let array = new Uint8Array(buffer);
          // for (var i = 0; i < docRes.length; i++) {
          //   array[i] = docRes.charCodeAt(i);
          // }
          // const directory = this.file.dataDirectory;
          // const fileName = 'user-data.pdf';
          // let options: IWriteOptions = {
          //   replace: true,
          // };
          // this.file
          //   .checkFile(directory, fileName)
          //   .then((res) => {
          //     this.file
          //       .writeFile(directory, fileName, buffer, options)
          //       .then((res) => {
          //         //console.log('File generated' + JSON.stringify(res));
          //         this.fileOpener
          //           .open(this.file.dataDirectory + fileName, 'application/pdf')
          //           .then(() => //console.log('File is exported'))
          //           .catch((e) => //console.log(e));
          //       })
          //       .catch((error) => {
          //         //console.log(JSON.stringify(error));
          //       });
          //   })
          //   .catch((error) => {
          //     this.file
          //       .writeFile(directory, fileName, buffer)
          //       .then((res) => {
          //         //console.log('File generated' + JSON.stringify(res));
          //         this.fileOpener
          //           .open(this.file.dataDirectory + fileName, 'application/pdf')
          //           .then(() => //console.log('File exported'))
          //           .catch((e) => //console.log(e));
          //       })
          //       .catch((error) => {
          //         //console.log(JSON.stringify(error));
          //       });
          //   });
        })
        .catch(function (error) {
          console.error(error);
        });
    }


     openPDF(): void {
      this.exportMode = true
      let DATA: any = document.getElementById('exceltable');
      //console.log(DATA.width)
      html2canvas(DATA).then((canvas) => { 
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('l', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('items.pdf');
        this.exportMode = false
      });
    }


        exportexcel(): void 
        {
          this.exportMode = true
          /* table id is passed over here */   
          let element = document.getElementById('exceltable'); 
          const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          /* save to file */
          XLSX.writeFile(wb, this.fileName);
          this.exportMode = false
        }
 
  
  getStockItems(){
        this.loading = true
        this.api.getAllStockItemsWithouteCounts(this.store_info.id,this.year.id).subscribe(data =>{
          //console.log(data)
          let res = data
          this.items = res['data'] 
          this.sortingArrayOrign = this.items
          // this.items.forEach(element => {
          //   if(+element.tswiaQuantity > 0){
          //     element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 
    
          //   }else if(+element.tswiaQuantity < 0){
          //     element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
          //   }
    
          //   element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
          // });
          this.storage.set('itemsLocal' , this.items).then((response) => {
                 
          }); 
      
      this.prepareFilters()
      this.setSortArayy()
     this.store_tot = 0
     this.store_tot = this.items.reduce( (acc, obj)=> { return acc + (+obj.perch_price * +obj.quantity ); }, 0);
     if(this.colSetting){

     }else{
      this.setColSetting()
     }
        }, (err) => {
        //console.log(err);
      } ,
        ()=>{
        this.loading = false
      }
      )  
   }


   prepareOnNotif(){
    this.sortingArrayOrign = this.items
    // this.items.forEach(element => {
    //   if(+element.tswiaQuantity > 0){
    //     element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 
    //   }else if(+element.tswiaQuantity < 0){
    //     element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
    //   }
    //   element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
    // });
    
    this.prepareFilters()
    this.setSortArayy()
   this.store_tot = 0
   this.store_tot = this.items.reduce( (acc, obj)=> { return acc + (+obj.perch_price * +obj.quantity ); }, 0);
   if(this.colSetting){

   }else{
    this.setColSetting()
   }
   this.loading = false
   }
//    sumStocksItems(){
//     this.loading = true
//     this.api.stockItems(this.store_info.id,this.year.id).subscribe(data =>{
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
//       this.sortingArrayOrign = this.items
//       this.items.forEach(element => {
//         element.quantity =  (+element.perchQuantity + +element.firstQuantity)  - +element.salesQuantity  
//       });
      
//       this.prepareFilters()
//       this.setSortArayy()
//      this.store_tot = 0
//      this.store_tot = this.items.reduce( (acc, obj)=> { return acc + (+obj.perch_price * +obj.quantity ); }, 0);
//      if(this.colSetting){

//      }else{
//       this.setColSetting()
//      }
//     }, (err) => {
//     //console.log(err);
//   } ,
//     ()=>{
//     this.loading = false
//   }
//   )  
// }
 
setColSetting(data?){
      if(data){
        this.colSetting = data
        //console.log("col",this.colSetting)
        this.storage.set('colSetting', this.colSetting).then((response) => {
          
        }); 
      }   
    }

   prepareFilters(){
      const idsbrand = this.items.map(o => o.brand)
      //console.log(idsbrand)
      const filtered = this.items.filter(({brand}, index) => !idsbrand.includes(brand, index + 1))
      //console.log(filtered)
     for (let index = 0; index < filtered.length; index++) {
      const element = filtered[index];
      if (element.brand !="") {
        this.brandList.push({
        "brand":element.brand,
        "selected": false 
      }) 
      }
     }
     //console.log(this.brandList)


      const idsm = this.items.map(o => o.model)
      //console.log(idsm)
      const filteredm = this.items.filter(({model}, index) => !idsm.includes(model, index + 1))
      //console.log(filteredm)
      for (let index = 0; index < filteredm.length; index++) {
        const element = filteredm[index];
        if (element.model !="") { 
        this.modelList.push({
          "model":element.model,
          "selected": false 
        })
      }
       } 
     //console.log(this.modelList) 
     this.filterArrayOrign = this.items
     this.filterArray = this.filterArrayOrign
     //console.log(this.filterArray ,  this.filterArrayOrign)

   }

 
   setSortArayy(){
    // all colomns and push them to sort array
    this.sortStatus.push(
      {
      "col": "id",
       "type":null
      },
      {
        "col": "item_name",
         "type":null
      },
      {
        "col": "item_desc",
         "type":null
      },
      {
        "col": "model",
         "type":null
      },
      {
        "col": "part_no",
         "type":null
      },{
        "col": "brand",
         "type":null
      },
      {
        "col": "min_qty",
         "type":null
      },
      {
        "col": "item_unit",
         "type":null
      },
      {
        "col": "perch_price",
         "type":null
      },
      {
        "col": "pay_price",
         "type":null
      },{
        "col": "profit",
         "type":null
      },
      {
        "col": "quantity",
         "type":null
      },
      {
        "col": "total",
         "type":null
      },
      {
        "col": "lastSold",
         "type":null
      },
      {
        "col": "aliasEn",
         "type":null
      }
    )
     ////console.log('hi there',this.sortStatus.includes(x=>x.type == 1 ? -1: 1))
   }

   sorting(col , type , arr){
     // col which col cliced
    // type = desc or asc
    // arr = items , filter , search
    //console.log(col ,type ,arr)
    if(col == 'id'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.id > +b.id) ? -1 : 1);
           this.sortStatus[0].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.id < +b.id) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.id < +b.id) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[0].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.id < +b.id) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.id < +b.id) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.id < +b.id) ? -1 : 1);
          
        }
      } 
    }else if(col == 'item_name'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_name > b.item_name) ? -1 : 1);
          this.sortStatus[1].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_name > b.item_name) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_name > b.item_name) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[1].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_name < b.item_name) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_name < b.item_name) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_name < b.item_name) ? -1 : 1);
          
        }
      } 
    }else if(col == 'item_desc'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_desc > b.item_desc) ? -1 : 1);
          this.sortStatus[2].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_desc > b.item_desc) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_desc > b.item_desc) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[2].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_desc < b.item_desc) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_desc < b.item_desc) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_desc < b.item_desc) ? -1 : 1);
          
        }
      } 
    }else if(col == 'model'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.model > b.model) ? -1 : 1);
          this.sortStatus[3].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.model > b.model) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.model > b.model) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[3].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.model < b.model) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.model < b.model) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.model < b.model) ? -1 : 1);
          
        }
      } 
    }else if(col == 'part_no'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.part_no > b.part_no) ? -1 : 1);
          this.sortStatus[4].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.part_no > b.part_no) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.part_no > b.part_no) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[4].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.part_no <  b.part_no) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.part_no <  b.part_no) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.part_no <  b.part_no) ? -1 : 1);
          
        }
      } 
    } else if(col == 'brand'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.brand > b.brand) ? -1 : 1);
          this.sortStatus[5].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.brand > b.brand) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.brand > b.brand) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[5].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.brand < b.brand) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.brand < b.brand) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.brand < b.brand) ? -1 : 1);
          
        }
      } 
    }else if(col == 'min_qty'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.min_qty > b.min_qty) ? -1 : 1);
          this.sortStatus[6].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.min_qty > b.min_qty) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.min_qty > b.min_qty) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[6].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.min_qty < b.min_qty) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.min_qty < b.min_qty) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.min_qty < b.min_qty) ? -1 : 1);
          
        }
      } 
    }else if(col == 'item_unit'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_unit > b.item_unit) ? -1 : 1);
          this.sortStatus[7].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_unit > b.item_unit) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_unit > b.item_unit) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[7].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_unit < b.item_unit) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_unit < b.item_unit) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.item_unit < b.item_unit) ? -1 : 1);
          
        }
      } 
    }else if(col == 'perch_price'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.perch_price > +b.perch_price) ? -1 : 1);
          this.sortStatus[8].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.perch_price > +b.perch_price) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.perch_price > +b.perch_price) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[8].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.perch_price < +b.perch_price) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.perch_price < +b.perch_price) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.perch_price < +b.perch_price) ? -1 : 1);
          
        }
      } 
    }else if(col == 'pay_price'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.pay_price > +b.pay_price) ? -1 : 1);
          this.sortStatus[9].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.pay_price > +b.pay_price) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.pay_price > +b.pay_price) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[9].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.pay_price < +b.pay_price) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.pay_price < +b.pay_price) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.pay_price < +b.pay_price) ? -1 : 1);
          
        }
      } 
    }else if(col == 'profit'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.profit > b.profit) ? -1 : 1);
          this.sortStatus[10].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.profit > b.profit) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.profit > b.profit) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[10].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.profit < b.profit) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.profit < b.profit) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.profit < b.profit) ? -1 : 1);
          
        }
      } 
    }else if(col == 'quantity'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.quantity > +b.quantity) ? -1 : 1);
          this.sortStatus[11].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.quantity > +b.quantity) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.quantity > +b.quantity) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[11].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.quantity < +b.quantity) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.quantity < +b.quantity) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.quantity < +b.quantity) ? -1 : 1);
          
        }
      } 
    }else if(col == 'total'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.total > +b.total) ? -1 : 1);
          this.sortStatus[12].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.total > +b.total) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.total > b.total) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[12].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.total < +b.total) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.total < +b.total) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (+a.total < +b.total) ? -1 : 1);
          
        }
      } 
    }else if(col == 'lastSold'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.lastSoldDate > b.lastSoldDate) ? -1 : 1);
          this.sortStatus[13].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.lastSoldDate > b.lastSoldDate) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.lastSoldDate > b.lastSoldDate) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[13].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.lastSoldDate < b.lastSoldDate) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.lastSoldDate < b.lastSoldDate) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.lastSoldDate < b.lastSoldDate) ? -1 : 1);
          
        }
      } 
    }else if(col == 'aliasEn'){
      if(type == 'desc'){
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.aliasEn > b.aliasEn) ? -1 : 1);
          this.sortStatus[13].type = 'asc'
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.aliasEn > b.aliasEn) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.aliasEn > b.aliasEn) ? -1 : 1);
        }
      } else if(type == 'asc' || type == null) {
        this.sortStatus[13].type = 'desc'
        if(arr == 'items'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.aliasEn < b.aliasEn) ? -1 : 1);
        }else if(arr == 'filter'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.aliasEn < b.aliasEn) ? -1 : 1);
        }else if(arr == 'search'){
          this.items = this.sortingArrayOrign.sort((a, b) => (a.aliasEn < b.aliasEn) ? -1 : 1);
          
        }
      } 
    }
  //  
   }

  applyFilter(data){
    this.filterMode = true
    this.modelList = data[2]
    this.brandList = data[3]
    //console.log( this.modelList , this.brandList ,data )
    this.modelList.forEach(element => {
      if (element.selected== true){
        this.showMdel = true
      }
    });

    this.brandList.forEach(element => {
      if (element.selected== true){
        this.showBrand = true
      }
    });
    
   
    
    
   }
 
  setFilter(){
    this.filterArray = this.items
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
    
    this.store_fltTot = flt.reduce( (acc, obj)=> { return acc + (+obj.perch_price * +obj.quantity ); }, 0);
    //console.log( 'store_fltTot',this.store_fltTot)
  }

   removeFilter(type?){
   this.presentLoadingWithOptions('....')
     if (type =='model') {
      this.modelList.forEach(element => {
        element.selected = false
      });
       this.setFilter()
     }else if(type =='brand'){
      this.brandList.forEach(element => {
        element.selected = false
      });
      this.setFilter()
     }else{
      this.modelList.forEach(element => {
        element.selected = false
      });
      this.brandList.forEach(element => {
        element.selected = false
      });
      this.setFilter()
     }

    
     let bl = 0 
     for (let index = 0; index < this.brandList.length; index++) {
      const element = this.brandList[index];
      if (element.selected== true){
       bl = bl+1
      }
     }
     if (bl>0) {
      this.showBrand = true
     }else{
      this.showBrand = false 
     }

     let bl2 = 0 
     for (let index = 0; index < this.modelList.length; index++) {
      const element = this.modelList[index];
      if (element.selected== true){
       bl2 = bl2+1
      }
     }
     if (bl2>0) {
      this.showMdel = true
     }else{
      this.showMdel = false 
     }

     if (bl == 0 && bl2 == 0){
      this.filterArray = this.items
      this.filterMode = false
     }


     this.store_fltTot = this.filterArray.reduce( (acc, obj)=> { return acc + (+obj.perch_price * +obj.quantity ); }, 0);
     //console.log( 'store_fltTot',this.store_fltTot)

   this.loadingController.dismiss()
   }

   filterItems(searchTerm) {
     //console.log(searchTerm)  
     this.searcResult = this.items.filter(item => item.item_name.toLowerCase().includes(searchTerm.toLowerCase())) 
     //console.log(this.searcResult) 
   }
    
  clearSearch(){
     //console.log('clear')
     this.searchMode = false
    // this.searcResult = []
  }
 
 FocusSearch(){
    //console.log('FocusSearch')
    this.searchMode = true 
    this.searcResult = []
}	

 cancelSearch(){
  //console.log('cancelSearch' ,this.items)
  this.searchMode = false
  this.searcResult = []
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

   save(mdata){ 
       this.presentLoadingWithOptions('جاري حفظ البيانات ...')
       this.api.saveitemMulti(mdata[0]).subscribe(data => {
        //console.log(data)
        if (data['message'] != 'Post Not Created') { 
          this.firstq = {id:null ,item_id:data['message'] , store_id:this.store_info.id , quantity :mdata[1].quantity ,pay_price:mdata[0].pay_price,perch_price:mdata[0].perch_price ,fq_year:'2022'}
          this.saveFierstQty(mdata[0])
        }else{
          this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
        }
       
      }, (err) => {
        //console.log(err);
        this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
      }) 
  }

  async saveFierstQty(itemData){  
    this.api.saveFirstQty(this.firstq).subscribe(data=>{ 
      //console.log(data)  
      if (data['message'] != 'Post Not Created') { 
        this.firstq.id = data['message']
      }
      this.saveLogHistory(itemData , this.firstq ,'insert')
      this.presentToast('تم الحفظ','success')

    }, (err) => {
      //console.log(err);
      this.presentToast('1لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
     
      this.loadingController.dismiss()
   
    }, () => {
      this.loadingController.dismiss()
    }
    )      
  }

  generateRandom(role):any{
    let da = new Date 
    //console.log(da)
    let randomsNumber = da.getMonth().toString() + da.getDay().toString() + da.getHours().toString()+ da.getMinutes().toString()+da.getSeconds().toString()+da.getMilliseconds().toString() + role
    return this.store_info.store_ref + randomsNumber 
  }

    prepareLogHistory(itemData , firstq , role){
     this.logHistoryArr = []
    let dt = new Date()
    let typee = "" 
      if(role == 'insert'){
        typee = "insert firstq"
          itemData.id = firstq.item_id
        this.logHistoryArr.push(
          {
            "id":this.firstq.id,
            "logRef":this.generateRandom(typee),
            "userId": this.user_info.id,
            "typee":typee,
            "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
            "logStatus":0,
            "logToken": JSON.stringify(firstq)  ,
            "yearId": this.year.id,
            "store_id" :this.store_info.id
          }
          )

          typee = "insert item"
          this.logHistoryArr.push(
            {
              "id":null,
              "logRef":this.generateRandom(typee),
              "userId":this.user_info.id,
              "typee":typee,
              "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
              "logStatus":0,
              "logToken":JSON.stringify(itemData)  ,
              "yearId":this.year.id,
              "store_id":this.store_info.id
            }
            )
      } else {
       // typee = "insert firstq"
        // firstq.item_id =  itemData.id 
        // this.logHistoryArr.push(
        //   {
        //     "id":this.firstq.id,
        //     "logRef":this.generateRandom(),
        //     "userId": this.user_info.id,
        //     "typee":typee,
        //     "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
        //     "logStatus":0,
        //     "logToken": JSON.stringify(firstq)  ,
        //     "yearId": this.year.id,
        //     "store_id" :this.store_info.id
        //   }
        //   )
        if(role == 'update' ){
          typee = "update item" 
        }else if(role == 'delete' ){
          typee = "delete item" 
        }
          this.logHistoryArr.push(
            {
              "id":null,
              "logRef":this.generateRandom(typee),
              "userId":this.user_info.id,
              "typee":typee,
              "datee": momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss'),
              "logStatus":0,
              "logToken":JSON.stringify(itemData)  ,
              "yearId":this.year.id,
              "store_id":this.store_info.id
            }
            )
          }
        return this.logHistoryArr
       }

   saveLogHistory(itemData , firstq , role){  
    let mdata =  this.prepareLogHistory(itemData , firstq , role) 
    //console.log('mdata',mdata)
    this.api.saveLogHistoryMulti(mdata[0] ,mdata[1],role).subscribe(data => {
     //console.log(data)
     if (data['message'] != 'Post Not Created') { 
       this.getStockItems()
       this.logHistoryArr =[]
     }else{
       this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
     } 
   }, (err) => {
     //console.log(err);
     this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
   }) 
  }


  async saveItemStock(){  
    this.api.saveItemStock(this.itemSstock).subscribe(data=>{ 
      //console.log(data)  
     // this.getStockItems()
      this.presentToast('تم الحفظ بنجاح' , 'success')
    }, (err) => {
      //console.log(err);
      this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
    }, () => {
      this.loadingController.dismiss()
    }
    )      
  }



updateFirstq(){ 
  this.api.updatfiratqty(this.firstq).subscribe(data => {
  //console.log(data)
  if (data['message'] != 'Post Not Updated') {
    this.presentToast('تم التعديل بنجاح' , 'success')
   // this.getStockItems() 
   
  }else{
  this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger') 
  this.loadingController.dismiss()
  }
 
}, (err) => {
  //console.log(err);
  this.presentToast('لم يتم حفظ البيانات , خطا في الإتصال حاول مرة اخري' , 'danger')
},() => {
 this.loadingController.dismiss()
})  
}

incresePrice(data){ 
  this.presentLoadingWithOptions('جاري تعديل الأسعار ...')
 this.api.increasePrice(data.payval,data.perchval).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Updated') {
    this.presentToast('تم التعديل بنجاح' , 'success') 
    //this.getStockItems()
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

decreasePrice(data){ 
  this.presentLoadingWithOptions('جاري تعديل الأسعار ...')
 this.api.decreasePrice(data.payval,data.perchval).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Updated') {
    this.presentToast('تم التعديل بنجاح' , 'success') 
    this.getStockItems()
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


deleteItem(item) {
  //console.log(item)
  this.selectedItem = item
if (item.salesQuantity > 0 || item.perchQuantity > 0) {
  this.presentToast('لا يمكن حذف الصنف , توجد كميات في المخزون    ' , 'danger')
} else {
  this.presentAlertConfirm()
}
}

delete(){ 
  this.presentLoadingWithOptions('جاري حذف البيانات ...')
 this.api.deleteItems(this.selectedItem.id).subscribe(data => {
   //console.log(data)
   if (data['message'] != 'Post Not Deleted') {
    this.presentToast('تم الحذف بنجاح' , 'success')
    this.saveLogHistory(this.selectedItem , undefined ,'delete')  
   // this.getStockItems() 
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
