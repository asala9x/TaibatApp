import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerPopoverPage } from './customer-popover.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPopoverPageRoutingModule {}
