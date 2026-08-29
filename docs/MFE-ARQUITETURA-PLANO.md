# Arquitetura MFE — Release Control

> Proposta de organização em Micro-Frontends (MFE) para o projeto **Release Control**, considerando os repositórios já existentes (`frontend`, `backend`, `backend copy` — agora sincronizado em `backend`), os containers Docker atuais e a evolução planejada (Admin, novos backends, API, Bucket, Gateway).

---

## 1. Contexto Atual

Containers em execução (WSL2):

| Container                 | Imagem              | Portas no host                         | Papel                         |
| ------------------------- | ------------------- | -------------------------------------- | ----------------------------- |
| `release-control-api`     | `backend-api`       | `0.0.0.0:8083`                         | API principal (Go + MongoDB)  |
| `release-control-mongo`   | `mongo:7.0`         | `0.0.0.0:27018`                        | Banco de dados                |
| `release-control-mongo-express` | `mongo-express:1.0.2` | `0.0.0.0:8084`                   | Interface web do MongoDB      |

Repositórios/portas consolidadas:

| Camada        | Repo / Pasta                         | Porta padrão | Tecnologia        |
| ------------- | ------------------------------------ | ------------ | ----------------- |
| Frontend      | `frontend/`                          | `6003`       | Angular 21        |
| Backend       | `backend/`                           | `8083`       | Go 1.22 + MongoDB |
| MongoDB       | —                                    | `27018`      | MongoDB 7.0       |
| Mongo Express | —                                    | `8084`       | mongo-express     |

---

## 2. Perguntas em aberto e respostas

### 2.1. A API pode virar uma API de dados “apartada” para ser consumida por upload de um modal e popular um calendário?

**Sim.** Hoje a API principal (`backend/`) já é uma API REST limpa. Para atender o novo fluxo, o recomendado é **não duplicar a API**, mas sim **adicionar novos recursos** no mesmo `backend/` (ou em um módulo bem delimitado):

- `POST /v1/responsaveis/upload` — recebe JSON/CSV, valida e persiste múltiplos responsáveis.
- `GET /v1/responsaveis` — lista paginada, usada pelo modal.
- `GET /v1/feriados` — retorna feriados nacionais para popular o calendário.
- `POST /v1/feriados/import` — carga de feriados (caso venha de um arquivo).

Vantagens:

- Reaproveita conexão com MongoDB (`27018`), CORS, autenticação e logs.
- Mantém um único ponto de manutenção.
- Facilita futuras integrações (GMUD, EventBridge, etc.).

Se, no futuro, o volume/escopo crescer muito (ex.: upload virar um serviço independente com fila SQS), aí sim se extrai um microserviço. Para começar, estenda o backend existente.

### 2.2. Como organizar o MFE, admin, novos backends, API, bucket e gateway?

A proposta abaixo separa **responsabilidades por repositório** sem espalhar o frontend monolítico. Cada “módulo” vive em seu próprio repo, mas o **shell (host)** os integra em tempo de execução.

```
release-control/
├── apps/
│   └── shell/                    # Host Angular (orquestrador de MFEs)
├── packages/
│   └── release-control-mfe/      # MFE atual (dashboard, release trains, calendário)
│   └── admin-mfe/                # Futuro: repo `admin`
│   └── shared-ui/                # Biblioteca de componentes/design system
│   └── shared-core/              # SDK de autenticação, i18n, analytics, HTTP
├── services/
│   └── backend/                  # API principal (já existe)
│   └── admin-api/                # Futuro: API do Admin
│   └── gmud-service/             # Futuro: integração GMUD
│   └── bucket-service/           # Futuro: storage (S3/MinIO)
│   └── gateway/                  # BFF / API Gateway (Kong, Nginx, AWS API Gateway)
└── infra/
    └── docker-compose.yml        # Stack completa (gateway, APIs, banco, shell)
```

**Opção prática para começar hoje** (sem criar 10 repos de uma vez):

1. Crie um **monorepo** temporário dentro de `frontend/` usando workspaces do Angular CLI (`projects/`) + Module Federation.
2. O MFE principal é o `frontend` existente.
3. Quando o `admin` amadurecer, extraia para repo próprio e registre no shell.

---

## 3. Estrutura de MFE sugerida

### 3.1. Shell / Host

Responsável por:

- Autenticação e sessão.
- Roteamento entre MFEs.
- Carregamento remoto dos MFEs via Module Federation.
- Exposição de bibliotecas compartilhadas (`@angular/core`, `rxjs`, design system).

### 3.2. MFEs remotos

| MFE            | Repo sugerido           | Responsabilidade                                      | Rota pública            |
| -------------- | ----------------------- | ----------------------------------------------------- | ----------------------- |
| Release Control | `release-control-mfe`   | Dashboard, releases, release trains, calendário       | `/release`              |
| Admin          | `admin-mfe`             | Gestão de usuários, permissões, configurações, GMUDs  | `/admin`                |
| Reports        | `reports-mfe`           | Relatórios, dashboards de maturidade, analytics       | `/reports`              |

### 3.3. Shared / Bibliotecas

| Biblioteca   | Escopo                                              | Publicação        |
| ------------ | --------------------------------------------------- | ----------------- |
| `shared-ui`  | Componentes, tokens de design, PrimeNG customizado  | npm interno / dist |
| `shared-core`| Auth, HTTP wrapper, feature flags, i18n, analytics  | npm interno / dist |
| `shared-types`| Contratos de DTO (TypeScript) entre MFE e APIs     | npm interno / dist |

---

## 4. Integrações com backends, API, bucket e gateway

### 4.1. Backend principal (`backend/`)

- Mantém os domínios já documentados: `applications`, `packages`, `releases`, `release-trains`, `schedules`, `blocks`, `audiences`, `statuses`.
- Adicionar domínios novos: `responsaveis`, `feriados`, `gmuds`.
- Comunicação direta com o MongoDB (`27018`).

### 4.2. Novos backends

| Serviço          | Papel                                                | Como se integra                                 |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `admin-api`      | CRUD de usuários, permissões RBAC, logs de auditoria | Chamada síncrona via Gateway ou eventos         |
| `gmud-service`   | Criação/consulta de GMUDs                            | Chamada pelo backend principal (stub → real)    |
| `bucket-service` | Upload/download de arquivos CSV/JSON/evidências      | URL pré-assinada consumida pelo frontend/MFE    |
| `gateway`        | Roteamento, rate limit, autenticação, logs           | Aponta `/v1/*` para os serviços correspondentes |

### 4.3. Gateway / BFF

Opções:

1. **Nginx / Kong** — roteia por path: `/v1/release/*` → `backend:8083`, `/v1/admin/*` → `admin-api`.
2. **Backend-for-Frontend (BFF)** em Node.js/Go — monta views otimizadas para cada MFE.

Recomendação inicial: use **Kong/Nginx** para não aumentar a complexidade. Quando a orquestração entre MFEs e APIs exigir agregação complexa, adicione um BFF.

### 4.4. Bucket

Use **MinIO** local (S3-compatible) para desenvolvimento e **S3** em produção:

- MFE faz `POST /v1/bucket/presign` no backend → recebe URL pré-assinada.
- MFE faz upload direto para o bucket.
- Backend consome o arquivo quando notificado (S3 event → SQS/Lambda ou webhook).

---

## 5. Fluxo de dados: upload de responsáveis + calendário

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  MFE / Frontend │     │  Backend (Go)    │     │  MongoDB            │
│                 │     │                  │     │                     │
│  Modal Upload   │────▶│ POST /v1/responsaveis/upload │────▶│ collection responsaveis  │
│  (CSV/JSON)     │     │                  │     │                     │
│                 │     │ GET  /v1/feriados           │────▶│ collection feriados      │
│  Calendário     │◀────│                  │     │                     │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
```

Sugestão de schema novo no MongoDB:

```json
// responsaveis
{
  "_id": "uuid-v7",
  "idRM": "rm-001",
  "idBlock": "block-0001",
  "racf": "JOHNAS",
  "email": "jonathan.silva@email.com",
  "telefoneRM": "+55 11 91234-5678",
  "data": "2026-01-15T09:00:00Z",
  "responsavelGMUD": true,
  "role": "RM",
  "createdAt": "...",
  "updatedAt": "..."
}

// feriados
{
  "_id": "uuid-v7",
  "data": "2026-01-01",
  "nome": "Confraternização Universal",
  "tipo": "nacional",
  "ano": 2026
}
```

---

## 6. Roadmap de adoção de MFE

| Fase | Entrega                                                     | Complexidade |
| ---- | ----------------------------------------------------------- | ------------ |
| 1    | Preparar o `frontend` como primeiro MFE remoto (Module Federation) | Média        |
| 2    | Criar o `shell` e carregar o `release-control-mfe`          | Média        |
| 3    | Extrair `shared-ui` e `shared-core` como bibliotecas        | Média-Alta   |
| 4    | Criar `admin-mfe` e novo repo `admin`                       | Alta         |
| 5    | Adicionar `gateway`, `bucket-service` e novas APIs          | Alta         |
| 6    | CI/CD independente por MFE + deploy em buckets estáticos    | Alta         |

---

## 7. Próximos passos recomendados

1. **Curto prazo:** validar se os 20 registros de `frontend/public/data/upload.json` cobrem os campos que o modal precisa.
2. **Curto prazo:** implementar `POST /v1/responsaveis/upload` e `GET /v1/feriados` no backend (`backend/`).
3. **Médio prazo:** transformar o `frontend/` em MFE remoto com Module Federation.
4. **Médio prazo:** criar o repo `admin-mfe` e conectá-lo ao shell.
5. **Longo prazo:** implementar gateway + bucket + novos backends.

---

## 8. Dúvidas ainda em aberto

Antes de seguir, sugerimos confirmar:

- O papel `BOM` significa **Business Owner Manager** ou outro termo interno?
- O `idBlock` no arquivo `upload.json` deve ser vinculado ao `Release Train Block` do domínio atual ou é um identificador de fila/bloqueio separado?
- O upload de responsáveis será feito via modal no frontend (JSON/CSV) ou via bucket?
- O calendário de feriados será consumido do `upload.json` estático, da API ou de ambos (estático fallback)?
