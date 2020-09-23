import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerTabPage } from './customer-tab.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerTabPage,
    children:[ 
      {
        path: 'dietitian-list',
        loadChildren: () => import('../../../pages/customer/dietitian-list/dietitian-list.module').then( m => m.DietitianListPageModule)
      },  
      {
        path: 'event-list',
        loadChildren: () => import('../../../pages/customer/event-list/event-list.module').then( m => m.EventListPageModule)
      },
      {
        path: 'advice',
        loadChildren: () => import('../../../pages/customer/advice/advice.module').then( m => m.AdvicePageModule)
      },
      {
        path: 'shop',
        loadChildren: () => import('../../../pages/customer/shop/shop.module').then( m => m.ShopPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerTabPageRoutingModule {}
