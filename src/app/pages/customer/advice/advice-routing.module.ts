import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvicePage } from './advice.page';

const routes: Routes = [
  {
    path: '',
    component: AdvicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvicePageRoutingModule {}
