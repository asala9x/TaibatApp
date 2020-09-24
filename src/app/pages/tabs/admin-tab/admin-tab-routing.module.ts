import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminTabPage } from './admin-tab.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTabPageRoutingModule {}
