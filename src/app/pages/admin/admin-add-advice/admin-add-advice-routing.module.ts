import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAddAdvicePage } from './admin-add-advice.page';

const routes: Routes = [
  {
    path: '',
    component: AdminAddAdvicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAddAdvicePageRoutingModule {}
