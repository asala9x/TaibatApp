import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerTabPageRoutingModule } from './customer-tab-routing.module';

import { CustomerTabPage } from './customer-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerTabPageRoutingModule
  ],
  declarations: [CustomerTabPage]
})
export class CustomerTabPageModule {}
