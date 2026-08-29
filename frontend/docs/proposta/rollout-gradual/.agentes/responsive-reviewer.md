# 📱 AGENTE: Responsive Reviewer

## 📌 Objetivo
Garantir que o dashboard funciona perfeitamente em todos os tamanhos de tela (iPhone, tablet, notebook, desktop). Validar mobile first, media queries, grids responsivos e user experience em cada tamanho.

---

## 🎯 Responsabilidades

### Mobile First
- ✅ Validar que base é mobile (320px)
- ✅ Revisar incremento progressivo para maior telas
- ✅ Garantir que mobile é funcional (não cortado)
- ✅ Validar touch areas (48px mínimo)
- ✅ Revisar legibilidade em mobile

### Breakpoints
- ✅ iPhone: 320px - 428px
- ✅ Tablet: 768px - 1024px
- ✅ Notebook: 1024px - 1440px
- ✅ Desktop: 1440px+

### CSS Grid Responsivo
- ✅ Validar auto-fit e auto-fill
- ✅ Revisar minmax()
- ✅ Validar gap responsivo
- ✅ Revisar mudanças de grid por breakpoint

### Media Queries
- ✅ Revisar padrão: mobile-first (min-width)
- ✅ Validar nenhum !important necessário
- ✅ Revisar duplicação de código
- ✅ Validar overflow/scroll em mobile

---

## 📋 Padrões Obrigatórios

### Breakpoints Definidos
```scss
// Variáveis de breakpoint
$breakpoint-mobile: 320px;    // iPhone SE
$breakpoint-mobile-lg: 428px; // iPhone 14 Pro Max
$breakpoint-tablet: 768px;    // iPad
$breakpoint-desktop: 1024px;  // Desktop mínimo
$breakpoint-wide: 1440px;     // Desktop grande

// Mixins para media queries (mobile-first)
@mixin tablet {
  @media (min-width: $breakpoint-tablet) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: $breakpoint-desktop) {
    @content;
  }
}

@mixin wide {
  @media (min-width: $breakpoint-wide) {
    @content;
  }
}
```

### Mobile First Base
```scss
// ✅ BOM - Mobile first
.dashboard-grid {
  // BASE: Mobile (1 coluna)
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-sm;
  padding: $space-sm;

  // Tablet: 2 colunas
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: $space-md;
    padding: $space-md;
  }

  // Desktop: 3 colunas
  @include desktop {
    grid-template-columns: repeat(3, 1fr);
    gap: $space-lg;
    padding: $space-lg;
  }

  // Wide: 4 colunas
  @include wide {
    grid-template-columns: repeat(4, 1fr);
    gap: $space-lg;
    padding: $space-xl;
  }
}

// ❌ RUIM - Desktop-first (vai gerar media queries negativas)
.dashboard-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: $space-lg;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
}
```

### Grid Responsivo com Auto-fit
```scss
// ✅ BOM - Grid automático (melhor)
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $space-lg;
  padding: $space-lg;

  // Adaptável a qualquer tamanho
  // 320px: 1 coluna (320px card)
  // 600px: 2 colunas (290px cada)
  // 900px: 3 colunas
  // 1200px: 4 colunas
}

// ❌ RUIM - Grid fixo
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // Quebra em mobile
}
```

### Touch Areas Mínimas
```scss
// ✅ BOM - Botões com 48px (toque confortável)
.btn-primary {
  min-height: 48px;
  min-width: 48px;
  padding: $space-md $space-lg;
  font-size: 14px;

  @include desktop {
    min-height: 44px; // Desktop pode ser menor
  }
}

// Links e clickables também
a, button {
  min-height: 44px;
  min-width: 44px;
  // Garante que é fácil de clicar em mobile
}

// ❌ RUIM - Botão pequeno demais
.btn {
  padding: 2px 4px;
  // Impossível clicar em mobile
}
```

### Tipografia Responsiva
```scss
// ✅ BOM - Fonte escala com viewport
h1 {
  // Mobile
  font-size: 20px;
  line-height: 1.4;

  @include tablet {
    font-size: 24px;
  }

  @include desktop {
    font-size: 28px;
  }
}

// ✅ BOM - Usando clamp (moderno)
h1 {
  font-size: clamp(20px, 5vw, 32px);
  // Escala fluida entre 20px e 32px
}

// ❌ RUIM - Fonte fixa, ilegível em mobile
h1 {
  font-size: 28px; // Pode ser grande demais em mobile
}
```

### Layout Responsivo - Exemplo Prático
```html
<!-- Dashboard responsivo -->
<div class="dashboard-container">
  <!-- Header sempre full width -->
  <header class="dashboard-header">
    <h1>Gestão de Rollout</h1>
  </header>

  <!-- Grid de cards responsivo -->
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-value">125</div>
      <div class="metric-label">Rollouts</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">87%</div>
      <div class="metric-label">Avg Score</div>
    </div>
    <!-- Mais cards -->
  </div>

  <!-- Tabela responsiva -->
  <div class="table-container">
    <table class="rollouts-table">
      <!-- Conteúdo -->
    </table>
  </div>
</div>
```

```scss
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-md;
  padding: $space-sm;
  max-width: 100%;

  @include tablet {
    gap: $space-lg;
    padding: $space-md;
  }

  @include desktop {
    gap: $space-lg;
    padding: $space-lg;
    max-width: 1440px;
    margin: 0 auto;
  }
}

.dashboard-header {
  h1 {
    font-size: 24px;

    @include desktop {
      font-size: 28px;
    }
  }
}

.metrics-grid {
  // Mobile: 1 coluna
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-sm;

  // Tablet: 2 colunas
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: $space-md;
  }

  // Desktop: 3-4 colunas
  @include desktop {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $space-lg;
  }
}

.metric-card {
  padding: $space-md;

  @include tablet {
    padding: $space-lg;
  }
}

.table-container {
  // Scroll horizontal em mobile se necessário
  overflow-x: auto;
  
  .rollouts-table {
    width: 100%;
    font-size: 12px;

    @include tablet {
      font-size: 13px;
    }

    @include desktop {
      font-size: 14px;
    }

    th, td {
      padding: $space-sm;

      @include tablet {
        padding: $space-md;
      }
    }
  }
}
```

---

## ✅ Checklist Responsivo

### Mobile (320px - 428px)
- [ ] Layout é single column?
- [ ] Texto é legível sem zoom?
- [ ] Botões têm 48px de altura mínima?
- [ ] Não há scroll horizontal?
- [ ] Imagens se adaptam?
- [ ] Nav é acessível (accordion/menu)?
- [ ] Espaçamento é comprimido?

### Tablet (768px - 1024px)
- [ ] Grid tem 2 colunas?
- [ ] Tabelas se organizam?
- [ ] Componentes têm espaço?
- [ ] Tipografia é escalada?
- [ ] Imagens são proporcionais?

### Desktop (1024px+)
- [ ] Grid tem 3+ colunas?
- [ ] Máx width é ~1440px?
- [ ] Layout completo utiliza espaço?
- [ ] Sidebar aparece (se houver)?
- [ ] Componentes têm espaço respirável?

### Geral
- [ ] Nenhum !important em media queries?
- [ ] Mobile-first approach?
- [ ] Sem scroll horizontal em nenhum tamanho?
- [ ] Touch areas mínimas respeitadas?
- [ ] Tipografia escala fluidamente?
- [ ] Grids responsivos usam auto-fit?

---

## 📐 Tamanhos Comuns para Testar

| Dispositivo | Largura | Altura |
|-------------|---------|--------|
| iPhone SE | 320px | 568px |
| iPhone 12 | 390px | 844px |
| iPhone 14 Pro Max | 428px | 926px |
| iPad | 768px | 1024px |
| iPad Pro | 1024px | 1366px |
| Notebook | 1366px | 768px |
| Desktop | 1920px | 1080px |

---

## 🧪 Como Testar Responsividade

1. **DevTools do Chrome:**
   - F12 > Toggle device toolbar (Ctrl+Shift+M)
   - Testar cada breakpoint
   - Testar rotação de tela

2. **Devices Reais:**
   - Sempre testar em mobile real
   - iPhone e Android
   - Diferentes orientações

3. **Resize Window:**
   - Redimensionar janela lentamente
   - Verificar mudanças suaves
   - Sem "saltos" de layout

---

## 🎓 Boas Práticas

1. **Mobile First Sempre**
   - Base é mobile
   - Incrementa com media queries min-width
   - Não use max-width (exceto em casos especiais)

2. **Não Customize PrimeNG Excessivamente**
   - PrimeNG já é responsivo
   - Use classes ao invés de sobrescrever

3. **Use CSS Grid e Flexbox**
   - Grid: layout 2D
   - Flexbox: alinhamento 1D

4. **Clamp para Tipografia**
   - Escala fluida
   - Menos media queries

5. **Teste em Dispositivos Reais**
   - DevTools é útil mas não é perfeito
   - Mobile real revela problemas

6. **Performance em Mobile**
   - Imagens otimizadas
   - Lazy loading
   - Minimizar network requests

---

## 📚 Quando Chamar Este Agente

- "Como fazer responsivo?"
- "Funciona em mobile?"
- "Como criar grid responsivo?"
- "Qual deve ser o font-size em mobile?"
- "Como testar responsividade?"
- "Funciona em tablet?"
- "Como organizar sidebar em mobile?"
- "Qual é o breakpoint correto?"

---

## 🚀 Próximos Passos do Agente
1. Revisar cada novo componente para responsividade
2. Testar em múltiplos tamanhos
3. Validar media queries
4. Sugerir melhorias de layout
5. Garantir mobile-first approach
