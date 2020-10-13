import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/common/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/customer/register/register.module').then( m => m.RegisterPageModule)
  },
  {
  path: 'admin-add-dietitian',
  loadChildren: () => import('./pages/admin/admin-add-dietitian/admin-add-dietitian.module').then( m => m.AdminAddDietitianPageModule)
  },
  {
    path: 'admin-add-event',
    loadChildren: () => import('./pages/admin/admin-add-event/admin-add-event.module').then( m => m.AdminAddEventPageModule)
  },
  {
    path: 'dietitian-details',
    loadChildren: () => import('./pages/customer/dietitian-details/dietitian-details.module').then( m => m.DietitianDetailsPageModule)
  },
  {
    path: 'customer-tab',
    loadChildren: () => import('./pages/tabs/customer-tab/customer-tab.module').then( m => m.CustomerTabPageModule)
  },
  {
    path: 'admin-tab',
    loadChildren: () => import('./pages/tabs/admin-tab/admin-tab.module').then( m => m.AdminTabPageModule)
  },
  {
    path: 'admin-add-advice',
    loadChildren: () => import('./pages/admin/admin-add-advice/admin-add-advice.module').then( m => m.AdminAddAdvicePageModule)
  },
  {
    path: 'admin-add-product',
    loadChildren: () => import('./pages/admin/admin-add-product/admin-add-product.module').then( m => m.AdminAddProductPageModule)
  },
  {
    path: 'admin-view-dietitian',
    loadChildren: () => import('./pages/admin/admin-view-dietitian/admin-view-dietitian.module').then( m => m.AdminViewDietitianPageModule)
  },
  {
    path: 'event-details',
    loadChildren: () => import('./pages/customer/event-details/event-details.module').then( m => m.EventDetailsPageModule)
  },  {
    path: 'update-event',
    loadChildren: () => import('./pages/admin/update-event/update-event.module').then( m => m.UpdateEventPageModule)
  }



];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
