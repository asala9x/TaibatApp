import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeopleRegisterPageRoutingModule } from './people-register-routing.module';

import { PeopleRegisterPage } from './people-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeopleRegisterPageRoutingModule
  ],
  declarations: [PeopleRegisterPage]
})
export class PeopleRegisterPageModule {}
