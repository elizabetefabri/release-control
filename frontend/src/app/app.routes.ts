import { Routes } from '@angular/router';

// const sectionChild = {
//   path: '',
//   loadComponent: () =>
//     import('').then(
//       (m) => m.SectionPageComponent,
//     ),
// };

// const detailChild = {
//   path: ':topic',
//   children: [
//     {
//       path: '',
//       loadComponent: () =>
//         import('').then(
//           (m) => m.DetailPageComponent,
//         ),
//     },
//     {
//       path: ':itemId',
//       loadComponent: () =>
//         import('').then(
//           (m) => m.DetailComponent,
//         ),
//     },
//   ],
// };

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  { path: '**', redirectTo: '/dashboard' },
];
