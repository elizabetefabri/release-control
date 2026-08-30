# 📚 GUIA COMPLETO: Fonts + Config Angular v17

## 🎯 O que vamos fazer

1. ✅ Adicionar Google Fonts (Lato + Open Sans)
2. ✅ Configurar styles.scss
3. ✅ Atualizar app.component
4. ✅ Configurar PrimeNG
5. ✅ Atualizar tsconfig.json
6. ✅ Atualizar angular.json
7. ✅ Criar environments
8. ✅ Adicionar .gitignore
9. ✅ Adicionar vercel.json
10. ✅ Criar README.md

---

## 1️⃣ ADICIONAR GOOGLE FONTS

### Opção A: Via Google Fonts Link (SIMPLES ✅)

**Arquivo:** `src/index.html`

Adicione no `<head>`:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Frontend</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    
    <!-- ✅ ADICIONAR FONTS AQUI -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

### Opção B: Via SCSS Import (ALTERNATIVA)

**Arquivo:** `src/styles.scss` (no topo)

```scss
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@300;400;600;700&display=swap');
```

---

## 2️⃣ CONFIGURAR STYLES.SCSS

**Arquivo:** `src/styles.scss`

```scss
// ========================================
// FONTS E VARIÁVEIS GLOBAIS
// ========================================

// Fonts
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@300;400;600;700&display=swap');

// ========================================
// CORES CORPORATIVAS
// ========================================

$header-bg: #0F3CAA;
$header-text: #ffffff;
$orange-accent: #F75F00;
$bg-body: #f8fafc;
$bg-light: #ffffff;
$text-primary: #242623;
$text-secondary: #4c4847;
$text-tertiary: #6A748B;
$nav-bg: #f4f2f1;
$nav-text: #011c5f;

// ========================================
// ESPAÇAMENTO
// ========================================

$space-xs: 4px;
$space-sm: 8px;
$space-md: 16px;
$space-lg: 24px;
$space-xl: 32px;

// ========================================
// BREAKPOINTS
// ========================================

$breakpoint-mobile: 320px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-wide: 1440px;

// ========================================
// RESET E BASE
// ========================================

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: $bg-body;
  color: $text-primary;
  line-height: 1.6;
}

app-root {
  display: block;
  width: 100%;
  height: 100%;
}

// ========================================
// TIPOGRAFIA
// ========================================

h1, h2, h3, h4, h5, h6 {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  line-height: 1.3;
  color: $text-primary;
}

h1 {
  font-size: 32px;
  margin-bottom: $space-lg;
}

h2 {
  font-size: 28px;
  margin-bottom: $space-md;
}

h3 {
  font-size: 24px;
  margin-bottom: $space-md;
}

h4 {
  font-size: 20px;
  margin-bottom: $space-sm;
}

h5 {
  font-size: 18px;
  margin-bottom: $space-sm;
}

h6 {
  font-size: 16px;
  margin-bottom: $space-xs;
}

p {
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: $space-md;
}

small {
  font-size: 12px;
  color: $text-tertiary;
}

a {
  color: #0F3CAA;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: $orange-accent;
  }
}

button {
  font-family: 'Open Sans', sans-serif;
  cursor: pointer;
}

input, textarea, select {
  font-family: 'Open Sans', sans-serif;
}

// ========================================
// UTILIDADES
// ========================================

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.uppercase {
  text-transform: uppercase;
}

.lowercase {
  text-transform: lowercase;
}

.capitalize {
  text-transform: capitalize;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.font-normal {
  font-weight: 400;
}

.font-light {
  font-weight: 300;
}

// ========================================
// RESPONSIVO
// ========================================

@media (max-width: $breakpoint-tablet) {
  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  p {
    font-size: 13px;
  }
}

@media (max-width: $breakpoint-mobile) {
  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 18px;
  }

  p {
    font-size: 12px;
  }
}
```

---

## 3️⃣ ATUALIZAR APP.COMPONENT

**Arquivo:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Rollout Portal';
}
```

**Arquivo:** `src/app/app.component.html`

```html
<div class="app-container">
  <router-outlet></router-outlet>
</div>
```

**Arquivo:** `src/app/app.component.scss`

```scss
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}
```

---

## 4️⃣ CONFIGURAR PRIMENG

### angular.json

**Arquivo:** `angular.json` (na seção `styles`)

```json
"styles": [
  "src/styles.scss",
  "node_modules/primeng/resources/primeng.min.css",
  "node_modules/primeicons/primeicons.css"
]
```

**NÃO use** `@primeuix/themes` se der erro. Use apenas:
- `primeng.min.css`
- `primeicons.css`

### app.config.ts

**Arquivo:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
  ]
};
```

### app.routes.ts

**Arquivo:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/rollout-score/pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  }
];
```

---

## 5️⃣ TSCONFIG.JSON

**Arquivo:** `tsconfig.json`

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ],
    "paths": {
      "@app/*": ["src/app/*"],
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

---

## 6️⃣ ANGULAR.JSON (COMPLETO)

**Arquivo:** `angular.json` (seção importante)

```json
{
  "projects": {
    "frontend": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/frontend",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss",
              "node_modules/primeng/resources/primeng.min.css",
              "node_modules/primeicons/primeicons.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "frontend:build:production"
            },
            "development": {
              "browserTarget": "frontend:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

---

## 7️⃣ ENVIRONMENTS

### environment.ts

**Arquivo:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Rollout Portal',
  appVersion: '1.0.0',
  logLevel: 'debug'
};
```

### environment.prod.ts

**Arquivo:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.seu-backend.com/api',
  appName: 'Rollout Portal',
  appVersion: '1.0.0',
  logLevel: 'error'
};
```

---

## 8️⃣ .GITIGNORE

**Arquivo:** `.gitignore` (na raiz)

```
# Dependencies
node_modules/
npm-debug.log*
yarn-error.log*

# Build output
/dist/
/tmp/
/out-tsc/
/bazel-out/

# Angular
.angular
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db

# Testing
/coverage/
/test-results/
.nyc_output/

# Environment
.env.local
.env.*.local
.pem
.key

# Vercel
.vercel/
.vercelignore

# System
.AppleDouble
.LSOverride
*.bak
*.tmp
*.cache
```

---

## 9️⃣ VERCEL.JSON

**Arquivo:** `vercel.json`

```json
{
  "projectSettings": {
    "nodeVersion": "18.x"
  },
  "buildCommand": "ng build --configuration production",
  "outputDirectory": "dist/frontend",
  "framework": "angular",
  "env": [
    {
      "key": "API_URL",
      "value": "https://api.seu-backend.com"
    }
  ],
  "rewrites": [
    {
      "source": "/:path((?!api|_next|_static|favicon.ico).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/.*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## 🔟 README.MD

**Use o README-MELHORADO.md** que já criei:

```bash
cp ../Gestão\ de\ Rollout\ Gradual\ por\ Score/TEMPLATES/README-MELHORADO.md README.md
```

---

## 📋 ESTRUTURA FINAL

Depois de fazer tudo, sua pasta deve ter:

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── core/
│   │   ├── shared/
│   │   ├── layout/
│   │   ├── features/
│   │   └── styles/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   ├── index.html       ← COM FONTS
│   ├── styles.scss      ← COM FONTS E VARS
│   └── main.ts
│
├── .agentes/            ← Copiar daqui
│   ├── README.md
│   ├── frontend-professor.md
│   └── ...
│
├── .gitignore           ← Criar
├── .angular/
├── dist/
├── angular.json         ← Atualizar
├── tsconfig.json        ← Atualizar
├── tsconfig.app.json
├── package.json
├── vercel.json          ← Criar
├── README.md            ← Copiar
└── node_modules/
```

---

## ✅ CHECKLIST

- [ ] Adicionou fonts no `index.html` OU em `styles.scss`
- [ ] Atualizou `styles.scss` com variáveis e tipografia
- [ ] Atualizou `angular.json` com estilos
- [ ] Criou `app.config.ts` com providers
- [ ] Criou `app.routes.ts`
- [ ] Atualizou `tsconfig.json` com paths
- [ ] Criou `environment.ts` e `environment.prod.ts`
- [ ] Criou `.gitignore`
- [ ] Criou `vercel.json`
- [ ] Copiar `.agentes/` de `Gestão de Rollout...`
- [ ] Copiar `README.md`

---

## 🚀 PRÓXIMO PASSO

```bash
# Na raiz de frontend
ng serve --port 6008 --open

# Deve rodar SEM ERROS com:
# - Fonts Lato e Open Sans aplicadas
# - Cores corporativas
# - Variáveis SCSS
# - PrimeNG configurado
```

---

**Pronto para implementar? Me avise o caminho do projeto e vou criar todos os arquivos!** 🚀
