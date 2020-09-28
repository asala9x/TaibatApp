import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminViewProductPage } from './admin-view-product.page';

const routes: Routes = [
  {
    path: '',
    component: AdminViewProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminViewProductPageRoutingModule {}
