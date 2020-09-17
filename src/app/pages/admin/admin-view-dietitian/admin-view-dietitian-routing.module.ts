import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminViewDietitianPage } from './admin-view-dietitian.page';

const routes: Routes = [
  {
    path: '',
    component: AdminViewDietitianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminViewDietitianPageRoutingModule {}
