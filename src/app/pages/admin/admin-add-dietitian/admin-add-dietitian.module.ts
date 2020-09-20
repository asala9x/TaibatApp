import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAddDietitianPageRoutingModule } from './admin-add-dietitian-routing.module';

import { AdminAddDietitianPage } from './admin-add-dietitian.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminAddDietitianPageRoutingModule
  ],
  declarations: [AdminAddDietitianPage]
})
export class AdminAddDietitianPageModule {}
