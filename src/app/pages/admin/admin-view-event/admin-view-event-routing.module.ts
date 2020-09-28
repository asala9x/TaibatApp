import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminViewEventPage } from './admin-view-event.page';

const routes: Routes = [
  {
    path: '',
    component: AdminViewEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminViewEventPageRoutingModule {}
