import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { AuthLayout } from './features/auth/auth-layout/auth-layout';
import { authGuard } from './core/guards/auth.guard';

/**
 * Rotas da aplicação.
 * - Auth (login/cadastro): fora do shell, com layout próprio.
 * - Domínio de Rollout: sob o layout corporativo (shell), protegido pelo authGuard.
 * Páginas carregadas via lazy loadComponent (standalone).
 */
export const routes: Routes = [
  // Autenticação (sem shell)
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        data: { title: 'Entrar' },
      },
      {
        path: 'cadastro',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
        data: { title: 'Cadastro' },
      },
    ],
  },

  // Aplicação (com shell, protegida)
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'applications', pathMatch: 'full' },

      // Dashboards
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
        data: { title: 'Dashboard' },
      },
      {
        path: 'dashboard-red',
        loadComponent: () =>
          import('./pages/dashboard-red/dashboard-red').then((m) => m.DashboardRed),
        data: { title: 'Dashboard RED' },
      },

      // Applications / Repositórios
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications').then((m) => m.Applications),
        data: { title: 'Repositórios' },
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./pages/applications-detail/applications-detail').then(
            (m) => m.ApplicationsDetail,
          ),
        data: { title: 'Detalhe da Application' },
      },

      // Release Trains
      {
        path: 'release-trains',
        loadComponent: () =>
          import('./pages/release-trains/release-trains').then((m) => m.ReleaseTrains),
        data: { title: 'Release Trains' },
      },
      {
        path: 'release-trains/:id',
        loadComponent: () =>
          import('./pages/release-trains-detail/release-trains-detail').then(
            (m) => m.ReleaseTrainsDetail,
          ),
        data: { title: 'Detalhe do Release Train' },
      },

      // Release Train Schedulers
      {
        path: 'release-train-schedulers',
        loadComponent: () =>
          import('./pages/release-trains-schedulers/release-trains-schedulers').then(
            (m) => m.ReleaseTrainsSchedulers,
          ),
        data: { title: 'Release Trains Schedulers' },
      },
      {
        path: 'release-train-schedulers/:id',
        loadComponent: () =>
          import(
            './pages/release-trains-schedulers-detail/release-trains-schedulers-detail'
          ).then((m) => m.ReleaseTrainsSchedulersDetail),
        data: { title: 'Detalhe do Scheduler' },
      },

      // Itens do sidebar ainda não implementados (placeholder)
      {
        path: 'calendario',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Calendário', icon: 'calendar-minus-2' },
      },
      {
        path: 'quality-budget',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Quality Budget', icon: 'tool-case' },
      },
      {
        path: 'dogfooding',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Dogfooding', icon: 'paw-print' },
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Configurações', icon: 'settings' },
      },
      {
        path: 'abrir-incidente',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Abrir incidente', icon: 'triangle-alert' },
      },

      // Quality Budget
      {
        path: 'lista-eventos',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Lista de eventos', icon: 'list' },
      },
      {
        path: 'consultar-pontuacao',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Consultar pontuação', icon: 'chart-column' },
      },
      {
        path: 'registrar-melhorias',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Registrar melhorias', icon: 'trending-up' },
      },

      // Best testing
      {
        path: 'best-testing',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Best testing', icon: 'users' },
      },
      {
        path: 'user-beta',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Cadastro de usuários beta', icon: 'user-plus' },
      },
      {
        path: 'configurar-dispositivo',
        loadComponent: () => import('./pages/placeholder/placeholder').then((m) => m.Placeholder),
        data: { title: 'Configurar dispositivo', icon: 'smartphone' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
