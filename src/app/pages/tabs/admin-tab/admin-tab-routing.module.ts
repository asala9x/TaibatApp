import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminTabPage } from './admin-tab.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTabPage,
    children:[ 
      {
        path: 'admin-view-dietitian',
        loadChildren: () => import('../../../pages/admin/admin-view-dietitian/admin-view-dietitian.module').then( m => m.AdminViewDietitianPageModule)
      },  
      {
        path: 'admin-view-event',
        loadChildren: () => import('../../../pages/admin/admin-view-event/admin-view-event.module').then( m => m.AdminViewEventPageModule)
      },
      {
        path: 'admin-view-advice',
        loadChildren: () => import('../../../pages/admin/admin-view-advice/admin-view-advice.module').then( m => m.AdminViewAdvicePageModule)
      },
      {
        path: 'admin-view-product',
        loadChildren: () => import('../../../pages/admin/admin-view-product/admin-view-product.module').then( m => m.AdminViewProductPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTabPageRoutingModule {}
