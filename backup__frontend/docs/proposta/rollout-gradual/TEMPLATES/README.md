# 🚀 Rollout Portal — Gestão de Rollout Gradual por Score

<div align="center">

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)
![SCSS](https://img.shields.io/badge/SCSS-Latest-CC6699?style=flat-square&logo=sass)
![PrimeNG](https://img.shields.io/badge/PrimeNG-17+-3DDC84?style=flat-square&logo=angular)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Dashboard corporativo para gerenciamento de rollouts gradual com score, inspirado em portais de release management.**

[🌐 Demo](#-demo) • [📚 Documentação](#-documentação) • [🛠️ Tech Stack](#-tech-stack) • [🚀 Roadmap](#-roadmap)

</div>

---

## 📌 Objetivo do Projeto

**Rollout Portal** é um dashboard corporativo moderno para gerenciamento de **rollouts graduais com score**. O sistema permite que Release Managers acompanhem, iniciem, pausem e concluam rollouts com base em métricas de score, tudo com uma interface profissional, responsiva e preparada para observabilidade.

### 🎯 Objetivos Principais

- ✅ **Interface profissional** - Design corporativo com paleta Itaú
- ✅ **Responsivo** - Mobile-first, funciona em todos os dispositivos
- ✅ **Escalável** - Arquitetura modular BMAD para crescimento
- ✅ **Observável** - Preparado para Datadog RUM (FASE 4)
- ✅ **Componentes reutilizáveis** - PrimeNG + shared components
- ✅ **Performance** - Lazy loading, OnPush change detection
- ✅ **TypeScript strict** - Type-safe em 100%

---

## 💻 Tech Stack

### Frontend
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Angular** | v17+ | Framework principal |
| **TypeScript** | 5.0+ | Linguagem com tipos |
| **SCSS** | Latest | Pré-processador CSS |
| **PrimeNG** | 17+ | Componentes corporativos |
| **RxJS** | 7.8+ | Programação reativa |
| **Chart.js** | 4.4+ | Gráficos e métricas |

### Tooling
| Ferramenta | Uso |
|-----------|-----|
| **Angular CLI** | Scaffolding e build |
| **npm** | Gerenciador de pacotes |
| **TypeScript Compiler** | Type checking strict |
| **SCSS Compiler** | Compilação de estilos |

### Deploy
| Plataforma | Uso |
|-----------|-----|
| **Vercel** | Hospedagem frontend |

### Futuro (FASE 2+)
| Tecnologia | Fase | Uso |
|-----------|------|-----|
| **Go** | 2 | Backend API |
| **MongoDB** | 2 | Base de dados |
| **Docker** | 2 | Containerização |
| **Docker Compose** | 2 | Orquestração local |
| **Datadog RUM** | 4 | Observabilidade |
| **Datadog Logs** | 4 | Logging centralizado |

---

## 🚀 Guia de Instalação

### Pré-requisitos

- **Node.js**: v18.x ou superior ([Baixar](https://nodejs.org))
- **npm**: v9.x ou superior (vem com Node.js)
- **Git**: Configurado com SSH ([Guia](https://docs.github.com/en/authentication/connecting-to-github-with-ssh))
- **Angular CLI**: v17+ (será instalado com dependências)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/rollout-portal.git
cd rollout-portal
```

### Passo 2: Instalar Dependências

```bash
npm install
```

**O que isso faz:**
- Instala Angular v17 e dependências
- Instala PrimeNG e ícones
- Instala Chart.js para gráficos
- Instala RxJS e outras libs

### Passo 3: Verificar Instalação

```bash
ng version
```

**Resultado esperado:**
```
     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \  | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \ | | | | (_| | | | | | (_| | |      | |___| |___ | |
 /_/   \_\|_| |_|\__, |_|_|_|_|\__,_|_|       \____|_____|___|
                  |___/

Angular CLI: 17.x.x
```

---

## 🏃 Como Rodar Localmente

### Iniciar Servidor de Desenvolvimento

```bash
ng serve --open
```

**Flags úteis:**
- `--open`: Abre automaticamente no navegador
- `--watch`: Recarrega ao detectar mudanças (padrão)
- `--port 4300`: Especifica porta customizada
- `--poll 2000`: Para WSL/Docker (polling de mudanças)

**Resultado:**
```
✔ Compiled successfully.

✔ Build at: 2024-05-30T10:30:00.000Z - Hash: a1b2c3d4

Initial Chunk Files | Names      | Raw Size
main.js             | -          | 156.23 kB |
styles.css          | -          | 45.12 kB |
polyfills.js        | -          | 33.45 kB |

Application bundle generation complete. [5.234 seconds]

Watch mode enabled. Watching for file changes...
```

Acesse: **http://localhost:4200**

### Parar o Servidor

```bash
# No terminal
Ctrl + C
```

### Outros Comandos Úteis

```bash
# Build produção
ng build

# Rodar testes (quando configurados)
ng test

# Lint do código
ng lint

# Gerar componente
ng generate component src/app/layout/header

# Gerar service
ng generate service src/app/core/services/rollout

# Limpar cache
rm -rf .angular node_modules
npm install
```

---

## 🌐 Deploy na Vercel

### Opção 1: Deploy Automático via Git

#### Passo 1: Configurar Repositório Git

```bash
# Inicializar git
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "Initial commit: Rollout Portal setup"

# Adicionar origin
git remote add origin https://github.com/seu-usuario/rollout-portal.git

# Push para main
git branch -M main
git push -u origin main
```

#### Passo 2: Conectar Vercel

1. Ir para [vercel.com](https://vercel.com)
2. Clicar em **New Project**
3. Selecionar seu repositório GitHub
4. Clicar **Import**

#### Passo 3: Configurar Build

Vercel detectará Angular automaticamente. Configurações default:

```
Framework Preset: Angular
Build Command: ng build
Output Directory: dist/rollout-portal
```

#### Passo 4: Deploy

Clicar **Deploy** e aguardar ~2 minutos.

**Resultado:** Seu app estará em `rollout-portal-[seu-username].vercel.app`

### Opção 2: Deploy Manual via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Verificar Deploy

```bash
# Ver status
vercel ls

# Ver logs
vercel logs rollout-portal

# Variáveis de ambiente
vercel env ls
```

### Environment Variables na Vercel

Adicione no painel Vercel → Settings → Environment Variables:

```
API_URL = https://api.seu-backend.com
ENVIRONMENT = production
```

Use em `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.seu-backend.com'
};
```

---

## 📁 Estrutura de Pastas

```
rollout-portal/
├── src/
│   ├── app/
│   │   ├── core/                     # ⭐ Serviços globais (carregam uma vez)
│   │   │   ├── guards/               # Route guards (autenticação, etc)
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/         # HTTP interceptors (headers, erro)
│   │   │   │   └── error.interceptor.ts
│   │   │   └── services/             # Serviços globais
│   │   │       ├── auth.service.ts
│   │   │       └── logger.service.ts
│   │   │
│   │   ├── shared/                   # ⭐ Reutilizável em qualquer lugar
│   │   │   ├── components/           # Componentes genéricos
│   │   │   │   ├── card/
│   │   │   │   └── button/
│   │   │   ├── directives/           # Diretivas customizadas
│   │   │   ├── pipes/                # Pipes customizados
│   │   │   └── interfaces/           # Interfaces compartilhadas
│   │   │
│   │   ├── layout/                   # ⭐ Estrutura visual principal
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.scss
│   │   │   ├── nav/
│   │   │   │   └── ...
│   │   │   └── footer/
│   │   │       └── ...
│   │   │
│   │   ├── features/                 # ⭐ Features específicas do projeto
│   │   │   ├── rollout-score/
│   │   │   │   ├── pages/            # Páginas/rotas
│   │   │   │   │   ├── rollout-list/
│   │   │   │   │   └── rollout-detail/
│   │   │   │   ├── components/       # Componentes específicos
│   │   │   │   │   ├── rollout-card/
│   │   │   │   │   └── score-gauge/
│   │   │   │   ├── services/         # Serviços da feature
│   │   │   │   │   └── rollout.service.ts
│   │   │   │   ├── models/           # Interfaces/tipos
│   │   │   │   │   └── rollout.interface.ts
│   │   │   │   └── rollout-score.routes.ts
│   │   │   │
│   │   │   └── release-trains/       # Outra feature (exemplo)
│   │   │       └── ...
│   │   │
│   │   ├── styles/                   # ⭐ Estilos globais
│   │   │   ├── variables.scss        # Cores, spacing, breakpoints
│   │   │   └── mixins.scss           # Mixins reutilizáveis
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   │
│   ├── assets/                       # Arquivos estáticos
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── environments/                 # Configurações por ambiente
│   │   ├── environment.ts            # Development
│   │   └── environment.prod.ts       # Production
│   │
│   ├── styles.scss                   # Estilos globais (import base)
│   └── main.ts
│
├── .agentes/                         # Sistema BMAD de agentes
│   ├── README.md
│   ├── frontend-professor.md
│   ├── angular-architect.md
│   ├── ui-dashboard-specialist.md
│   ├── responsive-reviewer.md
│   └── datadog-future-integration.md
│
├── .angular/                         # Cache Angular CLI (gitignore)
├── .vscode/                          # Settings VS Code
├── node_modules/                     # Dependências (gitignore)
├── dist/                             # Build output (gitignore)
├── .gitignore
├── .gitattributes
├── angular.json                      # Config Angular CLI
├── tsconfig.json                     # Config TypeScript
├── tsconfig.app.json
├── tsconfig.spec.json
├── package.json
├── package-lock.json
├── README.md
└── vercel.json                       # Config Vercel (opcional)

```

### 🔑 Explicação das Pastas Principais

| Pasta | Responsabilidade |
|-------|------------------|
| **core/** | Carregado uma vez. Auth, HTTP, guards, interceptors. |
| **shared/** | Reutilizável em qualquer lugar. Componentes genéricos, pipes, directives. |
| **layout/** | Header, Nav, Footer. Estrutura visual fixa. |
| **features/** | Cada feature em seu módulo. Rollout Score, Release Trains, etc. |
| **styles/** | Variáveis SCSS globais, mixins, tema corporativo. |
| **assets/** | Imagens, ícones, fontes estáticas. |
| **.agentes/** | Sistema BMAD de validação arquitetural. |

---

## 📝 Padrões de Commits

### Convenção: Conventional Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/) para manter histórico limpo.

### Formato

```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **feat** | Nova funcionalidade | `feat(rollout): adicionar gauge de score` |
| **fix** | Correção de bug | `fix(header): corrigir logo clipped em mobile` |
| **refactor** | Refatoração sem mudança de função | `refactor(services): separar responsabilidades` |
| **style** | Mudanças de estilo (SCSS, layout) | `style(dashboard): aumentar espaçamento cards` |
| **docs** | Documentação | `docs: adicionar guia de deployment` |
| **test** | Testes | `test(rollout-service): adicionar testes unitários` |
| **chore** | Configurações, deps | `chore: atualizar Angular para v17.1` |
| **perf** | Performance | `perf(table): lazy load com virtual scroll` |

### Escopo (Opcional)

Qual parte do projeto:
- `core`, `shared`, `layout`, `features`
- Nome do serviço: `auth-service`, `rollout-service`
- Nome do componente: `rollout-card`, `score-gauge`

### Exemplos Válidos

```bash
# ✅ BOM - Feature com escopo
git commit -m "feat(rollout-score): adicionar componente de score gauge"

# ✅ BOM - Fix com escopo
git commit -m "fix(header): corrigir posicionamento logo em mobile"

# ✅ BOM - Com corpo explicativo
git commit -m "refactor(services): separar RolloutService

- Mover lógica de filtering para service
- Adicionar caching com BehaviorSubject
- Melhorar error handling"

# ❌ RUIM - Sem tipo
git commit -m "mudei o dashboard"

# ❌ RUIM - Sem escopo significativo
git commit -m "feat: fiz algo"

# ❌ RUIM - Muito genérico
git commit -m "fix stuff"
```

### Branch Naming

```
feature/rollout-score-gauge
feature/mobile-responsiveness
fix/header-logo-bug
docs/deployment-guide
```

---

## 🏷️ Convenção de Nomes

### Componentes

```typescript
// ✅ BOM - PascalCase com "Component" no export
// src/app/features/rollout-score/components/rollout-card/rollout-card.component.ts

@Component({
  selector: 'app-rollout-card',           // kebab-case
  standalone: true,
  templateUrl: './rollout-card.component.html',
  styleUrl: './rollout-card.component.scss'
})
export class RolloutCardComponent {       // PascalCase
  @Input() rollout!: Rollout;
  @Output() selected = new EventEmitter<Rollout>();
}
```

**Padrão:**
```
✅ Classe:       RolloutCardComponent (PascalCase)
✅ Arquivo:      rollout-card.component.ts (kebab-case)
✅ Seletor:      app-rollout-card (kebab-case com "app-" prefix)
✅ Pasta:        src/app/features/rollout-score/components/rollout-card/
```

### Services

```typescript
// ✅ BOM - PascalCase com "Service" no export
// src/app/features/rollout-score/services/rollout.service.ts

@Injectable({ providedIn: 'root' })
export class RolloutService {             // PascalCase
  constructor(private http: HttpClient) {}

  getRollouts(): Observable<Rollout[]> {  // camelCase
    return this.http.get<Rollout[]>('/api/rollouts');
  }

  startRollout(id: string): Observable<Rollout> {
    return this.http.post<Rollout>(`/api/rollouts/${id}/start`, {});
  }
}
```

**Padrão:**
```
✅ Classe:       RolloutService (PascalCase)
✅ Arquivo:      rollout.service.ts (kebab-case)
✅ Métodos:      getRollouts() (camelCase)
✅ Pasta:        src/app/features/rollout-score/services/
```

### Interfaces / Models

```typescript
// ✅ BOM - PascalCase
// src/app/features/rollout-score/models/rollout.interface.ts

export interface Rollout {               // PascalCase
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'in-progress' | 'paused' | 'completed';
  score: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface RolloutCreateRequest {  // PascalCase com Request
  name: string;
  version: string;
}

export interface RolloutResponse {        // PascalCase com Response
  id: string;
  name: string;
  // ...
}
```

**Padrão:**
```
✅ Interface:    Rollout (PascalCase)
✅ Arquivo:      rollout.interface.ts (kebab-case)
✅ Propriedades: name, startDate (camelCase)
✅ Pasta:        src/app/features/rollout-score/models/
```

### SCSS / Estilos

```scss
// ✅ BOM - kebab-case para classes, PascalCase para variáveis
// src/app/features/rollout-score/components/rollout-card/rollout-card.component.scss

@import '../../../../styles/variables.scss';

.rollout-card {                           // kebab-case (classe CSS)
  background-color: $bg-light;            // $kebab-case (variável)
  padding: $space-lg;
  border-radius: $radius-md;
  box-shadow: $shadow-md;

  &:hover {
    background-color: $bg-body;
    transition: background-color $transition-normal;
  }

  .card-header {                          // kebab-case (classe filha)
    display: flex;
    justify-content: space-between;
    margin-bottom: $space-md;
  }

  .card-title {                           // kebab-case
    color: $text-primary;
    font-size: 16px;
    font-weight: 600;
  }

  .card-score {                           // kebab-case
    display: flex;
    align-items: center;
    gap: $space-sm;
  }
}

// Mobile responsiveness
@media (max-width: $breakpoint-tablet) {
  .rollout-card {
    padding: $space-md;
    margin-bottom: $space-md;
  }
}
```

**Padrão:**
```
✅ Classes:      .rollout-card (kebab-case)
✅ Variáveis:    $bg-light, $space-lg (kebab-case com $)
✅ Nesting:      BEM simplificado (.rollout-card__title)
✅ Arquivo:      rollout-card.component.scss (kebab-case)
```

### Diretivas

```typescript
// ✅ BOM - PascalCase com "Directive"
// src/app/shared/directives/highlight.directive.ts

@Directive({
  selector: '[appHighlight]',             // kebab-case com "app" prefix
  standalone: true
})
export class HighlightDirective {         // PascalCase
  constructor(private el: ElementRef) {}
}
```

**Padrão:**
```
✅ Classe:       HighlightDirective (PascalCase)
✅ Arquivo:      highlight.directive.ts (kebab-case)
✅ Seletor:      appHighlight (camelCase com "app" prefix)
✅ Pasta:        src/app/shared/directives/
```

### Pipes

```typescript
// ✅ BOM - PascalCase com "Pipe"
// src/app/shared/pipes/safe-html.pipe.ts

@Pipe({
  name: 'safeHtml',                       // camelCase
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {  // PascalCase
  transform(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }
}
```

**Padrão:**
```
✅ Classe:       SafeHtmlPipe (PascalCase)
✅ Arquivo:      safe-html.pipe.ts (kebab-case)
✅ Nome pipe:    safeHtml (camelCase)
✅ Pasta:        src/app/shared/pipes/
```

### Variáveis e Funções

```typescript
// ✅ BOM - camelCase para variáveis e funções
function calculateScore(rollout: Rollout): number {  // camelCase
  const baseScore = rollout.score;                   // camelCase
  const bonusScore = calculateBonus(rollout);        // camelCase
  return baseScore + bonusScore;
}

// ✅ BOM - camelCase com $ para Observables
rollouts$: Observable<Rollout[]>;
isLoading$: Observable<boolean>;
selectedRollout$: Observable<Rollout | null>;
```

**Padrão:**
```
✅ Variáveis:    score, baseScore (camelCase)
✅ Observables:  rollouts$, isLoading$ (camelCase com $)
✅ Constantes:   SOME_VALUE (UPPER_CASE)
✅ Funções:      calculateScore() (camelCase)
```

### Resumo Visual

```typescript
// 📁 PASTAS (kebab-case)
src/app/features/rollout-score/components/rollout-card/

// 📄 ARQUIVOS (kebab-case com sufixo específico)
rollout-card.component.ts
rollout.service.ts
rollout.interface.ts
highlight.directive.ts
safe-html.pipe.ts

// 🏷️ CLASSES (PascalCase)
class RolloutCardComponent { }
class RolloutService { }
interface Rollout { }

// 🎯 HTML/CSS SELECTORS (kebab-case com "app" prefix)
<app-rollout-card></app-rollout-card>
selector: 'app-rollout-card'

// 🎨 SCSS CLASSES (kebab-case)
.rollout-card { }
.rollout-card-header { }

// 🔤 VARIÁVEIS (camelCase)
let rollouts: Rollout[];
const apiUrl = 'https://api.com';

// 💾 SCSS VARIÁVEIS ($kebab-case)
$bg-light: #ffffff;
$space-lg: 24px;

// ⭐ OBSERVABLES (camelCase com $)
rollouts$: Observable<Rollout[]>;
isLoading$: BehaviorSubject<boolean>;
```

---

## 🚀 Roadmap Futuro

### 📋 Roadmap Completo (4 Fases)

#### **FASE 1: Frontend Angular v17** ✅ (Atual)
*Status: Em desenvolvimento*

- [x] Etapas 01-06: Setup inicial
- [ ] Etapas 07-12: Features e componentes
- [ ] Etapa 13: Testes e optimizações
- [ ] Etapa 14: Deploy na Vercel

**Timeline:** Maio-Junho 2026  
**Saída:** Dashboard funcional com mocks

---

#### **FASE 2: Backend Go + MongoDB** (Próxima)
*Estimado: Julho 2026*

**Objetivos:**
- [ ] API REST em Go
- [ ] Banco MongoDB local
- [ ] Docker + Docker Compose
- [ ] Endpoints para rollout/score
- [ ] Health checks

**Stack:**
```
Backend:      Go 1.21+
Database:     MongoDB 6.0+
Containerize: Docker + Docker Compose
Testing:      Go testing native
```

**O que criar:**
```
backend/
├── main.go
├── cmd/
├── internal/
├── pkg/
├── docker-compose.yml
├── Dockerfile
└── ...
```

**Endpoints planejados:**
```
GET    /api/v1/rollouts           # Listar rollouts
POST   /api/v1/rollouts           # Criar rollout
GET    /api/v1/rollouts/:id       # Detalhe
PATCH  /api/v1/rollouts/:id       # Atualizar
POST   /api/v1/rollouts/:id/start # Iniciar
POST   /api/v1/rollouts/:id/pause # Pausar
GET    /api/v1/scores             # Histórico de scores
POST   /api/v1/scores             # Registrar score
```

---

#### **FASE 3: Integração Frontend + Backend** (Ago-Set 2026)

**Objetivos:**
- [ ] Remover mocks do Angular
- [ ] Consumir API real
- [ ] Environment files (dev/prod)
- [ ] Trata erros HTTP
- [ ] Loading states reais
- [ ] DTOs e interfaces

**O que mudar:**
```typescript
// Antes (mock)
rollouts$ = of([{ id: '1', name: 'Feature X' }]);

// Depois (API real)
rollouts$ = this.http.get<Rollout[]>('/api/v1/rollouts').pipe(
  catchError(error => this.handleError(error))
);
```

---

#### **FASE 4: Observabilidade com Datadog** (Out 2026)

**Objetivos:**
- [ ] Integrar Datadog RUM
- [ ] Logs centralizados
- [ ] Métricas de performance
- [ ] User session replay
- [ ] Alerts automáticos
- [ ] Dashboards de monitoramento

**O que implementar:**
```typescript
// Datadog RUM
datadogRum.init({
  applicationId: 'APP_ID',
  clientToken: 'TOKEN',
  service: 'rollout-portal',
  version: '1.0.0'
});

// Eventos customizados
dd_rum.addAction('rollout_started', { rolloutId });

// Logs
dd_logs.logger.info('User logged in');
```

---

### 📊 Timeline Visual

```
MAIO 2026
├── ✅ FASE 1: Frontend Angular v17
│   ├── Etapas 01-06 (Setup + BMAD)
│   ├── Etapas 07-12 (Features)
│   └── Etapas 13-14 (Testes + Deploy)
│
JULHO 2026
├── ⏳ FASE 2: Backend Go + MongoDB
│   ├── Setup inicial
│   ├── Endpoints CRUD
│   └── Docker local
│
AGOSTO 2026
├── ⏳ FASE 3: Integração Frontend + Backend
│   ├── Remover mocks
│   ├── Consumir API
│   └── Tratamento de erros
│
OUTUBRO 2026
└── ⏳ FASE 4: Datadog + Observabilidade
    ├── RUM integration
    ├── Logging centralizado
    └── Alertas e dashboards
```

---

### 🔄 Evolução da Arquitetura

```
FASE 1 - Frontend Standalone
┌─────────────────────────┐
│   Angular v17 (SPA)     │
│  - Mocks em TypeScript  │
│  - localStorage (estado)│
└─────────────────────────┘
           ↓
FASE 2 - Adiciona Backend
┌─────────────────────────┐
│   Angular v17 (SPA)     │
├─────────────────────────┤
│   Go API (REST)         │
│   MongoDB               │
│   Docker local          │
└─────────────────────────┘
           ↓
FASE 3 - Integração Total
┌─────────────────────────┐
│   Angular v17 (SPA)     │
│ - Sem mocks             │
│ - HTTP real             │
│ - Environment files     │
├─────────────────────────┤
│   Go API (REST)         │
│   MongoDB               │
│   Docker Compose        │
└─────────────────────────┘
           ↓
FASE 4 - Observabilidade
┌─────────────────────────┐
│   Angular v17 (SPA)     │
│ + Datadog RUM           │
├─────────────────────────┤
│   Go API                │
│   + Datadog APM         │
├─────────────────────────┤
│   Datadog Dashboard     │
│   Logs + Metrics + RUM  │
└─────────────────────────┘
```

---

### 📚 Documentação por Fase

| Fase | Frontend | Backend | DevOps | Observabilidade |
|------|----------|---------|--------|-----------------|
| 1 | Angular v17 + PrimeNG | - | - | - |
| 2 | - | Go + MongoDB | Docker | - |
| 3 | HTTP Integration | - | - | - |
| 4 | - | - | - | Datadog RUM + Logs |

---

## 🤝 Contribuindo

### Passos para Contribuir

1. **Crie branch:**
   ```bash
   git checkout -b feature/sua-feature
   ```

2. **Implemente com padrões BMAD:**
   - Consulte `.agentes/README.md`
   - Valide com os 5 agentes

3. **Commit com Conventional Commits:**
   ```bash
   git commit -m "feat(rollout-score): adicionar novo componente"
   ```

4. **Push:**
   ```bash
   git push origin feature/sua-feature
   ```

5. **Abra Pull Request**

---

## 📖 Documentação Adicional

- 📚 **Arquitetura BMAD** → `.agentes/README.md`
- 👩‍🏫 **Padrões TypeScript** → `.agentes/frontend-professor.md`
- 🏗️ **Estrutura Angular** → `.agentes/angular-architect.md`
- 🎨 **Design Corporativo** → `.agentes/ui-dashboard-specialist.md`
- 📱 **Responsividade** → `.agentes/responsive-reviewer.md`
- 📊 **Observabilidade** → `.agentes/datadog-future-integration.md`

---

## 📄 License

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

Desenvolvido por **elizfab | Dev**

- GitHub: [@elizfab](https://github.com/elizfab)
- Email: elizabetesousafabri@gmail.com

---

## 🙌 Agradecimentos

- **Itaú** - Inspiração em paleta de cores e design corporativo
- **PrimeNG** - Componentes profissionais
- **Angular Team** - Framework robusto e moderno
- **Vercel** - Deploy simplificado

---

<div align="center">

**⭐ Se este projeto ajudou, considere dar uma star! ⭐**

[↑ Voltar ao topo](#-rollout-portal--gestão-de-rollout-gradual-por-score)

</div>
