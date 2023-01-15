import { Route } from '@angular/router';

export const clientAuthRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent)
   },
   {
     path: 'login',
     loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
   },
   {
     path: 'register',
     loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
   },
   {
     path: 'reset-password',
     loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
   },
];
