import { unauthGuard, TokenResolver } from '@client/core';
import { authenticatedGuard } from '@client/core';
import { Route } from '@angular/router';

export const clientUiRoutes: Route[] = [
  {
    path: '',
    canActivate:[unauthGuard],
    loadChildren: () => import('@client/auth').then(m => m.clientAuthRoutes)
  },
  {
    path: 'user',
    canActivate:[authenticatedGuard],
    resolve: { user: TokenResolver },
    loadComponent: () => import('@client/dashboard').then(m => m.DashboardComponent),
    loadChildren: () => import('@client/dashboard').then(m=>m.clientDashboardRoutes)
  }
];
