import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAddEventPage } from './admin-add-event.page';

const routes: Routes = [
  {
    path: '',
    component: AdminAddEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAddEventPageRoutingModule {}
