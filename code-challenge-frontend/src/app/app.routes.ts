import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list',
    loadChildren: () =>
      import('./inventary/inventary.route').then((m) => m.INVENTARY_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./inventary/inventary.route').then((m) => m.INVENTARY_ROUTES),
  },
];
