import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatabasePrepPageRoutingModule } from './database-prep-routing.module';

import { DatabasePrepPage } from './database-prep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatabasePrepPageRoutingModule
  ],
  declarations: [DatabasePrepPage]
})
export class DatabasePrepPageModule {}
