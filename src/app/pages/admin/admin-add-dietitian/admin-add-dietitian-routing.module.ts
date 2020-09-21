import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAddDietitianPage } from './admin-add-dietitian.page';

const routes: Routes = [
  {
    path: '',
    component: AdminAddDietitianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAddDietitianPageRoutingModule {}
