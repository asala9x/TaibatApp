import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminViewAdvicePage } from './admin-view-advice.page';

const routes: Routes = [
  {
    path: '',
    component: AdminViewAdvicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminViewAdvicePageRoutingModule {}
