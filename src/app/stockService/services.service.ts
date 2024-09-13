import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//import { environment } from '../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
//import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})


 export class ServicesService {
  api = 'http://localhost/myaperpiPos/myapi/api/'
  // api :any =  'https://erp.hosamdev.com/myapi/api/'
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
  folderNo:any=''
  public Notifications: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  constructor(private storage: Storage,public http: HttpClient ) {
    //  this.api = 'https://erp.hosamdev.com/myapi'+ this.folderNo +'/api/'
     // this.setCurrentYear()
   }


  
  async setCurrentYear(){
    await this.storage.create(); 
    this.storage.get('year').then((response) => {
      if (response) {
        this.year = response 
        if(this.year.id == 1){
          this.folderNo = ''
          this.api = 'https://erp.hosamdev.com/myapi'+ this.folderNo +'/api/' 
        }else{
          this.folderNo = '23'
          this.api = 'https://erp.hosamdev.com/myapi'+ this.folderNo +'/api/'
        }
      }
    });
    }


  getPayNotif(store_id){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    return this.http.get(this.api+'pay/paynotif.php',{params: params})
  }

  getFirstQty(store_id){
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    return this.http.get(this.api+'firstq/readByStore.php',{params: params})
  }

  getItems(){
    return this.http.get(this.api+'items/read.php')
  }

  getStores(){
    return this.http.get(this.api+'store/read.php')
  }

  getCompany(){
    return this.http.get(this.api+'company/read.php')
  }


  getBrands(){
    return this.http.get(this.api+'items/readBrand.php')
  }

  getAllLogHistory(store_id , yearId ){ 
    let params = new HttpParams() 
    params=params.append('store_id' , +store_id)
    params=params.append('yearId' , +yearId) 
    return this.http.get(this.api+'logHistory/readAllByStore.php',{params: params})
  }
  
  truncateItems(){
    return this.http.get(this.api+'items/truncateItems.php')
  }

  // stockItems(store_id , yearId){ 
  //   let params = new HttpParams() 
  //   params=params.append('store_id' , store_id) 
  //   params=params.append('yearId' , yearId)

  //   return this.http.get(this.api+'items/readStock.php',{params: params})
  // }

   stockItems(store_id , yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'items/itemsView.php')
  }

  getAllStockItemsWithouteCounts(store_id , yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'items/readAllStockItems.php',{params: params})
  }

  stockItems2(store_id ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    
    return this.http.get('https://erp.hosamdev.com/myapi23/api/items/readStock.php',{params: params})
  }
  
  getToptswia(store_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)

    return this.http.get(this.api+'tswia/getTopSales.php',{params: params})
  }

  getTopSales(store_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'pay/getTopSales.php',{params: params})
  }

  
  getTopSalesInit(store_id){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    return this.http.get(this.api+'payinit/getTopSales.php',{params: params})
  }

  getItemPaysByItemIdBydate(store_id , item_id,from,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id)
    params=params.append('from' , from)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'pay_details/readAllByItemIdDate.php',{params: params})
  }

  getItemPaysBydate(store_id ,from,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    params=params.append('from' , from)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'pay_details/readAllByDate.php',{params: params})
  }
  
  
  getItemPaysByItemId(store_id , item_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'pay_details/readAllByItemId.php',{params: params})
  }

  getItemQtyPaysByItemId(store_id , item_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'pay_details/readQtyByItemId.php',{params: params})
  }
 
  
  getItemPaysByItemIdBy2date(store_id , item_id ,from ,to,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('from' , from) 
    params=params.append('to' , to) 
    params=params.append('yearId' , yearId)

    return this.http.get(this.api+'pay_details/readAllByItemId2Date.php',{params: params})
  }

  //purch
  getItemTswiaByItemIdBy2date(store_id , item_id ,from ,to,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('from' , from) 
    params=params.append('to' , to) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'tswia_details/readAllByItemId2Date.php',{params: params})
  }
  //purch
  getItemPurchByItemIdBy2date(store_id , item_id ,from ,to,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('from' , from) 
    params=params.append('to' , to) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'perch_details/readAllByItemId2Date.php',{params: params})
  }


  getItemPurchByItemId(store_id , item_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('yearId' , yearId)

    return this.http.get(this.api+'perch_details/readAllByItemId.php',{params: params})
  }

  getQtyPurchByItemId(store_id , item_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'perch_details/readQtyByItemId.php',{params: params})
  }


  getQtyTswiaByItemId(store_id , item_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'tswia_details/readQtyByItemId.php',{params: params})
  }

  getItemTswiaByItemId(store_id , item_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'tswia_details/readAllByItemId.php',{params: params})
  }


  getItemPurchsByItemIdBydate(store_id , item_id,from ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id)
    params=params.append('from' , from)
    params=params.append('yearId' , yearId)

    return this.http.get(this.api+'perch_details/readAllByItemIdDate.php',{params: params})
  }

  getItemPurchsBydate(store_id ,from ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    params=params.append('from' , from)
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'perch_details/readAllByDate.php',{params: params})
  }

  getItemTswiasByItemIdBydate(store_id , item_id,from ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('item_id' , item_id)
    params=params.append('from' , from)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'tswia_details/readAllByItemIdDate.php',{params: params})
  }
  getItemTswiasBydate(store_id ,  from ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    params=params.append('from' , from)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'tswia_details/readAllByDate.php',{params: params})
  }

  getTopInvoice(store_id ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'invoices/getTopSales.php',{params: params})
  }

  getInvoiceByDate(store_id,from ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'invoices/getSalesByDate.php',{params: params})
  }

  getInvoice2Date(store_id,from,to,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
    params=params.append('to' , to)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'invoices/getSales2Date.php',{params: params})
  }


  ////
  
  getTopJournale(store_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
  params=params.append('yearId' , yearId) 

    return this.http.get(this.api+'journal/getTopSales.php',{params: params})
  }

  getJournaleByDate(store_id,from,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
  params=params.append('yearId' , yearId) 

    return this.http.get(this.api+'journal/getSalesByDate.php',{params: params})
  }

  getJournale2Date(store_id,from,to,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
    params=params.append('to' , to)
  params=params.append('yearId' , yearId) 

    return this.http.get(this.api+'journal/getSales2Date.php',{params: params})
  }
///
getTopJfrom(store_id ,yearId){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('yearId' , yearId) 

  return this.http.get(this.api+'jdetails_from/getTopSales.php',{params: params})
}

getJFromByDate(store_id,from ,yearId){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('from' , from)
  params=params.append('yearId' , yearId) 

  return this.http.get(this.api+'jdetails_from/getSalesByDate.php',{params: params})
}

getJFrom2Date(store_id,from,to,yearId){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('from' , from)
  params=params.append('to' , to)
  params=params.append('yearId' , yearId) 

  return this.http.get(this.api+'jdetails_from/getSales2Date.php',{params: params})
}
  ///
  
getTopJTo(store_id,yearId){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('yearId' , yearId) 
  return this.http.get(this.api+'jdetails_to/getTopSales.php',{params: params})
}

getJToByDate(store_id,from,yearId){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('from' , from)
  params=params.append('yearId' , yearId) 

  return this.http.get(this.api+'jdetails_to/getSalesByDate.php',{params: params})
}

getJTo2Date(store_id,from,to ,yearId){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('from' , from)
  params=params.append('to' , to)
  params=params.append('yearId' , yearId) 
  return this.http.get(this.api+'jdetails_to/getSales2Date.php',{params: params})
}
///

getTswiaByDate(store_id,from ,yearId){ 
  let params = new HttpParams() 
  params=params.append('store_id' , store_id)
  params=params.append('from' , from)
  params=params.append('yearId' , yearId) 

  return this.http.get(this.api+'tswia/getSalesByDate.php',{params: params})
}
  getSalesByDate(store_id,from ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
    params=params.append('yearId' , yearId) 

    return this.http.get(this.api+'pay/getSalesByDate.php',{params: params})
  }
  
  getTswia2Date(store_id,from,to ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
    params=params.append('to' , to)
    params=params.append('yearId' , yearId)  
    return this.http.get(this.api+'tswia/getSales2Date.php',{params: params})
  }

  getSales2Date(store_id,from,to ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
    params=params.append('to' , to)
    params=params.append('yearId' , yearId) 

    return this.http.get(this.api+'pay/getSales2Date.php',{params: params})
  }

  getTopPerch(store_id ,yearId){ 
    let params = new HttpParams() 
     params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId) 

    return this.http.get(this.api+'perch/getTopSales.php',{params: params})
  }
  getTopOrderPerch(store_id){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    return this.http.get(this.api+'perchOrder/getTopSales.php',{params: params})
  }


  
  getBalanceSubAccount(store_id,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'sub_accounts/balanceSheetByStore.php',{params: params})
  }


  getPerchByDate(store_id,from ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'perch/getSalesByDate.php',{params: params})
  }


  getPerch2Date(store_id,from,to ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('from' , from)
     params=params.append('to' , to)
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'perch/getSales2Date.php',{params: params})
  }
  
  getPayInvoDetail(store_id,pay_ref,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    params=params.append('pay_ref' , pay_ref)
    return this.http.get(this.api+'pay_details/readByStoreByRef.php',{params: params})
  }

  getTswiaInvoDetail(store_id,pay_ref,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    params=params.append('pay_ref' , pay_ref)
    return this.http.get(this.api+'tswia_details/readByStoreByRef.php',{params: params})
  }

  getPayInvoDetailinit(store_id,pay_ref){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('pay_ref' , pay_ref)
    return this.http.get(this.api+'payinit_details/readByStoreByRef.php',{params: params})
  }
  
  getPerchInvoDetail(store_id,pay_ref ,yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('pay_ref' , pay_ref)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'perch_details/readByStoreByRef.php',{params: params})
  }

  getPerchOrderInvoDetail(store_id,pay_ref){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('pay_ref' , pay_ref) 
    return this.http.get(this.api+'perchOrder_details/readByStoreByRef.php',{params: params})
  }
  getAllPerchDetail(store_id , yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'perch_details/readAllByStore.php',{params: params})
  }
  getAllTswiaDetail(store_id , yearId){ 
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params=params.append('yearId' , yearId)
    return this.http.get(this.api+'tswia_details/readAllByStore.php',{params: params})
  }

  getAllSalesDetail(store_id, yearId){ 
    let params = new HttpParams() 
    params=params.append('yearId' , yearId)
    params=params.append('store_id' , store_id)
    return this.http.get(this.api+'pay_details/readAllByStore.php',{params: params})
  }
  getExpnsesAccounts(store_id , yearId){ 
    let ac_id = 3
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params= params.append('ac_id' , ac_id) 
    params= params.append('yearId' , yearId) 
    return this.http.get(this.api+'sub_accounts/readByStore.php',{params: params})
  }



  getMainAccounts( ){   
    return this.http.get(this.api+'accounts/readByStore.php' )
  }

  getAllAccounts(store_id ,yearId){  
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    params=params.append('yearId' , yearId) 
    return this.http.get(this.api+'sub_accounts/readAllStore.php',{params: params})
  }
  getAccountCategory(store_id){  
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    return this.http.get(this.api+'account_category/readByStore.php',{params: params})
  }

  getJournalType(store_id){  
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    return this.http.get(this.api+'j_type/readByStore.php',{params: params})
  }

  getJournalTypeDetails(store_id){  
    let params = new HttpParams() 
    params=params.append('store_id' , store_id) 
    return this.http.get(this.api+'j_typeDetails/readByStoreByRef.php',{params: params})
  }

  getSalesAccounts(store_id ,yearId){ 
    let ac_id = 1
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params= params.append('ac_id' , ac_id) 
    params= params.append('yearId' , yearId) 
    return this.http.get(this.api+'sub_accounts/readByStore.php',{params: params})
  }

  getPerchAccounts(store_id,yearId){ 
    let ac_id = 2
    let params = new HttpParams() 
    params=params.append('store_id' , store_id)
    params= params.append('ac_id' , ac_id) 
    params= params.append('yearId' , yearId) 
    return this.http.get(this.api+'sub_accounts/readByStore.php',{params: params})
  }

  getYear( ){  
    return this.http.get(this.api+'year/readByStoreByRef.php')
  }


  login(user){ 
    //console.log(user)
    let params = new HttpParams() 
    params= params.append('user_name' , user.user_name )
    params= params.append('password' , user.password)
    params=params.append('store_id' , user.store_id)
    params=params.append('level' , 'user')
    return this.http.get(this.api+'users/login.php',{params: params})
  }

  saveTswiaInvo(payInvo){
    return this.http.post(this.api+'tswia/create.php', 
     payInvo
     )
  }


  saveSalesInvo(payInvo){
    return this.http.post(this.api+'pay/create.php', 
     payInvo
     )
  }
  saveSalesInvoInit(payInvo){
    return this.http.post(this.api+'payinit/create.php', 
     payInvo
     )
  }

  uploadItems(file){
    //console.log(file)
    return this.http.post(this.api+'uploadXsl.php', 
     file
     )
  }

  uploadFq(file){
    //console.log(file)
    return this.http.post(this.api+'uploadXslFristq.php', 
     file
     )
  }

  upload2(file):Observable<any> {
  
    // Create form data
    const formData = new FormData(); 
      
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
      
    // Make http post request over api
    // with formData as req
    return this.http.post(this.api+'uploadXsl.php', formData)
}
 

  saveExpenseInvo(payInvo){
    return this.http.post(this.api+'invoices/create.php', 
     payInvo
     )
  }

  saveJournal(payInvo){
    return this.http.post(this.api+'journal/create.php', 
     payInvo
     )
  }
  updateTswiaInvo(payInvo){
    return this.http.post(this.api+'tswia/update.php', 
     payInvo
     )
  }
  updateSalesInvo(payInvo){
    return this.http.post(this.api+'pay/update.php', 
     payInvo
     )
  }

  updateInitSalesInvo(payInvo){
    return this.http.post(this.api+'payinit/update.php', 
     payInvo
     )
  }

  deleteTswiaInvo(pay_id){
    let params = new HttpParams() 
    params= params.append('pay_id' , pay_id )
      return this.http.delete(this.api+'tswia/delete.php', {params: params})
  }

  deleteSalesInvo(pay_id){
    let params = new HttpParams() 
    params= params.append('pay_id' , pay_id )
      return this.http.delete(this.api+'pay/delete.php', {params: params})
    }

    deleteSalesInvoInit(pay_id){
      let params = new HttpParams() 
      params= params.append('pay_id' , pay_id )
        return this.http.delete(this.api+'payinit/delete.php', {params: params})
      }
    deleteJournal(j_ref){
      let params = new HttpParams() 
      params= params.append('j_ref' , j_ref )
        return this.http.delete(this.api+'journal/deleteMultiServices.php', {params: params})
      }

    deleteFristq(store_id,fq_year){
      let params = new HttpParams() 
      params= params.append('store_id' , store_id )
      params= params.append('fq_year' , fq_year )
        return this.http.delete(this.api+'firstq/deleteByStore.php', {params: params})
      }

    savePerchInvo(payInvo){
      return this.http.post(this.api+'perch/create.php', 
       payInvo
       )
    }
    savePerchOrderInvo(payInvo){
      return this.http.post(this.api+'perchOrder/create.php', 
       payInvo
       )
    }
  
    updatePerchInvo(payInvo){
      return this.http.post(this.api+'perch/update.php', 
       payInvo
       )
    }
  
     deletePerchInvo(pay_id){
      let params = new HttpParams() 
      params= params.append('pay_id' , pay_id )
        return this.http.delete(this.api+'perch/delete.php', {params: params})
      }

      updatePerchOrderInvo(payInvo){
        return this.http.post(this.api+'perchOrder/update.php', 
         payInvo
         )
      }
    
       deletePerchOrderInvo(pay_id){
        let params = new HttpParams() 
        params= params.append('pay_id' , pay_id )
          return this.http.delete(this.api+'perchOrder/delete.php', {params: params})
        }
    
  

  saveSubAccount(sub_account){
    return this.http.post(this.api+'sub_accounts/create.php', 
      sub_account
     )
  }

  updateSubAccount(payInvo){
    return this.http.post(this.api+'sub_accounts/update.php', 
     payInvo
     )
  }

  deleteSubAccont(id){ 
    let params = new HttpParams() 
    params=params.append('id' , id)
    return this.http.get(this.api+'sub_accounts/delete.php',{params: params})
  }

  createMultiAccount(accountList){
    accountList= JSON.stringify(accountList) 
    return this.http.post(this.api+'sub_accounts/createMulti.php',
    accountList
    )
  }

  
  saveItem(item){
    return this.http.post(this.api+'items/create.php', 
     item
     )
  }
  
  saveitemMulti(item){
    let itemarr:any = []
    itemarr.push(item)
    itemarr = JSON.stringify(itemarr) 
    return this.http.post(this.api+'items/createMulti.php',
    itemarr
    )
  }

  saveLogHistoryMulti(item ,firstq ,role){
    let itemarr:any = []
    if(role == 'insert'){
      itemarr.push(item ,firstq)
    }else{
      itemarr.push(item) 
    } 
    
    itemarr = JSON.stringify(itemarr) 
    return this.http.post(this.api+'logHistory/createMulti.php',
    itemarr
    )
  }

  saveLogHistoryMultiSales(invo ,cust ,role){
    let itemarr:any = []
    if(role == 'new account'){
      itemarr.push(invo ,cust)
    }else{
      itemarr.push(invo) 
    }

    itemarr = JSON.stringify(itemarr) 
    return this.http.post(this.api+'logHistory/createMulti.php',
    itemarr
    )
  }

  saveFirstQty(firstq){
    return this.http.post(this.api+'firstq/createf.php', 
    firstq
     )
  }

  updatfiratqty(item){
    return this.http.post(this.api+'firstq/updateQty.php', 
     item
     )
  }

  saveItemStock(itemSstock){
    return this.http.post(this.api+'stock/create.php', 
    itemSstock
     )
  }
  

  deleteTswiaitemList(pay_ref){
    let params = new HttpParams() 
    params= params.append('pay_ref' , pay_ref )
      return this.http.delete(this.api+'tswia_details/deleteMultiServices.php', {params: params})
    }
 deleteSalesitemList(pay_ref){
  let params = new HttpParams() 
  params= params.append('pay_ref' , pay_ref )
    return this.http.delete(this.api+'pay_details/deleteMultiServices.php', {params: params})
  }

  deleteSalesitemListInit(pay_ref){
    let params = new HttpParams() 
    params= params.append('pay_ref' , pay_ref )
      return this.http.delete(this.api+'payinit_details/deleteMultiServices.php', {params: params})
  }

  deleteJFrom(j_ref){
    let params = new HttpParams() 
    params= params.append('j_ref' , j_ref )
      return this.http.delete(this.api+'jdetails_from/deleteMultiServices.php', {params: params})
    }
    deleteJto(j_ref){
      let params = new HttpParams() 
      params= params.append('j_ref' , j_ref )
        return this.http.delete(this.api+'jdetails_to/deleteMultiServices.php', {params: params})
      }

  deletePerchitemList(pay_ref){
    let params = new HttpParams() 
    params= params.append('pay_ref' , pay_ref )
      return this.http.delete(this.api+'perch_details/deleteMultiServices.php', {params: params})
    }

    deletePerchOrderitemList(pay_ref){
      let params = new HttpParams() 
      params= params.append('pay_ref' , pay_ref )
        return this.http.delete(this.api+'perchOrder_details/deleteMultiServices.php', {params: params})
      }

      saveTswiaitemList(itemList){
        itemList= JSON.stringify(itemList) 
        return this.http.post(this.api+'tswia_details/createMulti.php',
          itemList
        )
      }

  saveSalesitemList(itemList){
    itemList= JSON.stringify(itemList) 
    return this.http.post(this.api+'pay_details/createMulti.php',
      itemList
    )
  }



  saveSalesitemListInit(itemList){
    itemList= JSON.stringify(itemList) 
    return this.http.post(this.api+'payinit_details/createMulti.php',
      itemList
    )
  }

  createMultiSales(accountList){
    accountList= JSON.stringify(accountList) 
    return this.http.post(this.api+'pay/createMulti.php',
    accountList
    )
  }
  createMultiPurch(accountList){
    accountList= JSON.stringify(accountList) 
    return this.http.post(this.api+'perch/createMulti.php',
    accountList
    )
  }

  saveJournalFrom(itemList){
    itemList= JSON.stringify(itemList) 
    return this.http.post(this.api+'jdetails_from/createMulti.php',
      itemList
    )
  }
 
  saveJournalTo(itemList){
    itemList= JSON.stringify(itemList) 
    return this.http.post(this.api+'jdetails_to/createMulti.php',
      itemList
    )
  }

  savePerchitemList(itemList){
    itemList= JSON.stringify(itemList) 
    return this.http.post(this.api+'perch_details/createMulti.php',
      itemList
    )
  }
  savePerchOrderitemList(itemList){
    itemList= JSON.stringify(itemList) 
    return this.http.post(this.api+'perchOrder_details/createMulti.php',
      itemList
    )
  }


  updateItem(item){
    return this.http.post(this.api+'items/update.php', 
     item
     )
  }

  updatePrices(item){
    return this.http.post(this.api+'items/updatePrices.php', 
     item
     )
  }
  
  increasePrice(payval,perchval){
    let item ={payval:payval ,perchval:perchval}
    return this.http.post(this.api+'items/increasePrice.php', 
    item
     )
  }

  decreasePrice(payval,perchval){
    let item ={payval:payval ,perchval:perchval}
    return this.http.post(this.api+'items/decreasePrice.php', 
     item
     )
  }

  deleteItems(id){ 
    let params = new HttpParams() 
    params=params.append('id' , id)
    return this.http.get(this.api+'items/delete.php',{params: params})
  }

}
