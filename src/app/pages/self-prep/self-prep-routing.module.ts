import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelfPrepPage } from './self-prep.page';

const routes: Routes = [
  {
    path: '',
    component: SelfPrepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelfPrepPageRoutingModule {}
