import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from './auth/auth-gaurd.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/pos-sales',
    pathMatch: 'full'
  },
  {
    path: 'folder/pos-sales',
    loadChildren: () => import('./pos-sales/pos-sales.module').then( m => m.PosSalesPageModule)
  },
  {
    path: 'folder/login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'folder/sales',
    loadChildren: () => import('./sales/sales.module').then( m => m.SalesPageModule), canActivate: [AuthGaurdService]
  },
  {
    path: 'folder/sales-record',
    loadChildren: () => import('./sales-record/sales-record.module').then( m => m.SalesRecordPageModule)
  },
  {
    path: 'folder/purchase',
    loadChildren: () => import('./purchase/purchase.module').then( m => m.PurchasePageModule)
  },
  {
    path: 'folder/purchase-record',
    loadChildren: () => import('./purchase-record/purchase-record.module').then( m => m.PurchaseRecordPageModule)
  },
  {
    path: 'folder/spends',
    loadChildren: () => import('./spends/spends.module').then( m => m.SpendsPageModule)
  },
  {
    path: 'folder/spends-recod',
    loadChildren: () => import('./spends-recod/spends-recod.module').then( m => m.SpendsRecodPageModule)
  },
  {
    path: 'folder/items',
    loadChildren: () => import('./items/items.module').then( m => m.ItemsPageModule)
  },
  {
    path: 'item-modal',
    loadChildren: () => import('./item-modal/item-modal.module').then( m => m.ItemModalPageModule)
  },
  {
    path: 'folder/sub-account',
    loadChildren: () => import('./sub-account/sub-account.module').then( m => m.SubAccountPageModule)
  },
  {
    path: 'folder/edit-sales',
    loadChildren: () => import('./edit-sales/edit-sales.module').then( m => m.EditSalesPageModule)
  },
  {
    path: 'print-modal',
    loadChildren: () => import('./print-modal/print-modal.module').then( m => m.PrintModalPageModule)
  },
  
  {
    path: 'folder/edit-perch',
    loadChildren: () => import('./edit-perch/edit-perch.module').then( m => m.EditPerchPageModule)
  },
  {
    path: 'items-serarch',
    loadChildren: () => import('./items-serarch/items-serarch.module').then( m => m.ItemsSerarchPageModule)
  },
  {
    path: 'fristq',
    loadChildren: () => import('./fristq/fristq.module').then( m => m.FristqPageModule)
  },
  {
    path: 'folder/firstq-modal',
    loadChildren: () => import('./firstq-modal/firstq-modal.module').then( m => m.FirstqModalPageModule)
  },
  {
    path: 'folder/settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'folder/items-report',
    loadChildren: () => import('./items-report/items-report.module').then( m => m.ItemsReportPageModule)
  },
  {
    path: 'folder/balance-sheet',
    loadChildren: () => import('./balance-sheet/balance-sheet.module').then( m => m.BalanceSheetPageModule)
  },
  {
    path: 'folder/statement',
    loadChildren: () => import('./statement/statement.module').then( m => m.StatementPageModule)
  },
  {
    path: 'account-modal',
    loadChildren: () => import('./account-modal/account-modal.module').then( m => m.AccountModalPageModule)
  },
  {
    path: 'folder/account-tree',
    loadChildren: () => import('./account-tree/account-tree.module').then( m => m.AccountTreePageModule)
  },
  {
    path: 'folder/cash',
    loadChildren: () => import('./cash/cash.module').then( m => m.CashPageModule)
  },
  {
    path: 'folder/cash2',
    loadChildren: () => import('./cash2/cash2.module').then( m => m.Cash2PageModule)
  },
  {
    path: 'folder/statement2',
    loadChildren: () => import('./statement2/statement2.module').then( m => m.Statement2PageModule)
  },
  {
    path: 'folder/spend-record2',
    loadChildren: () => import('./spend-record2/spend-record2.module').then( m => m.SpendRecord2PageModule)
  },
  {
    path: 'folder/balance-sheet2',
    loadChildren: () => import('./balance-sheet2/balance-sheet2.module').then( m => m.BalanceSheet2PageModule)
  },
  {
    path: 'folder/sub-account2',
    loadChildren: () => import('./sub-account2/sub-account2.module').then( m => m.SubAccount2PageModule)
  },
  {
    path: 'folder/notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'folder/cash3',
    loadChildren: () => import('./cash3/cash3.module').then( m => m.Cash3PageModule)
  },
  {
    path: 'folder/prch-order',
    loadChildren: () => import('./prch-order/prch-order.module').then( m => m.PrchOrderPageModule)
  },
  {
    path: 'folder/prch-order-record',
    loadChildren: () => import('./prch-order-record/prch-order-record.module').then( m => m.PrchOrderRecordPageModule)
  },
  {
    path: 'folder/edit-prch-order',
    loadChildren: () => import('./edit-prch-order/edit-prch-order.module').then( m => m.EditPrchOrderPageModule)
  },
  {
    path: 'folder/tswia',
    loadChildren: () => import('./tswia/tswia.module').then( m => m.TswiaPageModule)
  },
  {
    path: 'folder/tswia-record',
    loadChildren: () => import('./tswia-record/tswia-record.module').then( m => m.TswiaRecordPageModule)
  },
  {
    path: 'folder/edit-tswia',
    loadChildren: () => import('./edit-tswia/edit-tswia.module').then( m => m.EditTswiaPageModule)
  },
  {
    path: 'folder/user-activity',
    loadChildren: () => import('./user-activity/user-activity.module').then( m => m.UserActivityPageModule)
  },
  {
    path: 'folder/sales-mob',
    loadChildren: () => import('./sales-mob/sales-mob.module').then( m => m.SalesMobPageModule)
  },
  {
    path: 'folder/purchase-mob',
    loadChildren: () => import('./purchase-mob/purchase-mob.module').then( m => m.PurchaseMobPageModule)
  },
  {
    path: 'folder/edit-purchase-mob',
    loadChildren: () => import('./edit-purchase-mob/edit-purchase-mob.module').then( m => m.EditPurchaseMobPageModule)
  },
  {
    path: 'folder/edit-sales-mob',
    loadChildren: () => import('./edit-sales-mob/edit-sales-mob.module').then( m => m.EditSalesMobPageModule)
  },
  {
    path: 'folder/pos-sales',
    loadChildren: () => import('./pos-sales/pos-sales.module').then( m => m.PosSalesPageModule)
  },
  {
    path: 'pos-reciept',
    loadChildren: () => import('./pos-reciept/pos-reciept.module').then( m => m.PosRecieptPageModule)
  },
  {
    path: 'folder/salessnd',
    loadChildren: () => import('./salessnd/salessnd.module').then( m => m.SalessndPageModule)
  },
  {
    path: 'folder/purchsnd',
    loadChildren: () => import('./purchsnd/purchsnd.module').then( m => m.PurchsndPageModule)
  },
  {
    path: 'folder/purchsndrecord',
    loadChildren: () => import('./purchsndrecord/purchsndrecord.module').then( m => m.PurchsndrecordPageModule)
  },
  {
    path: 'folder/salessndrecord',
    loadChildren: () => import('./salessndrecord/salessndrecord.module').then( m => m.SalessndrecordPageModule)
  },
  {
    path: 'folder/editsalessnd',
    loadChildren: () => import('./editsalessnd/editsalessnd.module').then( m => m.EditsalessndPageModule)
  },
  {
    path: 'folder/editpurchsnd',
    loadChildren: () => import('./editpurchsnd/editpurchsnd.module').then( m => m.EditpurchsndPageModule)
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
