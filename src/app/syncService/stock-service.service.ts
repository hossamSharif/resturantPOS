import { Injectable } from '@angular/core';
import { BehaviorSubject , Observable, TimeInterval } from 'rxjs';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage'; 
import * as momentObj from 'moment';
import * as momentTz from 'moment-timezone';
 
@Injectable({
  providedIn: 'root'
})
export class StockServiceService {

  api :any =  'https://erp.hosamdev.com/myapi/api/'
  user_info : {id:any ,user_name:any ,store_id :any,full_name:any,password:any} 
  year : {id:any ,yearDesc:any ,yearStart :any,yearEnd:any}
  store_info : {id:any , location :any ,store_name:any , store_ref:any }
  LogHistoryArr:Array<any>=[]
  LogHistoryLocalTempArr:Array<any>=[]
  LogHistoryLocalArr:Array<any>=[]
  lastSync :any  
  intrev :any ; 
  purchase:Array<any> =[] 
  sales:Array<any> =[] 
  sub_accountSales:Array<any> =[]
  sub_accountPurch:Array<any> =[]
  itemsLocal:Array<any> =[]
  tswia_details:Array<any> =[]
  items :Array<any> =[]
  public itemsResources: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public notiftemp: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  
  currentItem = this.itemsResources.asObservable()
  currentNotif = this.notiftemp.asObservable()

  constructor(private storage: Storage,public http: HttpClient) {
   
    // this.setConfig()
   }
   
   changeItems(items: Array<any>){
    this.itemsResources.next(items)
   }
   
   changeNotif(notif: Array<any>){
    //console.log([this.LogHistoryLocalTempArr , this.items , this.sub_accountSales ])  
    this.notiftemp.next(notif)
   }

  async setConfig(){
    await this.storage.create(); 
    this.storage.get('LogHistoryLocal').then((response) => {
      //console.log('LogHistoryLocal',this.LogHistoryLocalArr)  
      if (response) {

        this.LogHistoryLocalArr = response
        this.LogHistoryLocalArr = this.LogHistoryLocalArr.sort((a, b) => (+a.id > +b.id) ? -1 : 1);

      }else{ 
        this.storage.set('LogHistoryLocal',this.LogHistoryLocalArr).then((response) => {
          
        })
      }
    });

    // this.storage.get('LogHistoryLocalTemp').then((response) => {
    //   //console.log('LogHistoryLocalTemp',this.LogHistoryLocalTempArr)  
    //   if (response) {
    //     this.LogHistoryLocalTempArr = response
    //   }else{
    //     this.storage.set('LogHistoryLocalTemp',this.LogHistoryLocalTempArr).then((response) => {
          
    //     })
    //   }
    // });

  
   
    this.storage.get('year').then((response) => {
      if (response) {
        this.year = response  
      }
    });
    this.storage.get('lastSync').then((response) => {
      if (response) {
        this.lastSync = response 
        //console.log('lastSync',this.lastSync) 
      }else{
        this.lastSync = '2023-01-01 00:00:00'
        this.storage.set('lastSync',this.lastSync).then((response) => {
         //console.log('lastSync',this.lastSync)  
        })
      }
    });
    
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
     this.syncFunctNew()
    }
 
    getLogHistory(store_id , yearId ,datee){ 
      let params = new HttpParams() 
      params=params.append('store_id' , +store_id)
      params=params.append('yearId' , +yearId)
      params=params.append('from' , datee)
      return this.http.get(this.api+'logHistory/readByStore.php',{params: params})
    }

    stockItems(store_id , yearId){ 
      let params = new HttpParams() 
      params=params.append('store_id' , store_id) 
      params=params.append('yearId' , yearId)
  
      return this.http.get(this.api+'items/readStock.php',{params: params})
    }

    getSalesAccounts(store_id ,yearId){ 
      let ac_id = 1
      let params = new HttpParams() 
      params=params.append('store_id' , store_id)
      params= params.append('ac_id' , ac_id) 
      params= params.append('yearId' , yearId) 
      return this.http.get(this.api+'sub_accounts/readByStore.php',{params: params})
    }
  


    syncFunct(){ 
        //console.log('LogHistoryLocalTempArr',this.LogHistoryLocalTempArr) 
       setInterval(() => { 
          this.storage.get('lastSync').then((response) => {
            if(response){
            this.lastSync = response
            //console.log('this.lastSync syncFunct' , this.lastSync)
            this.getLogHistory(this.store_info.id ,this.year.id , momentObj(this.lastSync).locale('en').format('YYYY-MM-DD HH:mm:ss')).subscribe(data =>{
             //console.log('getLogHistory' , data) 
             let res = data
             if (data['message'] != 'No record Found') {
               this.LogHistoryArr = res['data']
               this.LogHistoryLocalTempArr = this.LogHistoryArr
             }
            // //  check if log already exist in  LogHistoryLocalTempArr
            // //console.log('beforre this.LogHistoryLocalArr',this.LogHistoryLocalTempArr)
            // for (let index = 0; index < this.LogHistoryLocalTempArr.length; index++) {
            //   const element = this.LogHistoryLocalTempArr[index];
            //   let flt = this.LogHistoryLocalArr.filter(x=>x.logRef == element.logRef && +x.logStatus == 1)
            //   if(flt.length > 0){
            //     this.LogHistoryLocalTempArr = this.LogHistoryLocalTempArr.filter(x=>x.logRef != element.logRef)
            //    }
            //  }


             //console.log('after this.LogHistoryLocalArr',this.LogHistoryLocalTempArr)
              if( this.LogHistoryLocalTempArr.length > 0){
                // this.prepareSync()
               } else {
                  //console.log('no upadates')
               }

             //old logic

            // // compare logHistory with local logHistory
            // //flt locallogHistory by status = 1
            // if(this.LogHistoryLocalArr.length > 0){
            //  //console.log('beforre this.LogHistoryLocalArr',this.LogHistoryLocalArr)
            //   this.LogHistoryLocalArr = this.LogHistoryLocalArr.filter(x=>+x.logStatus == 0)
            //   //console.log('flt this.LogHistoryLocalArr',this.LogHistoryLocalArr)
            // }
            // push new  log localy
            // if( this.LogHistoryArr.length > 0){
            //   for (let index = 0; index < this.LogHistoryArr.length; index++) {
            //     const element = this.LogHistoryArr[index];
            //    //console.log('before flt = this',this.LogHistoryLocalArr) 
            //    let flt = this.LogHistoryLocalArr.filter(x=>x.logRef == element.logRef)
            //    //console.log('after flt = this.LogHistoryLocalArr',flt)
            //     if(flt.length == 0){
            //       this.LogHistoryLocalArr.push(element)
            //     }
            //   }
            // }
            // this.LogHistoryLocalArr = this.LogHistoryLocalArr.filter(x=>+x.logStatus == 0)
            // //console.log('this.LogHistoryLocalArr.length > 0',this.LogHistoryLocalArr)
            // if( this.LogHistoryLocalArr.length > 0){
            //   this.prepareSync()
            //  } else {
            //     //console.log('no upadates')
            //  } 
          },
          (err)=>{
    
          },()=>{
           
          }
          )
            }
           
          })
       
         }, 60000);
       // clearInterval(this.id); 
    }

    prepareStep1(){
      for (let index = 0; index < this.LogHistoryLocalTempArr.length; index++) {
        const element = this.LogHistoryLocalTempArr[index];
        // customers
        if (element.typee.includes('customer') == true) {
          let subArr: Array<any> = []
          this.storage.get('sub_accountSales').then((response) => {
            if (response) {
              subArr = response
              if (element.typee == 'insert customer') {
                element.desc = "قام " + element.full_name + " - بإضافة عميل جديد" + JSON.parse(element.logToken).sub_name
                subArr.push(JSON.parse(element.logToken))
              } else if (element.typee == 'update customer') {
                element.desc = "قام " + element.full_name + " - بتعديل البيانات الشخصية للعميل  " + JSON.parse(element.logToken).sub_name
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.id == JSON.parse(element.logToken).id) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete customer') {
                element.desc = "قام " + element.full_name + " - بحذف العميل " + JSON.parse(element.logToken).sub_name
                subArr = subArr.filter(x => x.id != JSON.parse(element.logToken).id)
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
  
              // set to storage
              this.storage.set('sub_accountSales', subArr).then((response) => {
                //console.log('sub_accountSales ', response)
              });
  
            }
          });
        }
  
        // supplier
        if (element.typee.includes('supplier') == true) {
          let subArr: Array<any> = []
          this.storage.get('sub_accountPurch').then((response) => {
            if (response) {
              subArr = response
              if (element.typee == 'insert supplier') {
                element.desc = "قام " + element.full_name + " - بإضافة مورد جديد" + JSON.parse(element.logToken).sub_name
                subArr.push(JSON.parse(element.logToken))
              } else if (element.typee == 'update supplier') {
                element.desc = "قام " + element.full_name + " - بتعديل البيانات الشخصية للمورد  " + JSON.parse(element.logToken).sub_name
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.id == JSON.parse(element.logToken).id) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete supplier') {
                element.desc = "قام " + element.full_name + " - بحذف المورد " + JSON.parse(element.logToken).sub_name
                subArr = subArr.filter(x => x.id != JSON.parse(element.logToken).id)
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
              // set to storage
              this.storage.set('sub_accountPurch', subArr).then((response) => {
                //console.log('sub_accountPurch ', response)
              });
            }
          });
        }
  
        // firstq
        if (element.typee.includes('firstq') == true) {
          let subArr: Array<any> = []
          this.storage.get('firstq').then((response) => {
            if (response) {
              subArr = response
              if (element.typee == 'insert firstq') {
                element.desc = "قام " + element.full_name + " - بإضافة كمية افتتاحية لصنف جديد" + JSON.parse(element.logToken).item_name
                subArr.push(JSON.parse(element.logToken))
              } else if (element.typee == 'update firstq') {
                element.desc = "قام " + element.full_name + " - بتعديل الكمية افتتاحية الصنف  " + JSON.parse(element.logToken).item_name
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.item_id == JSON.parse(element.logToken).item_id) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete firstq') {
                element.desc = "قام " + element.full_name + " - بحذف الكمية افتتاحية الصنف " + JSON.parse(element.logToken).item_name
                subArr = subArr.filter(x => x.item_id != JSON.parse(element.logToken).item_id)
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
              // set to storage
              this.storage.set('firstq', subArr).then((response) => {
                //console.log('firstq set', response)
              });
            }
          });
        }
  
        // item
        if (element.typee.includes('item') == true) {
          let subArr: Array<any> = []
          this.storage.get('itemsLocal').then((response) => {
            if (response) {
              subArr = response
              //console.log('subArr = response ', subArr)
              if (element.typee == 'insert item') {
                element.desc = "قام " + element.full_name + " - بإضافة صنف جديد" + JSON.parse(element.logToken).item_name
                subArr.push(JSON.parse(element.logToken))
                //console.log('new item pushed ', subArr ,' item pushed ',JSON.parse(element.logToken))
              } else if (element.typee == 'update item') {
                element.desc = "قام " + element.full_name + " - بتعديل بيانات الصنف  " + JSON.parse(element.logToken).item_name
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.id == JSON.parse(element.logToken).id) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete item') {
                element.desc = "قام " + element.full_name + " - بحذف الصنف " + JSON.parse(element.logToken).item_name
                subArr = subArr.filter(x => x.id != JSON.parse(element.logToken).id)
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
              // set to storage
              //console.log('// set to storage',subArr )
              this.storage.set('itemsLocal', subArr).then((response) => {
                //console.log('itemsLocal to storage', response)
              });
            }
          });
        }
   
        // sales
        if (element.typee.includes('sales') == true) {
          //console.log('sales includ case 1')
          let subArr: Array<any> = []
          this.storage.get('sales').then((response) => {
            if (response) {
              subArr = response
              //console.log('element' ,element.logToken)
              let parseData = JSON.parse(element.logToken)
              //console.log(parseData) 
              let id =  parseData[0].payInvo.cust_id
              let fltsub_name = this.sub_accountSales.filter(x => +x.id == +id)
              //console.log(this.sub_accountSales ,'fltsub_name' ,fltsub_name , JSON.parse(element.logToken)[0].cust_id)
             
              if (element.typee == 'insert sales') {
                element.desc = "قام " + element.full_name + " - بإضافة فاتورة مبيعات" + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).tot_pr
                subArr.push(JSON.parse(element.logToken))
              } else if (element.typee == 'update sales') {
                element.desc = "قام " + element.full_name + " - بتعديل  فاتورة مبيعات  " + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).tot_pr
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.pay_ref == JSON.parse(element.logToken).pay_ref) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete sales') {
                element.desc = "قام " + element.full_name + " -بحذف فاتورة مبيعات  " + fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).tot_pr
                subArr = subArr.filter(x => x.pay_ref != JSON.parse(element.logToken).pay_ref)
              
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
              // set to storage
              //console.log('sales subArr 1' ,subArr)
              this.storage.set('sales', subArr).then((response) => {
                //console.log('sales ', response)
              });
            }
          });
        }
  
        // purchase
        if (element.typee.includes('purchase') == true) {
          let subArr: Array<any> = []
          this.storage.get('purchase').then((response) => {
            if (response) {
              subArr = response
              let fltsub_name = this.sub_accountPurch.filter(x => x.id == JSON.parse(element.logToken).cust_id)
              if (element.typee == 'insert purchase') {
                element.desc = "قام " + element.full_name + " - بإضافة فاتورة مشتريات" + fltsub_name[0].sub_name  + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).tot_pr
                subArr.push(JSON.parse(element.logToken))
  
              } else if (element.typee == 'update purchase') {
                element.desc = "قام " + element.full_name + " - بتعديل  فاتورة مشتريات  " +  fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).tot_pr
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.pay_ref == JSON.parse(element.logToken).pay_ref) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete purchase') {
                element.desc = "قام " + element.full_name + " -بحذف فاتورة مشتريات  " +  fltsub_name[0].sub_name + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).tot_pr
                subArr = subArr.filter(x => x.pay_ref != JSON.parse(element.logToken).pay_ref)
  
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
              // set to storage
              this.storage.set('purchase', subArr).then((response) => {
                //console.log('purchase ', response)
              });
            }
          });
        }
  
        // journal
        if (element.typee.includes('journal') == true) {
          let subArr: Array<any> = []
          this.storage.get('journal').then((response) => {
            if (response) {
              subArr = response
              let sub_name = this.sub_accountPurch.filter(x => x.id == JSON.parse(element.logToken).cust_id)
              if (element.typee == 'insert journal') {
                element.desc = "قام " + element.full_name + " بإضافة  " + JSON.parse(element.logToken).j_type + " بتاريخ : " + JSON.parse(element.logToken).j_date + " - بقيمة: " + JSON.parse(element.logToken).j_pay + " " + JSON.parse(element.logToken).standard_details
                subArr.push(JSON.parse(element.logToken))
  
              } else if (element.typee == 'update journal') {
                element.desc = "قام " + element.full_name + " بتعديل  " + JSON.parse(element.logToken).j_type + " بتاريخ : " + JSON.parse(element.logToken).j_date + " - بقيمة: " + JSON.parse(element.logToken).j_pay + " " + JSON.parse(element.logToken).standard_details
  
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.j_ref == JSON.parse(element.logToken).j_ref) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete purchase') {
                element.desc = "قام " + element.full_name + " بحذف  " + JSON.parse(element.logToken).j_type + " بتاريخ : " + JSON.parse(element.logToken).j_date + " - بقيمة: " + JSON.parse(element.logToken).j_pay + " " + JSON.parse(element.logToken).standard_details
                subArr = subArr.filter(x => x.j_ref != JSON.parse(element.logToken).j_ref)
  
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
              // set to storage
              this.storage.set('journal', subArr).then((response) => {
                //console.log('journal ', response)
              });
            }
          });
        }
  
        // tswia
        if (element.typee.includes('tswia') == true) {
          let subArr: Array<any> = []
          this.storage.get('tswia').then((response) => {
            if (response) {
              subArr = response
              if (element.typee == 'insert tswia') {
                element.desc = "قام " + element.full_name + " بإضافة سجل تسوية جردية  " + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي التسوية : " + JSON.parse(element.logToken).tot_pr
  
                subArr.push(JSON.parse(element.logToken))
  
              } else if (element.typee == 'update tswia') {
                element.desc = "قام " + element.full_name + " بتعديل سجل تسوية جردية  " + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي التسوية : " + JSON.parse(element.logToken).tot_pr
  
                for (let r = 0; r < subArr.length; r++) {
                  const elem = subArr[r];
                  if (elem.pay_ref == JSON.parse(element.logToken).pay_ref) {
                    subArr[r] = JSON.parse(element.logToken)
                  }
                }
              } else if (element.typee == 'delete tswia') {
                element.desc = "قام " + element.full_name + " بحذف  " + " بتعديل سجل تسوية جردية  " + " بتاريخ : " + JSON.parse(element.logToken).pay_date + " - اجمالي التسوية : " + JSON.parse(element.logToken).tot_pr
              }
              //  change logStatus to 1 to be egnoring when  run syncFunct()
              element.logStatus = 1
              // set to storage
              this.storage.set('tswia', subArr).then((response) => {
                //console.log('tswia ', response)
              });
            }
          });
        }
      }
    }


    // async prepareSync() {
    //   await this.prepareStep1() 
    //   //prepare items to get current QTY
    //   this.prepareItemsLocal()
    //   //prepare customer and supplier 
    // }



  //    async  prepareItemsLocal(){ 
  //       let firstQuantityArr :Array<any> = []
  //       let salesQuantityArr  :Array<any> = [] 
  //       let tswiaQuantityArr :Array<any> = []
  //       let perchQuantityArr :Array<any> = []
  
  // // quantity
  //     //console.log('.storage.get(firstq')
  
  //     await  this.storage.get('firstq').then((response) => {
  //         if (response) {
  //           firstQuantityArr = response  
  //         }
  //       });
  //       //console.log('.storage.get(salse')

  //       await  this.storage.get('sales').then((response) => {
  //         if (response) {
  //           salesQuantityArr = response  
  //           //console.log('salesQuantityArr',salesQuantityArr )
  //         }
  //       });
  //       //console.log('.storage.get(purch')

  //       await  this.storage.get('purchase').then((response) => {
  //         if (response) {
  //           perchQuantityArr = response  
  //         }
  //       });
  //       //console.log('.storage.get(tswia')

  //       await this.storage.get('tswia').then((response) => {
  //         if (response) {
  //           tswiaQuantityArr = response  
  //         }
  //       });

        
  //       //console.log('//for loop to prepare ' , this.itemsLocal)
  //       await  this.storage.get('itemsLocal').then((response) => {
  //         if (response) {
  //           let arr = response 
  //           arr.forEach(element => { 
  //             // firstQuantityArr 
  //             let fltfirst = firstQuantityArr.filter(x=>+x.item_id == +element.id)
  //             //console.log('fltfirst',fltfirst)
  //             if(fltfirst.length == 0){
  //               element.firstQuantity = 0 
  //             }else{ 
  //               element.firstQuantity = fltfirst[0].quantity  
  //             }
            
  //             // salesQuantityArr 
  //             let itemListSalse :Array<any>=[]
  //             for (let index = 0; index < salesQuantityArr.length; index++) {
  //               const el = salesQuantityArr[index];
              
  //               let f = []
  //                 f = el['itemList'].filter(x=>x.item_id == element.id)
  //               if(f.length>0){
  //               f.forEach(elmh => {
  //                 itemListSalse.push(elmh)
  //               });
  //               }
  //             }  

  //             if(itemListSalse.length>0){
  //             element.salesQuantity =  itemListSalse.reduce( (acc, obj)=> { return acc + +obj.quantity; }, 0);
  //             }else{
  //               element.salesQuantity =0
  //             }
  //             // perchQuantityArr 
  //             let itemListPurch :Array<any>=[]
  //             for (let index = 0; index < perchQuantityArr.length; index++) {
  //               const elp = perchQuantityArr[index];
  //               let f = []
  //                 f = elp['itemList'].filter(x=>x.item_id == element.id)
                
  //               if(f.length>0){
  //               f.forEach(elmh => {
  //                 itemListPurch.push(elmh)
  //               });
  //               }
  //             }  

  //             if(itemListPurch.length>0){
  //             element.perchQuantity =  itemListPurch.reduce( (acc, obj)=> { return acc + +obj.quantity; }, 0);
  //             }else{
  //               element.perchQuantity = 0
  //             }
  
  //             // tswiaQuantityArr  
  //             //  tswia_details.availQty - tswia_details.qtyReal
  //             let itemListTswia :Array<any>=[]
  //             for (let index = 0; index < tswiaQuantityArr.length; index++) {
  //               const elp = tswiaQuantityArr[index];
  //               let f = elp.itemList.filter(x=>x.item_id == element.id)
  //               if(f.length>0){
  //               f.forEach(elmh => {
  //               // tswia_details.availQty - tswia_details.qtyReal
  //                 elmh.qty = +elmh.availQty - +elmh.qtyReal
  //                 itemListTswia.push(elmh)
  //               });
  //               }
  //             }  

  //             if(itemListTswia.length>0){
  //             element.tswiaQuantity =  itemListTswia.reduce( (acc, obj)=> { return acc + +obj.qty; }, 0);
  //             }else{
  //               element.tswiaQuantity = 0
  //             }
  


  //             // get tots
  //             if(+element.tswiaQuantity > 0){
  //               element.salesQuantity = +element.salesQuantity + +element.tswiaQuantity 
      
  //             }else if(+element.tswiaQuantity < 0){
  //               element.perchQuantity = +element.perchQuantity + Math.abs(+element.tswiaQuantity) 
  //             }
      
  //             element.quantity = (+element.perchQuantity + +element.firstQuantity) - +element.salesQuantity
          
  //           // lastSoldDate 
  //           // IFNULL((SELECT MAX(pay.pay_date) FROM pay_details INNER JOIN pay ON pay_details.pay_ref = pay.pay_ref WHERE  pay_details.item_id = items.id AND pay_details.store_id = :store_id ), 0) AS lastSoldDate,
  //           let fltMax = salesQuantityArr.filter(x=>x.itemList.item_id == element.id )
  //           element.lastSoldDate= fltMax.reduce((acc, shot) => acc = acc > shot.pay_date ? acc : shot.pay_date, 0);
  //           // IFNULL((SELECT MAX(pay_details.quantity) FROM pay_details INNER JOIN pay ON pay_details.pay_ref = pay.pay_ref WHERE  pay_details.item_id = items.id AND pay_details.store_id = :store_id And pay.pay_date = lastSoldDate), 0) AS lastSoldQty
  //           // lastSoldQty
  //           element.lastSoldQty = fltMax.reduce((acc, shot) => acc = acc > shot.itemList.quantity ? acc : shot.itemList.quantity, 0);
              
  //           });
            
  //               //save itemLocal  
  //               //console.log('//save itemLocal ' ,arr)
  //               this.storage.set('itemsLocal',arr).then((response) => {
  //                   //push changes to app using behaviorSubj
  //                   this.changeItems(arr)  
  //               })

  //               this.changeNotif(this.LogHistoryLocalTempArr) 
  //               //save loghistory local
  //               this.LogHistoryLocalTempArr = [] 
  //               this.storage.set("LogHistoryLocalTemp",this.LogHistoryLocalTempArr).then((response) => {
  //                 // this.LogHistoryLocalTempArr.forEach(element => {
  //                 //   this.LogHistoryLocalArr.push(element)
  //                 // });
                  
  //                 //   this.storage.set("LogHistoryLocal",this.LogHistoryLocalArr).then((response) => {
  //                 //     this.LogHistoryLocalTempArr = [] 
  //                 // })
  //               })
                
  //               // this.lastSync = now => save to local
  //               let dt = new Date()
  //               this.lastSync= momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss')
  //               this.storage.set("lastSync",this.lastSync).then((response) => {

  //               })

  //         } 
          
  //       });
      
  
  //    }

 

    //new logic

 
    syncFunctNew(){ 
      this.LogHistoryLocalTempArr =[]
      //console.log('LogHistoryLocalTempArr',this.LogHistoryLocalTempArr) 
       this.intrev =   setInterval(() => { 
        this.storage.get('lastSync').then((response) => {
          if(response){
          this.lastSync = response
          //console.log('this.lastSync syncFunct' , this.lastSync)
          this.getLogHistory(this.store_info.id ,this.year.id , momentObj(this.lastSync).locale('en').format('YYYY-MM-DD HH:mm:ss')).subscribe(data =>{
           //console.log('getLogHistory' , data) 
           let res = data
           if (data['message'] != 'No record Found') {
            this.LogHistoryLocalTempArr =  res['data']   
           }
           //console.log(this.LogHistoryLocalArr ,'befor this.LogHistoryLocalArr',this.LogHistoryLocalTempArr)
           let flt :Array<any> = []
           for (let index = 0; index < this.LogHistoryLocalTempArr.length; index++) {
            const element = this.LogHistoryLocalTempArr[index];
            if (this.LogHistoryLocalArr.some(e => +e.id === +element.id) == false) {
              //console.log('found in arr' ,element)
             flt.push(element)
            } 
           }
           this.LogHistoryLocalTempArr = flt
            //console.log('after this.LogHistoryLocalArr',this.LogHistoryLocalTempArr)
            if( this.LogHistoryLocalTempArr.length > 0){
              this.prepareStep1New()
             } else {
              //console.log('no upadates')
             }
        },
        (err)=>{
  
        },()=>{
         
        }
        )
          }
         
        })
     
       }, 60000);
     // clearInterval(this.id);
    
  
   }

    prepareStep1New() {
      for (let index = 0; index < this.LogHistoryLocalTempArr.length; index++) {
        const element = this.LogHistoryLocalTempArr[index];
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
            let sn :any 
          if(fltsub_name.length== 0 ){
            sn = "undefined" 
          }else{
            sn = fltsub_name[0].sub_name
          }
          if (element.typee == 'insert sales') {
            element.desc = "قام " + element.full_name + " - بإضافة فاتورة مبيعات " + sn + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr

          } else if (element.typee == 'update sales') {
            element.desc = "قام " + element.full_name + " - بتعديل  فاتورة مبيعات  " + sn + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr

          } else if (element.typee == 'delete sales') {
            element.desc = "قام " + element.full_name + " -بحذف فاتورة مبيعات  " +  sn + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr

          }
          //  change logStatus to 1 to be egnoring when  run syncFunct()
          // element.logStatus = 1 

        }

        // purchase
        if (element.typee.includes('purchase') == true) {
          let parseData = JSON.parse(element.logToken)
          //console.log(parseData)
          let id = parseData.payInvo.cust_id
          let fltsub_name = this.sub_accountPurch.filter(x => +x.id == +id)

          let sn :any 
          if(fltsub_name.length== 0 ){
            sn = "undefined" 
          }else{
            sn = fltsub_name[0].sub_name
          }
          if (element.typee == 'insert purchase') {
            element.desc = "قام " + element.full_name + " - بإضافة فاتورة مشتريات"  + sn + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr
          } else if (element.typee == 'update purchase') {
            element.desc = "قام " + element.full_name + " - بتعديل  فاتورة مشتريات  " + sn + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr
          } else if (element.typee == 'delete purchase') {
            element.desc = "قام " + element.full_name + " -بحذف فاتورة مشتريات  " + sn + " بتاريخ : " + JSON.parse(element.logToken).payInvo.pay_date + " - اجمالي الفاتورة : " + JSON.parse(element.logToken).payInvo.tot_pr
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
          //  change logStatus to 1 to be egnoring when  run syncFunct()
          //element.logStatus = 1
          // set to storage

        }


      }
      
      //  
      if(this.LogHistoryLocalTempArr.length> 0){
        //console.log('notifArr') 
        let items = 0 
        let both = 0
        for (let index = 0; index < this.LogHistoryLocalTempArr.length; index++) {
          const element = this.LogHistoryLocalTempArr[index];
          if(element.typee.includes('sales') == true || element.typee.includes('journal') == true){
            both = both + 1 
          }else if(element.typee.includes('sales') == false && element.typee.includes('journal') == false){
            items = items + 1  
          } 
        }
        //
        if(items > 0){
          this.getStockItems('sync item') 
        }else if( both > 0){
          this.bothItemAndAccount('sync both')
        }     
      } else {
        //console.log('no updates') 
      }    
    }


  getStockItems(status?) { 
      //console.log('this.year.id',this.year.id) 
        this.stockItems(this.store_info.id,this.year.id).subscribe(data => {
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
          if(status == 'sync item'){  
            this.afterSync()  
          }
        }, (err) => { 
          //console.log(err);
        },
        () => {

        }     
        )
  } 
 
      getSubBalance(){ 
        this.sub_accountSales.forEach(element => {
          element.sub_balance = 0
          let debitTot = +element.changeeTot + +element.fromDebitTot
          let creditTot = +element.purchChangeeTot + +element.toCreditTot
          if (debitTot == creditTot) {
            element.sub_balance = 0 
           }else if(debitTot > creditTot ){ 
             element.sub_balance = (+debitTot - +creditTot).toFixed(2) 
           }else if(creditTot > debitTot ){
             element.sub_balance = (+creditTot - +debitTot).toFixed(2)  
           }
        });   
       }

    getSalesAccount(status?){ 
      this.getSalesAccounts(this.store_info.id , this.year.id).subscribe(data =>{
         let res = data
         this.sub_accountSales = res ['data']
         //console.log(this.sub_accountSales)
         this.getSubBalance() 
         if(status == 'sync both'){
          this.storage.set('sub_accountSales' , this.sub_accountSales).then((response) => {
            if (response) { 
               
            }
           }); 
         }
         
       }, (err) => {
       //console.log(err);
     }) 
     
    } 

    async bothItemAndAccount(status){
      await this.getStockItems()
      await this.getSalesAccount(status) 
      await this.afterSync()  
    }

    afterSync(){
      //get items from local incase getStock nt performed because 
      this.storage.get('itemsLocal' ).then((response) => {
        this.items= response 
      });


      for (let index = 0; index < this.LogHistoryLocalTempArr.length; index++) {
        const element = this.LogHistoryLocalTempArr[index];  
          this.LogHistoryLocalArr.push(element) 
       }
       
       let dt = new Date()
       this.lastSync = momentObj(dt).locale('en').format('YYYY-MM-DD HH:mm:ss')
       this.storage.set("lastSync", this.lastSync).then((response) => { 

       })


       this.LogHistoryLocalArr = this.LogHistoryLocalArr.sort((a, b) => (+a.id > +b.id) ? -1 : 1);
       this.storage.set('LogHistoryLocal',this.LogHistoryLocalArr).then((response) => {
        //console.log('finish',this.LogHistoryLocalArr) 
        //console.log('finish2',[this.LogHistoryLocalTempArr , this.items , this.sub_accountSales ]) 
         this.changeNotif([this.LogHistoryLocalTempArr , this.items , this.sub_accountSales ]) 

       })  
     }
    
 
  }