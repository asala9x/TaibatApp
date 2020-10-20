import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeopleRegisterPage } from './people-register.page';

const routes: Routes = [
  {
    path: '',
    component: PeopleRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRegisterPageRoutingModule {}
