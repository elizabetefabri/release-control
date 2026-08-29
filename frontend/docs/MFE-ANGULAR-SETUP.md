# Instalação e Inicialização de MFE em Angular

> Guia prático para transformar um projeto Angular comum em uma arquitetura de Micro-Frontends (MFE) usando **Module Federation**. Baseado no Angular 21 e na stack do projeto Release Control.

---

## 1. Conceitos

### 1.1. O que é MFE?

Micro-Frontend (MFE) é uma arquitetura onde várias aplicações Angular independentes são carregadas em runtime dentro de um **host/shell** comum. Cada MFE pode:

- Ter seu próprio repositório e pipeline de CI/CD.
- Ser desenvolvido e deployado independentemente.
- Compartilhar bibliotecas comuns (`@angular/core`, `rxjs`, design system).

### 1.2. Termos

| Termo         | Significado                                              |
| ------------- | -------------------------------------------------------- |
| **Host/Shell**| Aplicação principal que orquestra os MFEs                |
| **Remote**    | MFE carregado dinamicamente pelo shell                   |
| **Module Federation** | Tecnologia (webpack) que expõe e carrega módulos remotos |
| **Shared**    | Bibliotecas compartilhadas entre host e remotes          |

---

## 2. Pré-requisitos

- Node.js LTS (compatível com Angular 21) — recomendado `v22.x`.
- Angular CLI 21+.
- npm 10.9.7+ (o projeto usa `packageManager: "npm@10.9.7"`).
- Conhecimento básico de `angular.json`, `webpack` e `Module Federation`.

---

## 3. Opção A: MFE no mesmo monorepo (rápido)

### 3.1. Criar o workspace com shell e remote

Dentro de `frontend/`, organize a estrutura em `projects/`:

```
frontend/
├── projects/
│   ├── shell/              # Aplicação host
│   ├── release-control/    # MFE principal (o app atual)
│   └── shared-core/        # Biblioteca compartilhada
├── angular.json
└── package.json
```

Criar o shell:

```bash
cd /home/elizabetefabri/repos/dev/web/release-control/frontend
ng generate application shell --routing --style=scss
```

Criar o MFE remoto (caso ainda não exista):

```bash
ng generate application release-control --routing --style=scss
```

Criar bibliotecas compartilhadas:

```bash
ng generate library shared-core
ng generate library shared-ui
```

### 3.2. Instalar Module Federation

```bash
npm install @angular-architects/module-federation --save-dev
```

### 3.3. Configurar o remote

No projeto `release-control`, adicione o builder do Module Federation:

`projects/release-control/mf.config.js`:

```js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'releaseControl',
  exposes: {
    './Module': './projects/release-control/src/app/app.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

`projects/release-control/webpack.config.js`:

```js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'releaseControl',
  exposes: {
    './Module': './projects/release-control/src/app/app.routes.ts',
  },
  shared: shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
});
```

`angular.json` — ajustar o builder do `release-control`:

```json
"release-control": {
  "architect": {
    "build": {
      "builder": "@angular-architects/module-federation:webpack-browser",
      "options": {
        "extraWebpackConfig": "projects/release-control/webpack.config.js",
        "outputPath": "dist/release-control",
        "index": "projects/release-control/src/index.html",
        "main": "projects/release-control/src/main.ts",
        "tsConfig": "projects/release-control/tsconfig.app.json"
      }
    },
    "serve": {
      "builder": "@angular-architects/module-federation:dev-server",
      "options": {
        "extraWebpackConfig": "projects/release-control/webpack.config.js",
        "port": 6004
      }
    }
  }
}
```

### 3.4. Configurar o shell

`projects/shell/mf.config.js`:

```js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'shell',
  remotes: {
    releaseControl: 'http://localhost:6004/remoteEntry.js',
  },
  shared: shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
});
```

`projects/shell/webpack.config.js`:

```js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'shell',
  remotes: {
    releaseControl: 'http://localhost:6004/remoteEntry.js',
  },
  shared: shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
});
```

`projects/shell/app.config.ts` — roteamento com `loadRemoteModule`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'release',
    pathMatch: 'full',
  },
  {
    path: 'release',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:6004/remoteEntry.js',
        exposedModule: './Module',
      }).then((m) => m.AppRoutes),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

`angular.json` — builder do shell:

```json
"shell": {
  "architect": {
    "build": {
      "builder": "@angular-architects/module-federation:webpack-browser",
      "options": {
        "extraWebpackConfig": "projects/shell/webpack.config.js",
        "outputPath": "dist/shell",
        "index": "projects/shell/src/index.html",
        "main": "projects/shell/src/main.ts",
        "tsConfig": "projects/shell/tsconfig.app.json"
      }
    },
    "serve": {
      "builder": "@angular-architects/module-federation:dev-server",
      "options": {
        "extraWebpackConfig": "projects/shell/webpack.config.js",
        "port": 6005
      }
    }
  }
}
```

### 3.5. Iniciar os dois

Terminal 1 (MFE remoto):

```bash
cd /home/elizabetefabri/repos/dev/web/release-control/frontend
ng serve release-control
```

Terminal 2 (shell):

```bash
cd /home/elizabetefabri/repos/dev/web/release-control/frontend
ng serve shell
```

Acesse `http://localhost:6005` e o shell carregará `release-control` do `localhost:6004`.

---

## 4. Opção B: MFE em repositórios separados (escala)

Cada MFE vive em seu próprio repositório. O shell é outro repositório.

```
# Criar repos
gh repo create release-control-mfe --public --confirm
gh repo create admin-mfe --public --confirm
gh repo create release-control-shell --public --confirm

# Clonar e configurar
git clone <url-release-control-mfe>
cd release-control-mfe
npm install @angular-architects/module-federation --save-dev
# ... mesma configuração de webpack do passo 3.3
```

No `shell`, aponte para o `remoteEntry.js` do ambiente correto:

```js
const remotes = {
  development: {
    releaseControl: 'http://localhost:6004/remoteEntry.js',
    admin: 'http://localhost:6006/remoteEntry.js',
  },
  homologation: {
    releaseControl: 'https://release-control-hom.company.com/remoteEntry.js',
    admin: 'https://admin-hom.company.com/remoteEntry.js',
  },
  production: {
    releaseControl: 'https://release-control.company.com/remoteEntry.js',
    admin: 'https://admin.company.com/remoteEntry.js',
  },
};
```

---

## 5. Configurações importantes

### 5.1. Portas padrão do projeto

| Aplicação            | Porta dev | Arquivo / script              |
| -------------------- | --------- | ----------------------------- |
| Frontend monolito    | `6003`    | `package.json` (`npm start`)  |
| MFE Release Control  | `6004`    | `angular.json`                |
| Shell                | `6005`    | `angular.json`                |
| Admin MFE (futuro)   | `6006`    | `angular.json`                |
| API / Backend        | `8083`    | `backend/.env` (`API_PORT`)   |
| MongoDB              | `27018`   | `backend/.env` (`MONGO_PORT`) |
| Mongo Express        | `8084`    | `backend/.env`                |

### 5.2. CORS

O backend (`internal/middleware/cors.go`) já permite origens definidas em `ALLOWED_ORIGINS`. Para MFEs, adicione as novas portas no `.env`:

```env
ALLOWED_ORIGINS=http://localhost:6003,http://localhost:6004,http://localhost:6005,http://localhost:6006
```

### 5.3. Compartilhamento de bibliotecas

Para evitar que o Angular seja carregado várias vezes, marque como `singleton`:

```js
shared: {
  '@angular/core': { singleton: true, strictVersion: true },
  '@angular/common': { singleton: true, strictVersion: true },
  '@angular/router': { singleton: true, strictVersion: true },
  '@angular/forms': { singleton: true, strictVersion: true },
  'rxjs': { singleton: true, strictVersion: true },
}
```

Se houver design system (`shared-ui`), também deve ser singleton.

---

## 6. Build e deploy

### 6.1. Build de produção

```bash
# MFE remoto
ng build release-control --configuration production

# Shell
ng build shell --configuration production
```

### 6.2. Estrutura gerada

```
dist/
├── shell/
│   ├── index.html
│   ├── main.js
│   ├── remoteEntry.js   # não, o remote fica no dist do MFE
│   └── ...
└── release-control/
    ├── index.html
    ├── main.js
    └── remoteEntry.js
```

O `remoteEntry.js` é o único arquivo que o shell precisa saber localizar. Tudo o mais (chunks) é carregado automaticamente pelo Module Federation.

### 6.3. Deploy em bucket estático

- Faça upload de `dist/release-control/**` para `s3://company-mfes/release-control/`.
- O shell aponta `remoteEntry: 'https://cdn.company.com/release-control/remoteEntry.js'`.
- Versione por ambiente/pasta: `release-control/1.0.0/`, `release-control/1.1.0/`, etc.

---

## 7. Comandos úteis

```bash
# Instalar dependências
npm install

# Rodar o frontend atual (monolito)
npm start

# Criar novo MFE no monorepo
ng generate application nome-do-mfe --routing --style=scss

# Adicionar Module Federation
npm install @angular-architects/module-federation --save-dev

# Servir MFE e shell
ng serve release-control --port 6004
ng serve shell --port 6005

# Build para produção
ng build release-control --configuration production
ng build shell --configuration production

# Testar
npm run test
npm run lint
```

---

## 8. Troubleshooting

| Erro | Causa provável | Solução |
| ---- | --------------- | ------- |
| `remoteEntry.js not found` | MFE remoto não está servindo | Verifique se `ng serve release-control` está rodando na porta certa |
| `Shared module is not available for eager consumption` | Biblioteca compartilhada não marcada como singleton | Ajuste `shared` no webpack.config |
| CORS ao carregar `remoteEntry.js` | Bucket/CDN sem CORS | Configure CORS no S3/CloudFront/MinIO |
| `Different versions of @angular/core` | Versões divergentes entre MFEs | Alinhe `package.json` e use `requiredVersion: 'auto'` |
| Rota do MFE não carrega | `loadChildren`/`loadComponent` configurado errado | Confira `exposedModule` e o nome exportado do módulo |

---

## 9. Checklist para adicionar um novo MFE

- [ ] Criar aplicação Angular (`ng generate application` ou novo repo).
- [ ] Instalar `@angular-architects/module-federation`.
- [ ] Criar `webpack.config.js` expondo um módulo/componente.
- [ ] Ajustar `angular.json` para usar `webpack-browser` e `dev-server`.
- [ ] Definir porta única no `serve`.
- [ ] Registrar o MFE no shell (`remotes` + `loadRemoteModule`).
- [ ] Adicionar as origens no `ALLOWED_ORIGINS` do backend.
- [ ] Criar/ajustar rota no shell.
- [ ] Buildar e testar localmente.
- [ ] Documentar a URL de `remoteEntry.js` por ambiente.

---

## 10. Referências

- [Angular Architects — Module Federation](https://www.angulararchitects.io/en/blog/the-microfrontend-revolution-module-federation-in-webpack-5/)
- [Module Federation Plugin](https://module-federation.io/)
- [Angular 21 Docs](https://angular.dev/)
