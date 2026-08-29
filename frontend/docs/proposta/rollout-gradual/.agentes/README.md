# 🤖 ARQUITETURA BMAD - Base Modular Architecture Driven

## 📌 O que é BMAD?

BMAD é um sistema de **agentes especializados** que validam código e orientam o desenvolvimento do frontend. Cada agente tem responsabilidades específicas e padrões claros a validar.

---

## 👥 Agentes Especializados

### 1️⃣ **Frontend Professor** (`frontend-professor.md`)
👩‍🏫 Ensina Angular v17, TypeScript e boas práticas.

**Quando chamar:**
- "Explique Observable"
- "Como devo estruturar este serviço?"
- "Esse componente segue boas práticas?"
- "Como usar injeção de dependência?"

**Valida:**
- ✅ TypeScript strict mode
- ✅ Tipos bem definidos
- ✅ RxJS e Observables
- ✅ Padrões clean code
- ✅ Single Responsibility Principle

---

### 2️⃣ **Angular Architect** (`angular-architect.md`)
🏗️ Garante arquitetura escalável, modular e enterprise.

**Quando chamar:**
- "Como devo organizar este arquivo?"
- "Essa feature está bem estruturada?"
- "Onde devo colocar este service?"
- "Como implementar lazy loading?"

**Valida:**
- ✅ Estrutura de pastas (core/shared/features)
- ✅ Modularização
- ✅ Lazy loading preparado
- ✅ Guards e Interceptors
- ✅ Separação de responsabilidades

---

### 3️⃣ **UI Dashboard Specialist** (`ui-dashboard-specialist.md`)
🎨 Garante design corporativo, acessível e profissional.

**Quando chamar:**
- "Como devo estruturar este dashboard?"
- "A cor está adequada?"
- "Como mostrar score visualmente?"
- "Essa tabela está clara?"
- "É acessível?"

**Valida:**
- ✅ Paleta de cores
- ✅ CSS Grid
- ✅ Cards e componentes
- ✅ Tipografia e hierarquia
- ✅ Acessibilidade WCAG
- ✅ Tabelas e dados

---

### 4️⃣ **Responsive Reviewer** (`responsive-reviewer.md`)
📱 Garante que funciona em iPhone, tablet, notebook e desktop.

**Quando chamar:**
- "Como fazer responsivo?"
- "Funciona em mobile?"
- "Como criar grid responsivo?"
- "Qual deve ser o font-size em mobile?"

**Valida:**
- ✅ Mobile first (base em 320px)
- ✅ Breakpoints: mobile, tablet, desktop, wide
- ✅ Media queries corretas
- ✅ Touch areas (48px mínimo)
- ✅ Sem scroll horizontal
- ✅ Tipografia escalável

---

### 5️⃣ **Datadog Future Integration** (`datadog-future-integration.md`)
📊 Prepara frontend para observabilidade com Datadog (FASE 4).

**Quando chamar:**
- "Preciso rastrear esta ação?"
- "Como preparar para Datadog?"
- "Qual é o naming correto para eventos?"
- "Como logar isto corretamente?"
- "Isso tem PII (dados sensíveis)?"

**Valida:**
- ✅ Logger Service existe
- ✅ Error handling centralizado
- ✅ Events mapeados
- ✅ TypeScript strict
- ✅ Nenhum PII nos logs
- ✅ Nomes consistentes

---

## 📋 Como Usar os Agentes

### Padrão de Uso

Quando tiver dúvida sobre código, **sempre peça o agente correto**:

```
Problema → Agente
==================
"Qual é a melhor forma de estruturar isto?" → Frontend Professor ou Angular Architect
"Este layout está bom?" → UI Dashboard Specialist
"Funciona em mobile?" → Responsive Reviewer
"Preciso logar isto?" → Datadog Future Integration
"Como organizar pastas?" → Angular Architect
"TypeScript está correto?" → Frontend Professor
```

---

## ✅ Checklist de Desenvolvimento

Ao criar um novo componente, validar com todos os agentes:

```
1. ✅ Frontend Professor
   - [ ] TypeScript strict mode?
   - [ ] Tipos definidos corretamente?
   - [ ] RxJS padrão correto?
   - [ ] Clean code?

2. ✅ Angular Architect
   - [ ] Pasta correta (core/shared/features)?
   - [ ] Service organizado?
   - [ ] Responsabilidades separadas?

3. ✅ UI Dashboard Specialist
   - [ ] Cores da paleta?
   - [ ] Grid responsivo?
   - [ ] Acessível?
   - [ ] Tipografia correta?

4. ✅ Responsive Reviewer
   - [ ] Mobile first?
   - [ ] Media queries corretas?
   - [ ] Touch areas 48px?
   - [ ] Sem scroll horizontal?

5. ✅ Datadog Future Integration
   - [ ] Logger Service usado?
   - [ ] Events mapeados?
   - [ ] Nenhum PII?
   - [ ] Nomes consistentes?
```

---

## 🎯 Estrutura de Validação

Cada agente tem:

1. **📌 Objetivo** - O que faz
2. **🎯 Responsabilidades** - Suas funções
3. **📋 Padrões Obrigatórios** - Regras que valida
4. **✅ Checklist** - O que verificar
5. **🔍 Exemplos** - ✅ BOM vs ❌ RUIM
6. **📚 Quando Chamar** - Seus gatilhos
7. **🚀 Próximos Passos** - Como continua

---

## 🗂️ Estrutura de Pastas

```
.agentes/
├── README.md                          (Este arquivo)
├── frontend-professor.md              (Ensino e padrões TypeScript)
├── angular-architect.md               (Arquitetura e organização)
├── ui-dashboard-specialist.md         (Design e UX)
├── responsive-reviewer.md             (Mobile e responsividade)
└── datadog-future-integration.md      (Observabilidade)
```

---

## 🎓 Exemplo Prático de Uso

**Cenário:** Você criou um novo componente `RolloutCard`

**Passo 1:** Chamar **Frontend Professor**
```
"Revise este componente RolloutCard para TypeScript e padrões Angular"
→ Valida tipos, RxJS, clean code
```

**Passo 2:** Chamar **Angular Architect**
```
"Está na pasta correta? Como devo organizar?"
→ Valida se está em features/rollout-score/components
```

**Passo 3:** Chamar **UI Dashboard Specialist**
```
"Como devo estilizar este card? Cores corretas?"
→ Valida cores, espaçamento, acessibilidade
```

**Passo 4:** Chamar **Responsive Reviewer**
```
"Está responsivo em mobile e desktop?"
→ Valida breakpoints, media queries
```

**Passo 5:** Chamar **Datadog Future Integration**
```
"Como devo logar a ação de clique aqui?"
→ Valida eventos, logging, nomes
```

---

## 🔑 Padrões Globais Obrigatórios

Aplicam a **todos os agentes**:

### 1. TypeScript Strict Mode
```typescript
// ✅ OBRIGATÓRIO
"compilerOptions": {
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}
```

### 2. Nenhum `any`
```typescript
// ✅ BOM
function processRollout(rollout: Rollout): void { }

// ❌ NUNCA
function processRollout(rollout: any): void { }
```

### 3. RxJS com Pipe
```typescript
// ✅ BOM
this.rolloutService.getRollouts().pipe(
  tap(rollouts => console.log(rollouts)),
  catchError(error => of([]))
);

// ❌ RUIM
this.rolloutService.getRollouts().subscribe(rollouts => {
  // Lógica aqui
});
```

### 4. Injeção de Dependência
```typescript
// ✅ BOM - Angular 17+
constructor(private http = inject(HttpClient)) {}

// ✅ BOM - Tradicional
constructor(private http: HttpClient) {}

// ❌ RUIM - Global
const http = new HttpClient();
```

### 5. Componentes Standalone
```typescript
// ✅ BOM - Angular v17 padrão
@Component({
  selector: 'app-rollout-card',
  standalone: true,
  imports: [CommonModule],
  template: '...'
})
```

### 6. Services com `providedIn`
```typescript
// ✅ BOM
@Injectable({ providedIn: 'root' })
export class RolloutService { }

// ❌ RUIM - Sem providedIn
@Injectable()
export class RolloutService { }
```

### 7. TypeScript Naming
```typescript
// ✅ BOM - Classes PascalCase, functions/vars camelCase
export class RolloutService { }
export function getRolloutScore() { }
export const rolloutConfig = { };

// ❌ RUIM
export class rollout_service { }
export function GET_ROLLOUT_SCORE() { }
```

### 8. SCSS Nesting e Variáveis
```scss
// ✅ BOM
@import 'variables.scss';

.rollout-card {
  background: $bg-light;
  padding: $space-md;

  &:hover {
    background: $bg-body;
  }

  .title {
    color: $text-primary;
  }
}

// ❌ RUIM
.rollout-card {
  background: #ffffff;
}

.rollout-card:hover {
  background: #f8fafc;
}

.rollout-card .title {
  color: #242623;
}
```

### 9. Pasta Correta
```
✅ BOM:  src/app/features/rollout-score/components/rollout-card/
❌ RUIM: src/app/rollout-card/
❌ RUIM: src/app/components/rollout-card/
```

### 10. Logger Ao Invés de Console
```typescript
// ✅ BOM
this.logger.info('Rollout started', { rolloutId });

// ❌ RUIM
console.log('Rollout started:', rolloutId);
```

---

## 🚀 Próximas Etapas

Após esta FASE 1 (Frontend Angular v17), os agentes evoluem em:

- **FASE 2** - Backend: Novos agentes para Go, MongoDB, Docker
- **FASE 3** - Integração: Agentes para contrato HTTP, DTOs
- **FASE 4** - Datadog: Ativa o agente de observabilidade
- **FASE 5+** - Evolução: Agentes para testes, deploy, performance

---

## 📚 Consulte os Agentes

Sempre que tiver dúvida, abra o arquivo do agente:

- 👩‍🏫 `frontend-professor.md` - Dúvidas sobre TypeScript/Angular
- 🏗️ `angular-architect.md` - Dúvidas sobre arquitetura
- 🎨 `ui-dashboard-specialist.md` - Dúvidas sobre UI/design
- 📱 `responsive-reviewer.md` - Dúvidas sobre responsividade
- 📊 `datadog-future-integration.md` - Dúvidas sobre logging/observabilidade

---

## ✨ Filosofia BMAD

> **"Especialistas separados, validação integrada, código escalável."**

Cada agente é especialista em seu domínio, permitindo validação profunda e orientação clara sem conflitos de responsabilidade.

---

**Criado em:** 30 de maio de 2026  
**Versão:** 1.0 (FASE 1)  
**Status:** Ativo e pronto para desenvolvimento
