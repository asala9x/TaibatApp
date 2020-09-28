import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminViewEventPageRoutingModule } from './admin-view-event-routing.module';

import { AdminViewEventPage } from './admin-view-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminViewEventPageRoutingModule
  ],
  declarations: [AdminViewEventPage]
})
export class AdminViewEventPageModule {}
