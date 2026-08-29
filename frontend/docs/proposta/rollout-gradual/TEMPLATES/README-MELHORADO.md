# 🎯 Frontend — Rollout Portal

<div align="center">

[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SCSS](https://img.shields.io/badge/SCSS-Latest-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-17+-FF6B6B?style=for-the-badge&logo=angular&logoColor=white)](https://primeng.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Dashboard corporativo para gerenciamento de rollouts graduais com score**

🌐 [Live Demo](#-demo) • 📚 [Documentação](#-documentação) • 🏗️ [Arquitetura](#-arquitetura) • 🚀 [Deploy](#-deploy-na-vercel)

[GitHub](https://github.com/elizabetefabri/score-gradual) • [Issues](https://github.com/elizabetefabri/score-gradual/issues) • [Releases](https://github.com/elizabetefabri/score-gradual/releases)

</div>

---

## 🎯 O que é o Rollout Portal?

**Rollout Portal** é um **dashboard corporativo moderno** para gerenciamento de **rollouts graduais com score**. Permite que Release Managers acompanhem, iniciem, pausem e concluam releases com base em métricas de score gradual.

### ✨ Principais Características

- 🎨 **Design Corporativo** - Inspirado em portais de release management profissionais
- 📱 **100% Responsivo** - Mobile-first, funciona perfeitamente em qualquer tamanho
- ⚡ **Performance** - Lazy loading, OnPush change detection, otimizado
- 🔐 **Type-Safe** - TypeScript strict mode em 100%
- 🧩 **Componentes Reutilizáveis** - Arquitetura modular BMAD
- 🎯 **Observável** - Preparado para Datadog RUM (FASE 4)
- 🚀 **Pronto para Produção** - Segurança, headers, cache policies
- 🌐 **Deploy Simplificado** - Vercel ready, CI/CD automático

### 🎓 Arquitetura BMAD

O projeto segue a arquitetura **BMAD (Base Modular Architecture Driven)** com **5 agentes especializados**:

1. **👩‍🏫 Frontend Professor** - Padrões TypeScript e Angular
2. **🏗️ Angular Architect** - Estrutura e modularização
3. **🎨 UI Specialist** - Design corporativo e acessibilidade
4. **📱 Responsive Reviewer** - Mobile-first e responsividade
5. **📊 Datadog Integration** - Preparação para observabilidade

---

## 🛠️ Tech Stack

### Frontend
| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Angular** | v17+ | Framework SPA moderno |
| **TypeScript** | 5.0+ | Linguagem type-safe |
| **SCSS** | Latest | Estilos escaláveis |
| **PrimeNG** | 17+ | Componentes corporativos |
| **RxJS** | 7.8+ | Programação reativa |
| **Chart.js** | 4.4+ | Gráficos e métricas |

### Tooling & DevOps
| Ferramenta | Uso |
|-----------|-----|
| **Angular CLI** | Scaffolding e build |
| **npm** | Package manager |
| **Vercel** | Hosting e deploy |
| **GitHub** | Versionamento |

### Futuro (Backend + Observabilidade)
| Tecnologia | Fase | Timeline |
|-----------|------|----------|
| **Go** | 2 | Backend API |
| **MongoDB** | 2 | Base de dados |
| **Docker** | 2 | Containerização |
| **Datadog RUM** | 4 | Observabilidade |

---

## 📦 Instalação

### Pré-requisitos
- **Node.js** v18+ ([Download](https://nodejs.org))
- **npm** v9+ (incluso no Node)
- **Git** configurado com SSH

### Passo 1: Clonar Repositório

```bash
git clone https://github.com/elizabetefabri/score-gradual.git
cd score-gradual/frontend
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Verificar Instalação

```bash
ng version
# Deve mostrar Angular CLI 17.x.x
```

---

## 🚀 Como Rodar Localmente

### Iniciar Servidor de Desenvolvimento

```bash
ng serve --open --port 6008
```

**Flags úteis:**
- `--open` - Abre automaticamente no navegador
- `--port 6008` - Porta customizada
- `--watch` - Recarrega ao detectar mudanças (padrão)
- `--poll 2000` - Para WSL/Docker

**Acesse:** http://localhost:6008

### Parar o Servidor

```bash
Ctrl + C
```

### Comandos Úteis

```bash
# Build produção
ng build --configuration production

# Lint do código
ng lint

# Gerar componente
ng generate component src/app/layout/header --skip-tests

# Gerar service
ng generate service src/app/core/services/rollout --skip-tests
```

---

## 🌐 Demo Online

**Acesse a versão online em produção:**

```
https://score-gradual.vercel.app
```

Versão de desenvolvimento está em:
```
http://localhost:6008
```

---

## 🚀 Deploy na Vercel

### Opção 1: Deploy Automático (Recomendado)

#### 1.1 Preparar Repositório

```bash
git add .
git commit -m "chore: setup frontend"
git push origin main
```

#### 1.2 Conectar Vercel

1. Ir para [vercel.com](https://vercel.com)
2. Clicar **New Project**
3. Selecionar repositório GitHub `elizabetefabri/score-gradual`
4. Clicar **Import**

#### 1.3 Configurar Build

Vercel detecta Angular automaticamente:
```
Framework: Angular
Build Command: ng build --configuration production
Output Directory: dist/frontend
```

#### 1.4 Deploy

Clicar **Deploy** e aguardar ~2 minutos.

**Resultado:** Seu app estará em `frontend-[hash].vercel.app`

### Opção 2: Deploy via CLI

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

---

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                     # Serviços globais
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── services/
│   │   │
│   │   ├── shared/                   # Componentes reutilizáveis
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── interfaces/
│   │   │
│   │   ├── layout/                   # Estrutura visual
│   │   │   ├── header/
│   │   │   ├── nav/
│   │   │   └── footer/
│   │   │
│   │   ├── features/                 # Features específicas
│   │   │   └── rollout-score/
│   │   │       ├── pages/
│   │   │       ├── components/
│   │   │       ├── services/
│   │   │       └── models/
│   │   │
│   │   ├── styles/
│   │   └── app.component.ts
│   │
│   ├── assets/
│   └── main.ts
│
├── .angular/                         # Cache Angular
├── dist/                             # Build output
├── .gitignore
├── angular.json
├── tsconfig.json
├── package.json
├── vercel.json
└── README.md
```

### 🔑 Explicação das Pastas

| Pasta | Função |
|-------|--------|
| **core/** | Serviços globais (Auth, HTTP, Guards). Carregado uma vez. |
| **shared/** | Componentes e utilities reutilizáveis em qualquer lugar. |
| **layout/** | Header, Nav, Footer. Estrutura visual fixa. |
| **features/** | Cada feature em seu módulo (rollout-score, etc). |
| **styles/** | Variáveis SCSS globais e tema corporativo. |
| **assets/** | Imagens, ícones, fontes estáticas. |

---

## 📝 Padrões de Commits

### Convenção: Conventional Commits

```
<tipo>(<escopo>): <assunto>

<corpo (opcional)>

<rodapé (opcional)>
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **feat** | Nova funcionalidade | `feat(rollout): adicionar gauge de score` |
| **fix** | Correção de bug | `fix(header): corrigir logo clipped em mobile` |
| **refactor** | Refatoração | `refactor(services): separar responsabilidades` |
| **style** | Mudanças SCSS/layout | `style(dashboard): aumentar espaçamento` |
| **docs** | Documentação | `docs: adicionar guia de deployment` |
| **chore** | Configurações, deps | `chore: atualizar Angular para v17.1` |
| **perf** | Performance | `perf(table): lazy load com virtual scroll` |

### ✅ Exemplos Válidos

```bash
# ✅ BOM
git commit -m "feat(rollout-score): adicionar componente gauge"
git commit -m "fix(header): corrigir posicionamento logo mobile"

# ❌ RUIM
git commit -m "mudei o dashboard"
git commit -m "fix stuff"
```

### 🌿 Branch Naming

```
feature/score-gauge           # Featurenova
fix/header-logo-bug           # Correção
docs/deployment-guide         # Documentação
refactor/service-separation   # Refatoração
```

---

## 🏷️ Convenção de Nomes

### Componentes

```typescript
// Arquivo: rollout-card.component.ts
// Classe: RolloutCardComponent (PascalCase)
// Seletor: app-rollout-card (kebab-case)

@Component({
  selector: 'app-rollout-card',
  standalone: true,
  templateUrl: './rollout-card.component.html',
  styleUrl: './rollout-card.component.scss'
})
export class RolloutCardComponent {
  @Input() rollout!: Rollout;
  @Output() selected = new EventEmitter<Rollout>();
}
```

### Services

```typescript
// Arquivo: rollout.service.ts
// Classe: RolloutService (PascalCase)

@Injectable({ providedIn: 'root' })
export class RolloutService {
  getRollouts(): Observable<Rollout[]> {
    return this.http.get<Rollout[]>('/api/rollouts');
  }
}
```

### Interfaces

```typescript
// Arquivo: rollout.interface.ts

export interface Rollout {
  id: string;
  name: string;
  score: number;
  status: 'draft' | 'in-progress' | 'paused' | 'completed';
}
```

### SCSS Classes

```scss
// kebab-case para classes CSS
.rollout-card {
  background-color: $bg-light;
  padding: $space-lg;

  &:hover {
    background-color: $bg-body;
  }

  .card-title {
    color: $text-primary;
  }
}
```

### Variáveis

```typescript
// camelCase para variáveis
let rollouts: Rollout[];
const apiUrl = 'https://api.example.com';

// Com $ para Observables
rollouts$: Observable<Rollout[]>;
isLoading$: BehaviorSubject<boolean>;
```

---

## 🏗️ Arquitetura

### BMAD (Base Modular Architecture Driven)

O projeto usa um sistema de **5 agentes especializados** para validação:

```
├── 👩‍🏫 Frontend Professor
│   └─ Valida TypeScript, Angular, padrões
│
├── 🏗️ Angular Architect
│   └─ Valida arquitetura, modularização
│
├── 🎨 UI Dashboard Specialist
│   └─ Valida design, acessibilidade
│
├── 📱 Responsive Reviewer
│   └─ Valida mobile-first, responsividade
│
└── 📊 Datadog Integration
    └─ Valida logging, observabilidade
```

Consulte `.agentes/` para padrões detalhados.

---

## 🔐 Segurança

### Headers de Segurança

Vercel aplica automaticamente:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Cache Policy

```
/assets/*       → Cache: 1 ano (immutable)
/index.html     → Cache: sempre revalidar
/main.js        → Cache: sempre revalidar
```

### Boas Práticas

- ✅ TypeScript strict mode
- ✅ Nenhum `any` no código
- ✅ Sanitização de HTML
- ✅ HTTPS only
- ✅ CSP headers

---

## 📊 Performance

### Otimizações Implementadas

- ✅ Lazy loading de features
- ✅ OnPush change detection
- ✅ Tree-shaking de imports
- ✅ Minificação de JS/CSS
- ✅ Gzip compression
- ✅ Image optimization

### Métricas

```
Size (gzipped): ~156 kB
Load time: ~2s (3G)
Lighthouse: 95+
```

---

## 🧪 Testes

Testes serão implementados na FASE 2.

---

## 🚀 Roadmap

### 📌 FASE 1: Frontend Angular v17 ✅ (Maio 2026)
- [x] Setup inicial
- [ ] Dashboard features
- [ ] Deploy Vercel

### 📌 FASE 2: Backend (Julho 2026)
- [ ] API Go REST
- [ ] MongoDB local
- [ ] Docker + Docker Compose

### 📌 FASE 3: Integração (Agosto 2026)
- [ ] Frontend + Backend
- [ ] HTTP real
- [ ] Environment files

### 📌 FASE 4: Observabilidade (Outubro 2026)
- [ ] Datadog RUM
- [ ] Logs centralizados
- [ ] Dashboards de monitoramento

---

## 📚 Documentação

- 📖 **Arquitetura BMAD** → `.agentes/README.md`
- 👩‍🏫 **Padrões TypeScript** → `.agentes/frontend-professor.md`
- 🏗️ **Estrutura Angular** → `.agentes/angular-architect.md`
- 🎨 **Design** → `.agentes/ui-dashboard-specialist.md`
- 📱 **Responsividade** → `.agentes/responsive-reviewer.md`
- 📊 **Observabilidade** → `.agentes/datadog-future-integration.md`

---

## 🤝 Contribuindo

### Passos para Contribuir

1. Fork o repositório
2. Crie branch feature: `git checkout -b feature/sua-feature`
3. Implemente seguindo padrões BMAD
4. Commit: `git commit -m "feat(scope): descrição"`
5. Push: `git push origin feature/sua-feature`
6. Abra Pull Request

### Validação Obrigatória

Antes de commitar, valide com os 5 agentes:
- ✅ Frontend Professor (TypeScript)
- ✅ Angular Architect (Estrutura)
- ✅ UI Specialist (Design)
- ✅ Responsive Reviewer (Mobile)
- ✅ Datadog Integration (Logging)

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👤 Sobre

**Desenvolvido por:** elizfab | Dev

- 🔗 [GitHub](https://github.com/elizabetefabri)
- 📧 Email: elizabetesousafabri@gmail.com
- 💼 LinkedIn: [LinkedIn](https://linkedin.com)

---

## 🎯 Links Úteis

| Recurso | Link |
|---------|------|
| **Projeto** | https://github.com/elizabetefabri/score-gradual |
| **Issues** | https://github.com/elizabetefabri/score-gradual/issues |
| **Releases** | https://github.com/elizabetefabri/score-gradual/releases |
| **Demo Online** | https://score-gradual.vercel.app |
| **Docs Angular** | https://angular.io/docs |
| **Docs PrimeNG** | https://primeng.org |
| **Docs Vercel** | https://vercel.com/docs |

---

<div align="center">

## 🎉 Pronto para Começar?

**Clone o repositório e comece a desenvolver!**

```bash
git clone https://github.com/elizabetefabri/score-gradual.git
cd score-gradual/frontend
npm install
ng serve --open --port 6008
```

**Versão online:** https://score-gradual.vercel.app

[⬆ Voltar ao topo](#-frontend--rollout-portal)

---

**Made with ❤️ by elizfab | Dev**

</div>
