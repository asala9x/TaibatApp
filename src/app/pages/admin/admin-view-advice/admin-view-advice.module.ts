import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminViewAdvicePageRoutingModule } from './admin-view-advice-routing.module';

import { AdminViewAdvicePage } from './admin-view-advice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminViewAdvicePageRoutingModule
  ],
  declarations: [AdminViewAdvicePage]
})
export class AdminViewAdvicePageModule {}
