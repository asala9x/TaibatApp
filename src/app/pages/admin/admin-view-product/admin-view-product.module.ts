import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminViewProductPageRoutingModule } from './admin-view-product-routing.module';

import { AdminViewProductPage } from './admin-view-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminViewProductPageRoutingModule
  ],
  declarations: [AdminViewProductPage]
})
export class AdminViewProductPageModule {}
