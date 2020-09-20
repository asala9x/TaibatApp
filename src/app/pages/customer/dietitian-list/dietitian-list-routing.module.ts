import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DietitianListPage } from './dietitian-list.page';

const routes: Routes = [
  {
    path: '',
    component: DietitianListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DietitianListPageRoutingModule {}
