import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietitianListPageRoutingModule } from './dietitian-list-routing.module';

import { DietitianListPage } from './dietitian-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DietitianListPageRoutingModule
  ],
  declarations: [DietitianListPage]
})
export class DietitianListPageModule {}
