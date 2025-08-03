import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelfPrepTestPageRoutingModule } from './self-prep-test-routing.module';

import { SelfPrepTestPage } from './self-prep-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelfPrepTestPageRoutingModule
  ],
  declarations: [SelfPrepTestPage]
})
export class SelfPrepTestPageModule {}
