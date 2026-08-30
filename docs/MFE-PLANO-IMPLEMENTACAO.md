# Plano de Implementação — Micro-Frontends (MFE) Release Control

> Baseado na leitura de `docs/MFE-ARQUITETURA-PLANO.md`, `docs/MFE-ROLL-OUT-ARCHITECTURE.md`, `frontend/docs/MFE-ANGULAR-SETUP.md`, `frontend/docs/documentacao.md`, `frontend/docs/plano-desenvolvimento-release-trains.md` e no código atual do repositório (`backend/`, `frontend/` e `rollout-service` em `projetos-pessoais`).

---

## 1. Resposta direta

| Pergunta | Resposta | Motivo |
| -------- | -------- | ------ |
| O microfrontend em Angular foi finalizado em 100%? | **Não.** | Não há instalação do `@angular-architects/module-federation`, nem `webpack.config.js`, nem `remoteEntry.js`, nem shell orquestrando MFEs. O `frontend/` ainda é um monolito comum. |
| O frontend está pronto para desacoplar o rollout e separar o sistema mantendo as mesmas rotas? | **Não.** | A separação em MFEs está apenas documentada. Os componentes de `applications`, `release-trains` e `release-train-schedulers` ainda moram no mesmo `src/app/pages/` do monolito. O `rollout-service-frontend` em `projetos-pessoais` é uma cópia idêntica do monolito, também sem MFE. |
| O que falta implementar? | **Muito.** | Backend tem apenas `applications` + auth. Frontend é monolito. MFE, shell, bibliotecas compartilhadas e CI/CD por MFE ainda não existem. |

---

## 2. Estado atual do projeto

### 2.1 Backend (`release-control/backend/`)

| Área | Status |
| ---- | ------ |
| Conexão MongoDB | ✅ Configurada |
| Auth (login/register/health) | ✅ Implementado |
| Aplicações — `GET /api/v1/applications` | ✅ Implementado (apenas listagem) |
| Aplicações — demais endpoints (`POST`, `GET /:id`, `DELETE`, `GET /:id/packages`) | ❌ Não implementado |
| Packages, Releases, Release Trains, Schedules, Blocks, Audiences, Statuses | ❌ Não implementado |
| Endpoints de `documentacao.md` (`/v1/...`) | ❌ Não implementado |
| CORS | ⚠️ Permite `*` (aberto, não usa `ALLOWED_ORIGINS`) |
| Prefixo de API | ⚠️ Monolito usa `/api/v1/...`; a doc usa `/v1/...` (precisa alinhar) |

**Conclusão:** o backend tem apenas o scaffold de `applications` e auth. Ele ainda não consegue atender todas as telas do frontend (packages, releases, RTs, schedules, etc.).

### 2.2 Frontend (`release-control/frontend/`)

| Área | Status |
| ---- | ------ |
| Angular 21 + standalone components | ✅ Configurado |
| Rotas (applications, release-trains, release-train-schedulers, dashboard, etc.) | ✅ Definidas em `src/app/app.routes.ts` |
| Layout (sidebar, header, footer) | ✅ Componente `Layout` pronto — ideal para virar **shell** |
| Services e `ApiService` genérico | ✅ Implementado |
| Componentes de rollout (applications, release-trains, schedulers) | ✅ Existem, mas estão no monolito |
| Module Federation / MFE | ❌ Não instalado (`package.json` sem `@angular-architects/module-federation`) |
| `webpack.config.js` / `remoteEntry.js` | ❌ Não existe |
| Configuração de MFE no `angular.json` | ❌ Usa builder padrão `@angular/build:application` |
| Shell separado | ❌ Não existe |
| MFE `rollout-service` separado | ❌ Não existe (repo em `projetos-pessoais` é cópia idêntica do monolito) |
| MFE `release-train-scheduler` separado | ❌ Não existe |

**Conclusão:** o frontend funciona como monolito, mas não está arquitetado para MFE. O `Layout` pode ser reaproveitado como shell, mas os projetos ainda precisam ser criados e configurados.

### 2.3 Rollout Service (`projetos-pessoais/rollout-service/`)

| Área | Status |
| ---- | ------ |
| Repo `rollout-service-frontend` | ⚠️ Existe, mas é cópia exata do `release-control/frontend` (mesmo `package.json`, `angular.json`, `app.routes.ts`) |
| Configuração MFE | ❌ Ausente |
| Exposição de rotas (`ApplicationsRoutes`, `ReleaseTrainsRoutes`) | ❌ Ausente |
| Backend `rollout-service-backend` | ✅ Base Go + MongoDB copiada do template |

**Conclusão:** o repositório foi criado, mas ainda não foi convertido em MFE. Ele precisa ser limpo (manter só o que é rollout) e ganhar Module Federation.

---

## 3. O que falta implementar, em ordem

### FASE 0 — Consolidação básica (pré-requisito)

Antes de separar MFEs, o sistema precisa funcionar como um todo. Recomendo executar isso primeiro.

1. **Alinhar o prefixo da API**
   - Decidir se será `/api/v1` (atual do backend) ou `/v1` (doc).
   - Ajustar `ApiService` e rotas do backend para usar o mesmo prefixo em todos os endpoints.

2. **Completar o CRUD de `applications` no backend**
   - `POST /api/v1/applications`
   - `GET /api/v1/applications/:id`
   - `DELETE /api/v1/applications/:id`
   - `GET /api/v1/applications/:id/packages`

3. **Implementar os demais domínios do backend**
   - `packages` (com parent, application, validação, soft-delete)
   - `releases` (com status, ações PUT, histórico)
   - `release-trains` (CRUD, ações, batch)
   - `release-train-schedules`
   - `release-train-blocks`
   - `audiences`
   - `release-statuses` e `release-train-statuses`
   - `health` (`GET /health` já existe)

4. **Ajustar CORS para origens conhecidas**
   - Trocar `Access-Control-Allow-Origin: *` por leitura de `ALLOWED_ORIGINS`.
   - Preparar `.env.example` com as futuras portas dos MFEs: `http://localhost:6000,http://localhost:6001,http://localhost:6002,http://localhost:6003`.

> **Por que isso vem primeiro:** sem um backend completo, os MFEs não terão dados para exibir. Decoupling sem backend é apenas mudar de lugar um monolito quebrado.

---

### FASE 1 — Estruturar os repositórios MFE

Decidir e executar a estratégia de repositórios.

**Opção recomendada:** monorepo temporário dentro de `release-control/frontend/` com `projects/`, depois extrair para repos próprios.

1. Criar as aplicações no `angular.json`:
   - `shell` — orquestrador (porta `6005`)
   - `release-control-mfe` — o app atual (porta `6004`)
   - `rollout-service` — aplicações + release trains (porta `6001`)
   - `release-train-scheduler` — agendamento (porta `6002`)

2. Ou criar repos separados imediatamente:
   - `release-control-shell`
   - `release-control-mfe`
   - `rollout-service`
   - `release-train-scheduler`

3. Criar bibliotecas compartilhadas:
   - `shared-core` — `AuthService`, `ApiService`, interceptores, guards, environment
   - `shared-ui` — `PageHeader`, `SmartTable`, `Icon`, `Breadcrumbs`, `Modal`, etc.

---

### FASE 2 — Instalar e configurar Module Federation

1. Instalar a dependência:

   ```bash
   npm install @angular-architects/module-federation --save-dev
   ```

2. Criar `webpack.config.js` e `mf.config.js` para cada MFE.

3. Trocar o builder no `angular.json`:
   - De `@angular/build:application` para `@angular-architects/module-federation:webpack-browser`
   - De `@angular/build:dev-server` para `@angular-architects/module-federation:dev-server`
   - Adicionar `extraWebpackConfig` apontando para o `webpack.config.js`

4. Configurar `shared` para evitar carregar Angular várias vezes:

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

---

### FASE 3 — Extrair `rollout-service` MFE

1. Definir as rotas expostas (sem prefixo):
   - `./ApplicationsRoutes` → `/projects/rollout-service/src/app/applications.routes.ts`
   - `./ReleaseTrainsRoutes` → `/projects/rollout-service/src/app/release-trains.routes.ts`

2. Criar os arquivos de rotas:

   ```ts
   // applications.routes.ts
   export const APPLICATIONS_ROUTES: Routes = [
     { path: '', loadComponent: () => import('./pages/applications/applications').then(m => m.Applications) },
     { path: ':id', loadComponent: () => import('./pages/applications-detail/applications-detail').then(m => m.ApplicationsDetail) },
   ];

   // release-trains.routes.ts
   export const RELEASE_TRAINS_ROUTES: Routes = [
     { path: '', loadComponent: () => import('./pages/release-trains/release-trains').then(m => m.ReleaseTrains) },
     { path: ':id', loadComponent: () => import('./pages/release-trains-detail/release-trains-detail').then(m => m.ReleaseTrainsDetail) },
   ];
   ```

3. Mover os componentes do monolito para o novo projeto:
   - `applications/`
   - `applications-detail/`
   - `release-trains/`
   - `release-trains-detail/`

4. Ajustar imports para apontar para `shared-core` e `shared-ui`.

---

### FASE 4 — Extrair `release-train-scheduler` MFE

1. Expor `./SchedulerRoutes`:

   ```ts
   export const SCHEDULER_ROUTES: Routes = [
     { path: '', loadComponent: () => import('./pages/schedulers/schedulers').then(m => m.Schedulers) },
     { path: ':id', loadComponent: () => import('./pages/scheduler-detail/scheduler-detail').then(m => m.SchedulerDetail) },
   ];
   ```

2. Mover os componentes:
   - `release-trains-schedulers/`
   - `release-trains-schedulers-detail/`
   - `release-train-calendar/`

---

### FASE 5 — Criar o `release-control-shell`

1. Criar app `shell` com:
   - `Layout` (reaproveitar do monolito)
   - `Sidebar`
   - `Header` / `UserAvatar`
   - `Footer`
   - `Breadcrumbs`
   - Auth (login + guard)

2. Configurar `app.routes.ts` do shell usando `loadRemoteModule`:

   ```ts
   import { loadRemoteModule } from '@angular-architects/module-federation';

   export const routes: Routes = [
     {
       path: '',
       loadComponent: () => import('./shared/components/layout/layout').then(m => m.Layout),
       children: [
         { path: '', redirectTo: 'applications', pathMatch: 'full' },
         {
           path: 'applications',
           loadChildren: () => loadRemoteModule({
             type: 'module',
             remoteEntry: 'http://localhost:6001/remoteEntry.js',
             exposedModule: './ApplicationsRoutes',
           }).then(m => m.APPLICATIONS_ROUTES),
         },
         {
           path: 'release-trains',
           loadChildren: () => loadRemoteModule({
             type: 'module',
             remoteEntry: 'http://localhost:6001/remoteEntry.js',
             exposedModule: './ReleaseTrainsRoutes',
           }).then(m => m.RELEASE_TRAINS_ROUTES),
         },
         {
           path: 'release-train-schedulers',
           loadChildren: () => loadRemoteModule({
             type: 'module',
             remoteEntry: 'http://localhost:6002/remoteEntry.js',
             exposedModule: './SchedulerRoutes',
           }).then(m => m.SCHEDULER_ROUTES),
         },
       ],
     },
     { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
     { path: '**', redirectTo: '' },
   ];
   ```

3. O shell deve ser a única aplicação com autenticação completa.

---

### FASE 6 — Bibliotecas compartilhadas

1. `shared-core`:
   - `AuthService`
   - `ApiService`
   - `ApiErrorInterceptor`
   - `AuthGuard`
   - `environment` (com `apiUrl` e `remoteEntry` por ambiente)
   - Tipos comuns (`ApiResponse`, `PagedResult`, etc.)

2. `shared-ui`:
   - `PageHeader`
   - `SmartTable`
   - `Icon`
   - `Breadcrumbs`
   - `ModalConfirmacao`
   - `ModalReagendarRelease`
   - `UserAvatar`
   - Tokens SCSS / tema PrimeNG

3. Publicar as bibliotecas ou referenciá-las via path mapping no `tsconfig.json`.

---

### FASE 7 — Ajustar autenticação, CORS e ambientes

1. **Auth**
   - Shell controla login, token JWT e sessão.
   - Token é passado para os MFEs via `shared-core/AuthService`.
   - Cada MFE usa o `AuthGuard` compartilhado.

2. **CORS no backend**
   - Atualizar `internal/middleware/cors.go` para ler `ALLOWED_ORIGINS`.
   - `.env` deve conter todas as portas dos MFEs.

3. **Environments**
   - `environment.ts` apontando para `http://localhost:8083`.
   - `environment.prod.ts` apontando para URL de produção.
   - Adicionar configuração de `remoteEntry` por ambiente no shell.

---

### FASE 8 — Testar integração local

1. Subir backend:

   ```bash
   cd backend
   cp .env.example .env
   make docker-up
   ```

2. Subir MFEs e shell:

   ```bash
   # rollout-service
   ng serve rollout-service --port 6001

   # release-train-scheduler
   ng serve release-train-scheduler --port 6002

   # shell
   ng serve shell --port 6005
   ```

3. Acessar `http://localhost:6005` e validar:
   - Sidebar funciona
   - `/applications` carrega `rollout-service`
   - `/release-trains` carrega `rollout-service`
   - `/release-train-schedulers` carrega `scheduler`
   - Login, guard, chamadas à API funcionam

---

### FASE 9 — CI/CD e deploy

1. Build independente por MFE:

   ```bash
   ng build shell --configuration production
   ng build rollout-service --configuration production
   ng build release-train-scheduler --configuration production
   ```

2. Deploy em bucket estático (S3/MinIO/CDN):
   - Cada `dist/<mfe>` vira uma pasta versionada.
   - Exemplo: `s3://company-mfes/rollout-service/1.0.0/remoteEntry.js`.

3. Shell aponta para `remoteEntry.js` de produção via `environment.prod.ts`.

4. Cache busting e versionamento de `remoteEntry.js`.

5. CI/CD separado por repositório (se usar repos separados).

---

## 4. Checklist resumido do que falta

### Backend

- [ ] Definir prefixo único (`/api/v1` ou `/v1`) e ajustar frontend e backend.
- [ ] Completar CRUD de `applications`.
- [ ] Implementar `packages` + validações + soft-delete.
- [ ] Implementar `releases` + ações (postpone, pause, stepback, rollback, deploy, rollout-result).
- [ ] Implementar `release-trains` + ações + batch.
- [ ] Implementar `release-train-schedules`.
- [ ] Implementar `release-train-blocks`.
- [ ] Implementar `audiences`.
- [ ] Implementar `release-statuses` e `release-train-statuses`.
- [ ] Implementar histórico de status.
- [ ] Ajustar CORS para usar `ALLOWED_ORIGINS`.
- [ ] Health check já existe.

### Frontend MFE

- [ ] Instalar `@angular-architects/module-federation`.
- [ ] Criar `webpack.config.js` para cada MFE.
- [ ] Trocar builders no `angular.json`.
- [ ] Criar aplicação `shell`.
- [ ] Criar aplicação `rollout-service` com rotas expostas.
- [ ] Criar aplicação `release-train-scheduler` com rotas expostas.
- [ ] Mover componentes de `src/app/pages/` para os MFEs corretos.
- [ ] Ajustar `app.routes.ts` do shell com `loadRemoteModule`.
- [ ] Criar/ajustar `environment.ts` com URLs de `remoteEntry` por ambiente.

### Bibliotecas compartilhadas

- [ ] Criar `shared-core` (auth, API, interceptor, guard, types).
- [ ] Criar `shared-ui` (page-header, smart-table, icon, breadcrumbs, modais).
- [ ] Configurar `tsconfig` path mapping.

### Infra e deploy

- [ ] Atualizar `docker-compose.yml` para subir shell + MFEs (opcional, dev).
- [ ] Ajustar CORS no backend para origens dos MFEs.
- [ ] Configurar build de produção por MFE.
- [ ] Configurar deploy em bucket/CDN.
- [ ] Versionar `remoteEntry.js`.
- [ ] CI/CD independente por MFE.

---

## 5. Próximos passos imediatos (ordem recomendada)

1. **Decidir a estratégia de repos:** monorepo temporário (`projects/`) ou repos separados já. Isso impacta todos os passos seguintes.
2. **Alinhar prefixo da API** (`/api/v1` vs `/v1`) e corrigir frontend/backend.
3. **Implementar CRUD completo de `applications`** para ter uma feature funcional de ponta a ponta.
4. **Criar o projeto `shell`** e copiar o `Layout`, `Sidebar`, `Header`, `Footer` do monolito.
5. **Instalar Module Federation** no `frontend/` e fazer uma prova de conceito: shell carregando o próprio `release-control` como MFE remoto.

---

## 6. Riscos e observações

- **Cópia do monolito:** o `rollout-service-frontend` em `projetos-pessoais` não é um MFE. Recomendo decidir se será a base do MFE de rollout ou se será descartado.
- **Backend incompleto:** separar MFEs antes do backend estar pronto pode mascarar problemas de integração. Recomendo fechar o backend primeiro.
- **CORS aberto:** `*` em produção é um risco de segurança. Deve ser corrigido antes de qualquer deploy.
- **Shared libs:** sem `shared-core` e `shared-ui`, cada MFE vai duplicar código e dificultar manutenção.
- **Rotas:** manter as mesmas rotas públicas (`/applications`, `/release-trains`, `/release-train-schedulers`) é possível, mas exige que o shell as registre e os MFEs exponham rotas sem prefixo.
