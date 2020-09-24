import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'customer-tab',
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
    path: 'admin-view-dietitian',
    loadChildren: () => import('./pages/admin/admin-view-dietitian/admin-view-dietitian.module').then( m => m.AdminViewDietitianPageModule)
  },
  
  {
  path: 'admin-add-dietitian',
  loadChildren: () => import('./pages/admin/admin-add-dietitian/admin-add-dietitian.module').then( m => m.AdminAddDietitianPageModule)
  },
  {
    path: 'dietitian-details',
    loadChildren: () => import('./pages/customer/dietitian-details/dietitian-details.module').then( m => m.DietitianDetailsPageModule)
  },
  {
    path: 'customer-tab',
    loadChildren: () => import('./pages/tabs/customer-tab/customer-tab.module').then( m => m.CustomerTabPageModule)
  },  {
    path: 'admin-tab',
    loadChildren: () => import('./pages/tabs/admin-tab/admin-tab.module').then( m => m.AdminTabPageModule)
  },

  
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
