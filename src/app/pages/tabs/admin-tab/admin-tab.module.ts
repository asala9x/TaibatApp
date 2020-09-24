import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminTabPageRoutingModule } from './admin-tab-routing.module';

import { AdminTabPage } from './admin-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminTabPageRoutingModule
  ],
  declarations: [AdminTabPage]
})
export class AdminTabPageModule {}
