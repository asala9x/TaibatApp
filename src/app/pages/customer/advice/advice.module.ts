import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvicePageRoutingModule } from './advice-routing.module';

import { AdvicePage } from './advice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdvicePageRoutingModule
  ],
  declarations: [AdvicePage]
})
export class AdvicePageModule {}
