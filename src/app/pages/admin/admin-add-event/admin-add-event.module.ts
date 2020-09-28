import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAddEventPageRoutingModule } from './admin-add-event-routing.module';

import { AdminAddEventPage } from './admin-add-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminAddEventPageRoutingModule
  ],
  declarations: [AdminAddEventPage]
})
export class AdminAddEventPageModule {}
