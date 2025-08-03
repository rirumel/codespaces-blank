import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelfPrepTestPage } from './self-prep-test.page';

const routes: Routes = [
  {
    path: '',
    component: SelfPrepTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelfPrepTestPageRoutingModule {}
