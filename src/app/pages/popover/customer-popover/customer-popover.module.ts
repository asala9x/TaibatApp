import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPopoverPageRoutingModule } from './customer-popover-routing.module';

import { CustomerPopoverPage } from './customer-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerPopoverPageRoutingModule
  ],
  declarations: [CustomerPopoverPage]
})
export class CustomerPopoverPageModule {}
