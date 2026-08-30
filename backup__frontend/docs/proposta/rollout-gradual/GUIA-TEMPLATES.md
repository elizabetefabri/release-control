# 📋 Guia: Como Usar os Templates

Este documento explica como usar os templates criados (`.gitignore`, `README.md`, `vercel.json`) no seu projeto Angular real.

---

## 📁 Templates Disponíveis

Dentro da pasta `TEMPLATES/`:

```
TEMPLATES/
├── .gitignore        # Configuração Git
├── README.md         # Documentação completa
└── vercel.json       # Configuração Vercel
```

---

## 🚀 Passo a Passo

### Passo 1: Criar Projeto Angular

```bash
ng new rollout-portal --package-manager=npm --skip-git=true --routing=true --style=scss
cd rollout-portal
```

### Passo 2: Copiar Templates

**Opção A: Copiar manualmente**

1. Abra `TEMPLATES/.gitignore`
2. Copie todo o conteúdo
3. Cole na raiz do projeto em `rollout-portal/.gitignore`
4. Repita para `README.md` e `vercel.json`

**Opção B: Via terminal (Linux/Mac)**

```bash
# Copiar .gitignore
cp TEMPLATES/.gitignore ../rollout-portal/.gitignore

# Copiar README.md (sobrescrever padrão)
cp TEMPLATES/README.md ../rollout-portal/README.md

# Copiar vercel.json
cp TEMPLATES/vercel.json ../rollout-portal/vercel.json
```

**Opção C: Via PowerShell (Windows)**

```powershell
# Copiar .gitignore
Copy-Item "TEMPLATES\.gitignore" -Destination "..\rollout-portal\.gitignore"

# Copiar README.md
Copy-Item "TEMPLATES\README.md" -Destination "..\rollout-portal\README.md"

# Copiar vercel.json
Copy-Item "TEMPLATES\vercel.json" -Destination "..\rollout-portal\vercel.json"
```

### Passo 3: Customizar Conforme Necessário

Edite os arquivos se precisar ajustar:

#### **.gitignore**
```bash
# Se usar outras ferramentas, adicione aqui
# Exemplo: Cargo para Rust
/target/

# Ou build específico
/build/
/out/
```

#### **README.md**
```markdown
# Linhas para customizar:
- Linha 5-8: Badges (badges.io)
- Linha 12: Link demo (seu domínio Vercel)
- Linha 40-41: Seu usuário GitHub
- Qualquer referência específica ao seu projeto
```

#### **vercel.json**
```json
// Linhas para customizar:
- Linha 9: "API_URL" → seu backend URL
- Linha 13: "ENVIRONMENT" → dev/prod
- Linha 31: "/api/:path*" → seus endpoints específicos
```

### Passo 4: Inicializar Git

```bash
cd rollout-portal

# Inicializar
git init

# Adicionar todos
git add .

# Commit inicial
git commit -m "chore: initial commit - Rollout Portal setup"

# Adicionar remote
git remote add origin https://github.com/seu-usuario/rollout-portal.git

# Push
git branch -M main
git push -u origin main
```

### Passo 5: Verificar Tudo

```bash
# Rodar projeto
ng serve --open

# Verificar que não há erros
# DevTools (F12) → Console deve estar limpo
```

---

## ✅ Checklist Pós-Setup

- [ ] Projeto criado com Angular CLI
- [ ] Templates copiados (`.gitignore`, `README.md`, `vercel.json`)
- [ ] Arquivo `.gitignore` está na raiz
- [ ] Git inicializado
- [ ] Primeiro commit feito
- [ ] Repositório criado no GitHub
- [ ] Push para main (sem erros)
- [ ] Vercel conectado (opcional, para depois)

---

## 🔧 Customizações Comuns

### 1. Mudar Domínio Vercel

No `vercel.json`, atualize:

```json
{
  "env": [
    {
      "key": "API_URL",
      "value": "https://api.seu-dominio-real.com",  // ← Altere aqui
      "type": "string"
    }
  ]
}
```

### 2. Adicionar Variáveis de Ambiente

No `vercel.json`:

```json
{
  "env": [
    { "key": "API_URL", "value": "..." },
    { "key": "FEATURE_FLAG_X", "value": "true" },  // ← Nova var
    { "key": "ANALYTICS_ID", "value": "GA-..." }   // ← Nova var
  ]
}
```

### 3. Mudar Node Version

No `vercel.json`:

```json
{
  "projectSettings": {
    "nodeVersion": "20.x"  // ← Altere aqui (18, 19, 20, etc)
  }
}
```

### 4. Adicionar Mais Regras no .gitignore

```bash
# No final de .gitignore

# Meus arquivos específicos
/meu-diretorio/
*.log
arquivo-temporario.txt
```

---

## 📚 O Que Cada Template Faz

### .gitignore
**Função:** Impede que certos arquivos sejam commitados

**Protege:**
- `node_modules/` - Dependências (são reinstaladas com npm install)
- `.vscode/` - Configurações pessoais do editor
- `.env.local` - Variáveis de ambiente sensíveis
- `dist/` - Build output
- `.angular/` - Cache do CLI

**Benefício:** Repositório limpo e seguro

### README.md
**Função:** Documentação do projeto

**Inclui:**
- Como instalar
- Como rodar
- Tech stack
- Deploy na Vercel
- Estrutura de pastas
- Padrões de commits
- Convenções de nomes
- Roadmap futuro

**Benefício:** Developers conseguem se onboard rapidamente

### vercel.json
**Função:** Configuração automática para Vercel

**Define:**
- Build command
- Output directory
- Variáveis de ambiente
- Rewrite rules (SPA routing)
- Headers de segurança
- Cache policies

**Benefício:** Deploy sem configuração manual na UI

---

## 🆘 Troubleshooting

### Problema: Git ignora arquivo que deveria commitar

**Solução:**
```bash
# Remover do .gitignore
# Depois:
git add arquivo.ts
git commit -m "re-add file"
```

### Problema: Vercel reclama de build

**Solução:**
```bash
# Verificar que build funciona localmente
ng build

# Se tudo certo, é config do vercel.json
# Verifique "buildCommand" e "outputDirectory"
```

### Problema: Variáveis de ambiente não funcionam

**Solução:**
```typescript
// Em environment.ts
export const environment = {
  apiUrl: process.env['API_URL'] || 'https://localhost:4200'
};

// Usar em service
constructor() {
  console.log(environment.apiUrl);
}
```

### Problema: Arquivo não foi ignorado (já estava commitado)

**Solução:**
```bash
# Remover do histórico Git
git rm --cached node_modules -r
git commit -m "remove node_modules from tracking"

# Adicionar ao .gitignore
echo "node_modules/" >> .gitignore

# Commit
git commit -m "add node_modules to gitignore"
```

---

## 📞 Próximas Ações

Após copiar os templates:

1. **✅ Executar Etapas 01-02:**
   - Criar projeto Angular
   - Limpar arquivo desnecessários

2. **✅ Executar Etapas 03-06:**
   - Instalar PrimeNG
   - Criar estrutura de pastas
   - Setup visual

3. **✅ Inicializar Git:**
   - Copiar `.gitignore`
   - Primeiro commit

4. **✅ Preparar Deploy:**
   - Conectar Vercel
   - Configurar `vercel.json`

---

## 📖 Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Vercel Docs](https://vercel.com/docs)
- [Angular CLI Guide](https://angular.io/cli)
- [Git Documentation](https://git-scm.com/doc)

---

**Dúvidas?** Consulte `.agentes/README.md` para saber qual agente chamar.

**Status:** Pronto para usar! ✅
