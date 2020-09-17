import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminViewDietitianPageRoutingModule } from './admin-view-dietitian-routing.module';

import { AdminViewDietitianPage } from './admin-view-dietitian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminViewDietitianPageRoutingModule
  ],
  declarations: [AdminViewDietitianPage]
})
export class AdminViewDietitianPageModule {}
