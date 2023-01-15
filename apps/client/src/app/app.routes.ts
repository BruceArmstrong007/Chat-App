import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path:'',
    loadComponent: () => import('@client/ui').then(m => m.LayoutComponent),
    loadChildren: () => import('@client/ui').then(m=>m.clientUiRoutes)
  }
];
