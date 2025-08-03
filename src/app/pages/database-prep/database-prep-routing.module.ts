import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatabasePrepPage } from './database-prep.page';

const routes: Routes = [
  {
    path: '',
    component: DatabasePrepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatabasePrepPageRoutingModule {}
