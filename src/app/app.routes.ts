import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';

export const routes: Routes = [
  { path: '', component: LandingPage, title: 'Robert Solar | Energia Solar em Salvador, BA' },
  { path: 'privacidade', loadComponent: () => import('./pages/privacy-policy/privacy-policy').then((page) => page.PrivacyPolicy), title: 'Política de Privacidade | Robert Solar' },
  { path: '**', redirectTo: '' },
];
