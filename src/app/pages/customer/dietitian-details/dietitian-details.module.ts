import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietitianDetailsPageRoutingModule } from './dietitian-details-routing.module';

import { DietitianDetailsPage } from './dietitian-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DietitianDetailsPageRoutingModule
  ],
  declarations: [DietitianDetailsPage]
})
export class DietitianDetailsPageModule {}
