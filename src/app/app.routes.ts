import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'auth',
    loadChildren: () => import('./auth').then((m) => m.routes),
  },
  {
    path: 's',
    loadChildren: () => import('./secure').then((m) => m.routes),
  },
  { path: '**', redirectTo: 'auth/login' },
];
