import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelfPrepPageRoutingModule } from './self-prep-routing.module';

import { SelfPrepPage } from './self-prep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelfPrepPageRoutingModule
  ],
  declarations: [SelfPrepPage]
})
export class SelfPrepPageModule {}
