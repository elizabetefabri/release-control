# Arquitetura MFE — Rollout Service

> Documentação detalhada para separar o **Release Control** em Micro-Frontends (MFE) com Angular, mantendo **um único backend**.

---

## 1. Visão Geral

O objetivo é dividir o frontend em 3 partes independentes, cada uma com seu próprio repositório, build e deploy, mas integradas em runtime pelo Module Federation.

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVEGADOR                               │
├─────────────────────────────────────────────────────────────┤
│  release-control-shell (localhost:6000)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Sidebar │ Header                                     │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  <router-outlet> carrega MFEs remotos                 │  │
│  │                                                       │  │
│  │  /applications        → rollout-service               │  │
│  │  /release-trains      → rollout-service               │  │
│  │  /release-train-schedulers → scheduler-service        │  │
│  │                                                       │  │
│  │  Footer                                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  rollout-service     scheduler-service      backend
  (localhost:6001)    (localhost:6002)       (localhost:8083)
```

### Repositórios

| Repositório | Responsabilidade | Porta dev | Rotas públicas |
|-------------|------------------|-----------|----------------|
| `release-control-shell` | Shell com sidebar, header, footer, autenticação e orquestração de MFEs | `6000` | `/` |
| `rollout-service` | Aplicações e Release Trains | `6001` | `/applications`, `/applications/:id`, `/release-trains`, `/release-trains/:id` |
| `release-train-scheduler` | Agendamento de Release Trains | `6002` | `/release-train-schedulers`, `/release-train-schedulers/:id` |

### Backend

- **Um único backend** `release-control/backend` (Go + MongoDB).
- Porta `8083`.
- Todos os MFEs consomem a mesma API.
- CORS configurado para as origens dos MFEs.

---

## 2. O problema das rotas (routers)

### 2.1. Pergunta: como ficam os routers dos 3 projetos?

Cada projeto tem seu próprio Angular Router, mas só o **shell** é quem o usuário vê no navegador. A solução é:

1. **Shell define as rotas de navegação** (`/applications`, `/release-trains`, `/release-train-schedulers`) e usa `loadRemoteModule` para carregar o módulo remoto.
2. **Cada MFE exporta suas rotas** (`Routes`) e um componente raiz.
3. O shell usa `loadChildren` dinâmico para montar as rotas do MFE dentro do seu próprio `Router`.
4. As rotas dentro do MFE (`:id`, sub-rotas) são filhas do ponto de entrada exposto.

### 2.2. Estrutura de roteamento

#### Shell (`release-control-shell`)

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout').then(m => m.Layout),
    children: [
      { path: '', redirectTo: 'applications', pathMatch: 'full' },

      // ROLLOUT SERVICE
      {
        path: 'applications',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:6001/remoteEntry.js',
            exposedModule: './Routes',
          }).then(m => m.ROUTES),
      },
      {
        path: 'release-trains',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:6001/remoteEntry.js',
            exposedModule: './Routes',
          }).then(m => m.ROUTES),
      },

      // SCHEDULER SERVICE
      {
        path: 'release-train-schedulers',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:6002/remoteEntry.js',
            exposedModule: './Routes',
          }).then(m => m.ROUTES),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
  },
  { path: '**', redirectTo: '' },
];
```

Ponto importante: **o mesmo MFE (`rollout-service`) atende duas rotas distintas** (`/applications` e `/release-trains`). O MFE internamente precisa saber em qual rota raiz está carregando.

Para isso, dentro do `rollout-service` as rotas são definidas sem o prefixo raiz:

```ts
// projects/rollout-service/src/app/app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: RolloutLayout,
    children: [
      { path: '', redirectTo: 'applications', pathMatch: 'full' },
      {
        path: 'applications',
        loadComponent: () => import('./pages/applications/applications').then(m => m.Applications),
      },
      {
        path: 'applications/:id',
        loadComponent: () => import('./pages/applications-detail/applications-detail').then(m => m.ApplicationsDetail),
      },
      {
        path: 'release-trains',
        loadComponent: () => import('./pages/release-trains/release-trains').then(m => m.ReleaseTrains),
      },
      {
        path: 'release-trains/:id',
        loadComponent: () => import('./pages/release-trains-detail/release-trains-detail').then(m => m.ReleaseTrainsDetail),
      },
    ],
  },
];
```

Quando o shell carrega `/applications`, ele monta as rotas do `rollout-service` a partir de `path: 'applications'`. Como o `rollout-service` tem `path: ''` no componente raiz, o que vem depois é interpretado como filho.

Para evitar conflito (o MFE não sabe se é `/applications` ou `/release-trains`), expomos **dois módulos diferentes** do rollout-service:

- `./ApplicationsRoutes` — para `/applications`
- `./ReleaseTrainsRoutes` — para `/release-trains`

Cada um exporta rotas sem prefixo e sem conflito interno.

#### `rollout-service/webpack.config.js`

```js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'rolloutService',
  exposes: {
    './ApplicationsRoutes': './projects/rollout-service/src/app/applications.routes.ts',
    './ReleaseTrainsRoutes': './projects/rollout-service/src/app/release-trains.routes.ts',
    './Module': './projects/rollout-service/src/app/app.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

#### `rollout-service/src/app/applications.routes.ts`

```ts
import { Routes } from '@angular/router';

export const APPLICATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/applications/applications').then(m => m.Applications),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/applications-detail/applications-detail').then(m => m.ApplicationsDetail),
  },
];
```

#### `rollout-service/src/app/release-trains.routes.ts`

```ts
import { Routes } from '@angular/router';

export const RELEASE_TRAINS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/release-trains/release-trains').then(m => m.ReleaseTrains),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/release-trains-detail/release-trains-detail').then(m => m.ReleaseTrainsDetail),
  },
];
```

#### Shell ajustado

```ts
{
  path: 'applications',
  loadChildren: () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:6001/remoteEntry.js',
      exposedModule: './ApplicationsRoutes',
    }).then(m => m.APPLICATIONS_ROUTES),
},
{
  path: 'release-trains',
  loadChildren: () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:6001/remoteEntry.js',
      exposedModule: './ReleaseTrainsRoutes',
    }).then(m => m.RELEASE_TRAINS_ROUTES),
},
```

#### `release-train-scheduler/webpack.config.js`

```js
module.exports = withModuleFederationPlugin({
  name: 'schedulerService',
  exposes: {
    './SchedulerRoutes': './projects/release-train-scheduler/src/app/scheduler.routes.ts',
    './Module': './projects/release-train-scheduler/src/app/app.routes.ts',
  },
  shared: shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
});
```

#### `release-train-scheduler/src/app/scheduler.routes.ts`

```ts
import { Routes } from '@angular/router';

export const SCHEDULER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/schedulers/schedulers').then(m => m.Schedulers),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/scheduler-detail/scheduler-detail').then(m => m.SchedulerDetail),
  },
];
```

---

## 3. Comunicação entre MFEs

### 3.1. Compartilhamento de bibliotecas

Para evitar carregar Angular várias vezes, as bibliotecas são compartilhadas:

```js
shared: {
  '@angular/core': { singleton: true, strictVersion: true },
  '@angular/common': { singleton: true, strictVersion: true },
  '@angular/router': { singleton: true, strictVersion: true },
  '@angular/forms': { singleton: true, strictVersion: true },
  'rxjs': { singleton: true, strictVersion: true },
  '@ngrx/store': { singleton: true, strictVersion: true },
  '@ngrx/effects': { singleton: true, strictVersion: true },
  'primeng': { singleton: true, strictVersion: true },
}
```

### 3.2. Design system compartilhado

- Criar biblioteca `shared-ui` publicada internamente ou copiada nos 3 repos.
- Alternativa: o MFE não importa `app-sidebar`/`app-footer` — isso fica no shell.
- Cada MFE usa apenas componentes de conteúdo (tabelas, formulários, cards).

### 3.3. Estado global

- Autenticação: gerenciada pelo shell.
- Token JWT passado via `HttpInterceptor` comum (compartilhado ou replicado).
- Eventos entre MFEs: `BroadcastChannel`, `window.dispatchEvent` ou `@ngrx/store` compartilhado.

---

## 4. Backend único

O `release-control/backend` continua servindo todos os MFEs.

### CORS

No `.env` do backend:

```env
ALLOWED_ORIGINS=http://localhost:6000,http://localhost:6001,http://localhost:6002,http://localhost:6003
```

O middleware `internal/middleware/cors.go` lê essa variável.

### Endpoints consumidos

| MFE | Endpoints principais |
|-----|----------------------|
| `rollout-service` | `GET /v1/applications`, `GET /v1/applications/:id`, `GET /v1/release-trains`, `GET /v1/release-trains/:id` |
| `scheduler-service` | `GET /v1/release-train-schedules`, `GET /v1/release-train-schedules/:id` |

---

## 5. Passo a passo de criação

### 5.1. Criar repositórios no GitHub

```bash
gh repo create release-control-shell --public --description "Shell MFE para Release Control" --confirm
gh repo create rollout-service --public --description "MFE de Rollout Service" --confirm
gh repo create release-train-scheduler --public --description "MFE de Release Train Scheduler" --confirm
```

### 5.2. Clonar repositórios

```bash
mkdir -p /home/elizabetefabri/repos/dev/web/mfe-repos && cd /home/elizabetefabri/repos/dev/web/mfe-repos
gh repo clone elizabetefabri/release-control-shell
git clone https://github.com/elizabetefabri/rollout-service.git
git clone https://github.com/elizabetefabri/release-train-scheduler.git
```

### 5.3. Gerar projeto Angular em cada repo

```bash
cd /home/elizabetefabri/repos/dev/web/mfe-repos/release-control-shell
npx @angular/cli@21 new . --routing --style=scss --ssr=false --package-manager=npm
npm install @angular-architects/module-federation --save-dev

# rollout-service e scheduler seguem o mesmo padrão
```

### 5.4. Configurar Module Federation

Siga os exemplos da seção 2.

### 5.5. Configurar `angular.json`

Para cada aplicação, trocar o builder padrão pelo builder do Module Federation:

```json
"architect": {
  "build": {
    "builder": "@angular-architects/module-federation:webpack-browser",
    "options": {
      "extraWebpackConfig": "webpack.config.js",
      ...
    }
  },
  "serve": {
    "builder": "@angular-architects/module-federation:dev-server",
    "options": {
      "extraWebpackConfig": "webpack.config.js",
      "port": 6000
    }
  }
}
```

### 5.6. Copiar componentes do monolito

- `release-control-shell`: copiar `Layout`, `Sidebar`, `Footer`, `Header`, auth.
- `rollout-service`: copiar `applications`, `applications-detail`, `release-trains`, `release-trains-detail`.
- `scheduler-service`: copiar `release-trains-schedulers`, `release-trains-schedulers-detail`, `release-train-calendar`.

Ajustar imports: mover de `src/app/pages/...` para `src/app/pages/...` do novo repo.

### 5.7. Criar bibliotecas compartilhadas

Criar monorepo ou publicar pacotes internos:

```bash
ng generate library shared-core
ng generate library shared-ui
```

`shared-core` exporta:
- `AuthService`
- `ApiService`
- `environment`
- Interceptores

`shared-ui` exporta:
- `Icon`
- `SmartTable`
- `PageHeader`
- `UserAvatar`

---

## 6. Comandos de desenvolvimento

### Iniciar todos os MFEs

```bash
# Terminal 1 — Backend
cd /home/elizabetefabri/repos/dev/web/release-control/backend
cp .env.example .env
make docker-up

# Terminal 2 — Shell
cd /home/elizabetefabri/repos/dev/web/mfe-repos/release-control-shell
npm start

# Terminal 3 — Rollout Service
cd /home/elizabetefabri/repos/dev/web/mfe-repos/rollout-service
npm start

# Terminal 4 — Scheduler
cd /home/elizabetefabri/repos/dev/web/mfe-repos/release-train-scheduler
npm start
```

Acesse: `http://localhost:6000`

### Build de produção

```bash
cd /home/elizabetefabri/repos/dev/web/mfe-repos/release-control-shell
ng build --configuration production

cd /home/elizabetefabri/repos/dev/web/mfe-repos/rollout-service
ng build --configuration production

cd /home/elizabetefabri/repos/dev/web/mfe-repos/release-train-scheduler
ng build --configuration production
```

### Deploy em bucket estático

```bash
# Upload de cada dist para o bucket
aws s3 sync dist/release-control-shell s3://company-mfes/release-control-shell/1.0.0
aws s3 sync dist/rollout-service s3://company-mfes/rollout-service/1.0.0
aws s3 sync dist/release-train-scheduler s3://company-mfes/release-train-scheduler/1.0.0
```

Shell aponta para:

```ts
const remoteEntry = environment.production
  ? 'https://cdn.company.com/rollout-service/1.0.0/remoteEntry.js'
  : 'http://localhost:6001/remoteEntry.js';
```

---

## 7. Complexidade por camada

### 7.1. Fácil

- Criar repos vazios.
- Configurar `package.json` e `angular.json`.
- Criar `webpack.config.js` com Module Federation.
- Subir 3 aplicações Angular em portas diferentes.

### 7.2. Média

- Compartilhar bibliotecas sem duplicar Angular.
- Configurar `loadRemoteModule` no shell.
- Resolver conflitos de versão (`strictVersion`, `requiredVersion`).
- Ajustar CORS no backend para múltiplas origens.

### 7.3. Alta

- Separar componentes do monolito sem quebrar imports.
- Criar design system compartilhado.
- Gerenciar estado global entre MFEs.
- CI/CD independente por MFE.
- Versionamento de `remoteEntry.js` e cache busting.

---

## 8. Checklist de implementação

- [ ] Criar 3 repositórios no GitHub.
- [ ] Gerar projeto Angular em cada um.
- [ ] Instalar `@angular-architects/module-federation`.
- [ ] Configurar `webpack.config.js` e `angular.json`.
- [ ] Criar rotas no shell (`/applications`, `/release-trains`, `/release-train-schedulers`).
- [ ] Exportar rotas dos MFEs (`ApplicationsRoutes`, `ReleaseTrainsRoutes`, `SchedulerRoutes`).
- [ ] Copiar componentes do monolito para cada MFE.
- [ ] Criar `Layout` no shell com sidebar, header, footer.
- [ ] Configurar CORS no backend para `localhost:6000,6001,6002`.
- [ ] Criar biblioteca `shared-core` (auth, API, interceptores).
- [ ] Criar biblioteca `shared-ui` (componentes comuns).
- [ ] Buildar e testar todos juntos.
- [ ] Configurar CI/CD e deploy.

---

## 9. Dúvidas para confirmar

1. O shell vai ter autenticação própria ou continuará no `release-control`?
2. Os MFEs ficarão em monorepo temporário ou repos separados imediatamente?
3. Qual será a URL de produção dos `remoteEntry.js`?
4. O design system (`shared-ui`) será um repo separado ou uma pasta dentro do shell?
5. Quais versões do Angular serão usadas? (Recomendo Angular 21 para manter compatibilidade.)

---

## 10. Próximos passos imediatos

1. Criar os 3 repositórios no GitHub.
2. Estruturar o `release-control-shell` com o layout existente.
3. Mover `applications` e `release-trains` para `rollout-service`.
4. Mover `release-trains-schedulers` para `release-train-scheduler`.
5. Configurar Module Federation e testar o roteamento.
6. Ajustar CORS no backend.
