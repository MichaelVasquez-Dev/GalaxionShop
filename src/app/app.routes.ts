import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'producto/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then((m) => m.ProductDetailPage),
  },
  { path: '**', redirectTo: '' },
];
