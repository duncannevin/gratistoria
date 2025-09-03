import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component').then(c => c.AuthComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadComponent: () => import('./login.component').then(c => c.LoginComponent) },
      { path: 'signup', loadComponent: () => import('./signup.component').then(c => c.SignupComponent) },
      { path: 'forgot-password', loadComponent: () => import('./forgot-password.component').then(c => c.ForgotPasswordComponent) },
      { path: 'confirmation-code', loadComponent: () => import('./confirmation-code.component').then(c => c.ConfirmationCodeComponent) },
      { path: 'change-password', loadComponent: () => import('./change-password.component').then(c => c.ChangePasswordComponent) },
    ],
  },
];
