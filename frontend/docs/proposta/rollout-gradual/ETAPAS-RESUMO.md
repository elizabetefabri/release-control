# 📚 RESUMO DAS 6 ETAPAS - FASE 1: FRONTEND ANGULAR v17

---

## **ETAPA 01 — Instalação e Criação do Projeto Angular v17** ✅

### 🎯 Objetivo
Preparar o ambiente e criar o projeto base do Angular v17.

### 📋 O que fazer

**1.1 - Instalar Angular CLI globalmente:**
```bash
npm install -g @angular/cli
```

**1.2 - Criar novo projeto:**
```bash
ng new rollout-portal --package-manager=npm --skip-git=true --routing=true --style=scss
```

**1.3 - Entrar na pasta:**
```bash
cd rollout-portal
```

**1.4 - Iniciar servidor:**
```bash
ng serve --open
```

✅ **Resultado:** Projeto Angular v17 rodando em http://localhost:4200

---

## **ETAPA 02 — Limpeza Inicial do Projeto** ✅

### 🎯 Objetivo
Remover arquivo desnecessários, testes (Jasmine/Karma) e preparar base limpa.

### 📋 O que fazer

**2.1 - Remover Jasmine/Karma:**
- Abrir `angular.json` e remover seção `"test"`
- Remover arquivos: `src/app/app.component.spec.ts`, `karma.conf.js`, `src/test.ts`
- Em `package.json`, remover: `jasmine-core`, `karma`, `karma-*`, `@types/jasmine`
- Executar: `npm install`

**2.2 - Limpar app.component.html:**
```html
<router-outlet></router-outlet>
```

**2.3 - Organizar app.component.ts:**
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rollout-portal';
}
```

**2.4 - Limpar estilos (app.component.scss e styles.scss):**
- Remover todos os estilos padrão
- Deixar apenas reset básico em `styles.scss`

**2.5 - Verificar:**
```bash
ng serve
```
✅ Página em branco, sem erros = sucesso!

---

## **ETAPA 03 — Setup Visual e Biblioteca de Componentes** ✅

### 🎯 Objetivo
Instalar PrimeNG, configurar temas e preparar base visual.

### 📋 O que fazer

**3.1 - Instalar PrimeNG:**
```bash
npm install primeng primeicons
```

**3.2 - Instalar dependências adicionais:**
```bash
npm install chart.js ng2-charts
```

**3.3 - Configurar PrimeNG em angular.json:**

No campo `"styles"`, adicionar:
```json
"styles": [
  "src/styles.scss",
  "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
  "node_modules/primeng/resources/primeng.min.css",
  "node_modules/primeicons/primeicons.css"
]
```

**3.4 - Criar arquivo de variáveis:**

Criar: `src/styles/variables.scss`

Adicionar todas as cores corporativas (ver detalhes na Etapa 05 acima)

**3.5 - Atualizar styles.scss global:**

Importar variáveis e adicionar reset/base (ver detalhes acima)

✅ **Resultado:** PrimeNG configurado, tema aplicado

---

## **ETAPA 04 — Estrutura de Pastas** ✅

### 🎯 Objetivo
Criar estrutura modular BMAD para escalabilidade.

### 📋 O que fazer

**4.1 - Criar pastas principais:**

```bash
cd src/app

# Core - Serviços globais
mkdir -p core/interceptors core/guards core/services

# Shared - Componentes reutilizáveis
mkdir -p shared/components shared/directives shared/pipes shared/interfaces

# Layout - Estrutura visual
mkdir -p layout/header layout/nav layout/footer

# Features - Rollout Score
mkdir -p features/rollout-score/pages features/rollout-score/components features/rollout-score/services features/rollout-score/models

# Assets
mkdir -p assets/images assets/icons

cd ../..
```

**4.2 - Verificar estrutura:**
```
src/app/
├── core/
├── shared/
├── layout/
├── features/
├── assets/
└── styles/
```

✅ **Resultado:** Pastas organizadas para crescimento futuro

---

## **ETAPA 05 — Configuração do Tema Visual** ✅

### 🎯 Objetivo
Criar header, nav, footer e aplicar tema corporativo.

### 📋 O que fazer

**5.1 - Gerar Header component:**
```bash
ng generate component layout/header --skip-tests
```

**5.2 - Gerar Nav component:**
```bash
ng generate component layout/nav --skip-tests
```

**5.3 - Atualizar app.component.html:**
```html
<div class="app-container">
  <app-header></app-header>
  <app-nav></app-nav>
  <main class="app-main">
    <router-outlet></router-outlet>
  </main>
</div>
```

**5.4 - Estilizar app.component.scss:**
- Grid container
- Header azul (#0F3CAA) com logo Itaú laranja
- Nav com breadcrumb (#f4f2f1)
- Main com max-width 1440px
- Responsividade mobile-first

**5.5 - Cores corporativas aplicadas:**

Header (azul corporativo):
- Background: #0F3CAA
- Texto: #ffffff
- Logo: #F75F00 (laranja Itaú)

Nav (cinza claro):
- Background: #f4f2f1
- Texto: #011c5f (azul escuro)

✅ **Resultado:** Header e Nav profissionais, cores aplicadas

---

## **ETAPA 06 — Configuração BMAD e Agentes** ✅

### 🎯 Objetivo
Criar sistema de agentes especializados para validação arquitetural.

### 📋 O que fazer

**6.1 - Criar pasta .agentes:**
```bash
mkdir -p .agentes
```

**6.2 - Criar 5 arquivos de agentes:**

1. **frontend-professor.md**
   - Ensina Angular v17 e TypeScript
   - Valida tipos, padrões, clean code

2. **angular-architect.md**
   - Valida arquitetura
   - Garante modularização, lazy loading

3. **ui-dashboard-specialist.md**
   - Valida design corporativo
   - Garante acessibilidade, cores, grids

4. **responsive-reviewer.md**
   - Valida responsividade mobile-first
   - Testa breakpoints: mobile, tablet, desktop

5. **datadog-future-integration.md**
   - Prepara para observabilidade (FASE 4)
   - Valida logging, eventos, segurança

**6.3 - Criar README.md em .agentes:**
- Explicação de cada agente
- Como usar
- Padrões globais obrigatórios

✅ **Resultado:** Sistema BMAD pronto para validação profissional

---

## 📊 Status da FASE 1

| Etapa | Descrição | Status |
|-------|-----------|--------|
| 01 | Instalação Angular v17 | ✅ Completo |
| 02 | Limpeza do projeto | ✅ Completo |
| 03 | Setup PrimeNG e temas | ✅ Completo |
| 04 | Estrutura de pastas | ✅ Completo |
| 05 | Tema visual e components | ✅ Completo |
| 06 | BMAD e agentes | ✅ Completo |

---

## 🎯 Próximos Passos (Você deve fazer)

### Passo 1: Executar Etapas 01-02
```bash
ng new rollout-portal --package-manager=npm --skip-git=true --routing=true --style=scss
cd rollout-portal
# Remover testes (ver Etapa 02)
# Limpar HTML, SCSS
ng serve
```

### Passo 2: Executar Etapas 03-04
```bash
npm install primeng primeicons chart.js ng2-charts
# Configurar angular.json
# Criar estrutura de pastas
```

### Passo 3: Executar Etapas 05-06
```bash
ng generate component layout/header --skip-tests
ng generate component layout/nav --skip-tests
# Estilizar
# Criar .agentes
```

### Passo 4: Validar Tudo
```bash
ng serve
# Abrir http://localhost:4200
# Verificar: Header azul, Nav cinza, Breadcrumb
# Testar responsividade (F12 > Mobile)
```

---

## 🎓 Próximas Aulas (APÓS completar Etapas 01-06)

Quando terminar as 6 etapas, criaremos:

### 📌 Etapa 07 — Dashboard Inicial
- Página de dashboard
- Cards com métricas
- Grid responsivo

### 📌 Etapa 08 — Componentes Reutilizáveis
- Button, Card, Badge
- Usando PrimeNG

### 📌 Etapa 09 — Services e Mocks
- RolloutService
- ScoreService
- Dados em TypeScript

### 📌 Etapa 10 — Tabela de Rollouts
- P-Table com dados
- Filtros, paginação
- Actions

### 📌 Etapa 11 — Score Visual
- Gauge de score
- Progress bars
- Status indicators

### 📌 Etapa 12 — Routing e Navegação
- Rotas lazy loading
- Guarda de rotas
- Navegação completa

---

## 📚 Referências

### Pastas de Agentes
```
.agentes/
├── README.md
├── frontend-professor.md
├── angular-architect.md
├── ui-dashboard-specialist.md
├── responsive-reviewer.md
└── datadog-future-integration.md
```

### Cores Corporativas
```scss
Header:     #0F3CAA (azul)
Orange:     #F75F00 (Itaú)
Text:       #242623 (preto)
Secondary:  #4c4847 (cinza)
Nav BG:     #f4f2f1 (cinza claro)
Body BG:    #f8fafc (azul claro)
```

### Stack
- ✅ Angular v17
- ✅ TypeScript strict
- ✅ SCSS com variáveis
- ✅ PrimeNG
- ✅ Mobile first
- ✅ CSS Grid
- ✅ Responsividade

---

## ⚠️ Regras Obrigatórias (BMAD)

1. **TypeScript strict mode** - Sempre
2. **Nenhum `any`** - Sempre
3. **Componentes standalone** - Angular v17
4. **Services com providedIn** - Injeção DI
5. **RxJS com pipe** - Não subscriptions diretas
6. **Mobile first** - Sempre
7. **CSS Grid** - Para layouts
8. **Logger Service** - Não console.log
9. **Pastas organizadas** - core/shared/features
10. **Validação de agentes** - Antes de commitar

---

## 🚀 Comece Agora!

```bash
# Terminal
ng new rollout-portal --package-manager=npm --skip-git=true --routing=true --style=scss
cd rollout-portal
ng serve --open

# Browser abrirá em http://localhost:4200
# Você verá: "rollout-portal app is running!"

# Próximo: Limpar projeto (Etapa 02)
```

---

**Status:** Pronto para começar!  
**Próxima Aula:** Etapa 01 (Instalação) + Etapa 02 (Limpeza)  
**Data:** 30 de maio de 2026  
**Versão:** 1.0 - FASE 1 Frontend Angular v17
