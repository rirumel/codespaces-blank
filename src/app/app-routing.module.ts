import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'questions/:roleId', loadChildren: () => import('./pages/questions/questions.module').then(m => m.QuestionsPageModule) },
  { path: 'leaderboard', loadChildren: () => import('./pages/leaderboard/leaderboard.module').then(m => m.LeaderboardPageModule) },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'self-prep',
    loadChildren: () => import('./pages/self-prep/self-prep.module').then( m => m.SelfPrepPageModule)
  },
  {
    path: 'database-prep',
    loadChildren: () => import('./pages/database-prep/database-prep.module').then( m => m.DatabasePrepPageModule)
  },
  {
    path: 'self-prep-test',
    loadChildren: () => import('./pages/self-prep-test/self-prep-test.module').then( m => m.SelfPrepTestPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
