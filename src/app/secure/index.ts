import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./secure.component').then(c => c.SecureComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'today' },
      { path: 'today', loadComponent: () => import('./today.component').then(c => c.TodayComponent) },
      { path: 'stories', loadComponent: () => import('./stories.component').then(c => c.StoriesComponent) },
      { path: 'diary', loadComponent: () => import('./diary.component').then(c => c.DiaryComponent) },
    ],
  },
];
