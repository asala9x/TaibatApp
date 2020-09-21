import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DietitianDetailsPage } from './dietitian-details.page';

const routes: Routes = [
  {
    path: '',
    component: DietitianDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DietitianDetailsPageRoutingModule {}
