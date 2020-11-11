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
  },
  {
    path: 'update-event',
    loadChildren: () => import('./pages/admin/update-event/update-event.module').then( m => m.UpdateEventPageModule)
  },
  {
    path: 'product-details',
    loadChildren: () => import('./pages/customer/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'basket',
    loadChildren: () => import('./pages/customer/basket/basket.module').then( m => m.BasketPageModule)
  },
  {
    path: 'people-register',
    loadChildren: () => import('./pages/admin/people-register/people-register.module').then( m => m.PeopleRegisterPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./pages/customer/location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./pages/customer/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/customer/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'popover-component',
    loadChildren: () => import('./pages/popover/popover-component/popover-component.module').then( m => m.PopoverComponentPageModule)
  },  {
    path: 'customer-popover',
    loadChildren: () => import('./pages/popover/customer-popover/customer-popover.module').then( m => m.CustomerPopoverPageModule)
  }






];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
