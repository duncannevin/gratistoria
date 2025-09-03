import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component').then(c => c.AuthComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadComponent: () => import('./login.component').then(c => c.LoginComponent) },
      { path: 'signup', loadComponent: () => import('./signup.component').then(c => c.SignupComponent) },
    ],
  },
];
