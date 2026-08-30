# Plano de Desenvolvimento — Release Trains API (Go)

> Baseado na documentação dos endpoints, modelos de dados, regras de negócio e fluxos EventBridge.
> Siga a ordem das fases. Cada passo é um entregável concreto.

---

## FASE 1 — Definições de Stack e Estrutura Base

**Passo 1 — Confirmar stack tecnológica**
- Item 1.1: Go (versão mínima 1.22) como linguagem principal
- Item 1.2: PostgreSQL como banco de dados relacional (suporta UUID nativo, constraints FK)
- Item 1.3: AWS Lambda como runtime de deploy (detectado em `lambda.go`)
- Item 1.4: AWS EventBridge Scheduler para automações (Flow 1 e Flow 2)
- Item 1.5: LocalStack (via Docker) para emular AWS localmente
- Item 1.6: Chi ou Gin como HTTP router (definir antes de iniciar handlers)
- Item 1.7: `golang-migrate` para migrations de banco
- Item 1.8: `godotenv` + `viper` para gerenciamento de configurações

---

**Passo 2 — Estrutura de pastas (Hexagonal / Clean Architecture)**

```
release-trains-api/
├── app/
    ├── cmd/
│   ├── api/              # Entrypoint HTTP (local/dev)
│   └── lambda/           # Entrypoint Lambda (prod)
├── internal/
│   ├── domain/
│   │   ├── entity/       # Structs de domínio (Application, Package, Release, etc.)
│   │   ├── enum/         # Enums: ReleaseStatus, ReleaseTrainStatus, Audiences, WeekDays
│   │   └── port/
│   │       ├── in/       # Interfaces dos use cases (contratos de entrada)
│   │       └── out/      # Interfaces dos repositórios e serviços externos
│   ├── usecase/          # Regras de negócio (um arquivo por recurso)
│   ├── adapters/
│   │   ├── in/
│   │   │   ├── http/     # Handlers HTTP, DTOs request/response, router
│   │   │   └── event/    # Lambda handler, EventBridge handler (lambda.go)
│   │   └── out/
│   │       ├── postgres/ # Implementações dos repositórios (SQL)
│   │       ├── eventbridge/ # Publisher de regras EventBridge
│   │       └── gmud/     # Stub do serviço GMUD
│   └── config/           # Leitura de env vars, configuração global
├── migrations/           # Arquivos SQL de migração (up/down)
├── docs/
│   ├── swagger.yaml      # OpenAPI 3.0 spec
│   └── drawio/           # Diagramas .drawio
├── scripts/
│   └── seed.sql          # Seeds: statuses, audiences
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── go.mod
├── go.sum
└── .env.example
```

---

**Passo 3 — `go.mod` e dependências principais**
- Item 3.1: `github.com/go-chi/chi/v5` (router HTTP)
- Item 3.2: `github.com/jackc/pgx/v5` (driver PostgreSQL)
- Item 3.3: `github.com/google/uuid` (UUID V7 a partir de go 1.22+ ou lib específica)
- Item 3.4: `github.com/golang-migrate/migrate/v4` (migrations)
- Item 3.5: `github.com/joho/godotenv` + `github.com/spf13/viper` (config)
- Item 3.6: `github.com/aws/aws-lambda-go` (runtime Lambda)
- Item 3.7: `github.com/aws/aws-sdk-go-v2/service/scheduler` (EventBridge Scheduler)
- Item 3.8: `github.com/swaggo/swag` (geração de swagger via annotations)
- Item 3.9: `github.com/stretchr/testify` (testes)

---

**Passo 4 — Makefile**
- Item 4.1: `make run` — sobe servidor HTTP local
- Item 4.2: `make docker-up` — sobe docker-compose
- Item 4.3: `make migrate-up` — executa migrations
- Item 4.4: `make migrate-down` — reverte migrations
- Item 4.5: `make seed` — executa seed.sql
- Item 4.6: `make test` — roda todos os testes
- Item 4.7: `make swagger` — gera spec Swagger
- Item 4.8: `make build-lambda` — compila binário para Lambda (GOOS=linux)

---

**Passo 5 — Arquivo `.env.example`**
```env
APP_PORT=8080
APP_ENV=local

# Banco
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=release_trains

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT_URL=http://localhost:4566  # LocalStack

# GMUD
GMUD_SERVICE_URL=http://stub

# Segurança
JWT_SECRET=your-secret-here
```

---

## FASE 2 — Banco de Dados (Migrations)

**Passo 6 — Migrations SQL (uma por tabela, com `up` e `down`)**

- Item 6.1: `000001_create_release_statuses.sql`
  - `id UUID PRIMARY KEY`, `name VARCHAR UNIQUE NOT NULL`, `description TEXT`, `created_at TIMESTAMPTZ`

- Item 6.2: `000002_create_release_train_statuses.sql`
  - `id UUID PRIMARY KEY`, `name VARCHAR UNIQUE NOT NULL`, `description TEXT`, `created_at TIMESTAMPTZ`

- Item 6.3: `000003_create_audiences.sql`
  - `id UUID PRIMARY KEY`, `name VARCHAR UNIQUE NOT NULL`, `parent_id UUID REFERENCES audiences(id)`, `created_at`, `updated_at`

- Item 6.4: `000004_create_applications.sql`
  - `id UUID PRIMARY KEY`, `repository_name VARCHAR`, `repository_url TEXT`, `journey_name TEXT`, `path TEXT`, `is_active BOOLEAN DEFAULT true`, `created_at`, `updated_at`

- Item 6.5: `000005_create_packages.sql`
  - `id UUID PRIMARY KEY`, `parent_id UUID REFERENCES packages(id)`, `application_id UUID REFERENCES applications(id)`, `taac_id VARCHAR`, `is_blocked BOOLEAN`, `is_active BOOLEAN`, `commit_sha VARCHAR(64)`, `pull_request_url TEXT`, `story VARCHAR NOT NULL`, `created_at`, `updated_at`, `deleted_at`

- Item 6.6: `000006_create_release_train_schedules.sql`
  - `id UUID PRIMARY KEY`, `name VARCHAR`, `is_active BOOLEAN`, `start_at VARCHAR(5)`, `start_date TIMESTAMPTZ`, `end_date TIMESTAMPTZ`, `week_days TEXT[]`, `max_previous_scheduling_hours INT`, `created_at`, `updated_at`

- Item 6.7: `000007_create_release_train_blocks.sql`
  - `id UUID PRIMARY KEY`, `date TIMESTAMPTZ NOT NULL`, `observation TEXT`, `created_at`, `updated_at`

- Item 6.8: `000008_create_release_trains.sql`
  - `id UUID PRIMARY KEY`, `status_id UUID REFERENCES release_train_statuses(id)`, `name VARCHAR NOT NULL`, `is_paused BOOLEAN`, `is_stepped_back BOOLEAN`, `start_at TIMESTAMPTZ`, `end_at TIMESTAMPTZ`, `created_at`, `updated_at`

- Item 6.9: `000009_create_releases.sql`
  - `id UUID PRIMARY KEY`, `package_id UUID REFERENCES packages(id)`, `release_train_id UUID REFERENCES release_trains(id)`, `release_train_schedule_id UUID REFERENCES release_train_schedules(id)`, `release_status_id UUID REFERENCES release_statuses(id)`, `gmud VARCHAR`, `racf VARCHAR`, `progress INT`, `release_date DATE`, `scheduled_at TIMESTAMPTZ`, `arn_event_schedule TEXT`, `created_at`, `updated_at`

- Item 6.10: `000010_create_release_audiences.sql` (tabela N-N)
  - `id UUID PRIMARY KEY`, `release_id UUID REFERENCES releases(id)`, `audience_id UUID REFERENCES audiences(id)`, `created_at`

- Item 6.11: `000011_create_release_status_history.sql`
  - `id UUID PRIMARY KEY`, `release_id UUID`, `release_status_id UUID`, `observation TEXT`, `created_at`

- Item 6.12: `000012_create_release_train_status_history.sql`
  - `id UUID PRIMARY KEY`, `release_train_id UUID`, `status_id UUID`, `observation TEXT`, `created_at`

---

**Passo 7 — Seed SQL (`scripts/seed.sql`)**
- Item 7.1: INSERT dos 11 Release Statuses (WAITING, SCHEDULED, IN_PROGRESS, PAUSED, CANCELLED, STEPBACK_REQUESTED, STEPBACK_DONE, ROLLBACK_REQUESTED, ROLLBACK_DONE, FINISHED, ERROR)
- Item 7.2: INSERT dos 6 Release Train Statuses (WAITING, IN_PROGRESS, PAUSED, CANCELLED, STEPPED_BACK, FINISHED)
- Item 7.3: INSERT das 10 Audiences (ITUBER, VAREJO-IOS, VAREJO-ANDROID, UNCLASS-IOS, UNCLASS-ANDROID, PERSON-IOS, PERSON-ANDROID, PRIVATE-IOS, PRIVATE-ANDROID, EVERYONE)
- Item 7.4: Lógica de seed no startup do app (idempotente — `INSERT ... ON CONFLICT DO NOTHING`)

---

## FASE 3 — Docker

**Passo 8 — Dockerfile (multi-stage)**
```dockerfile
# Stage 1: Builder
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/api

# Stage 2: Runtime
FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/migrations ./migrations
EXPOSE 8080
CMD ["./server"]
```

---

**Passo 9 — `docker-compose.yml` (todos os serviços)**
- Item 9.1: Serviço `app` (a API Go, porta 8080)
- Item 9.2: Serviço `postgres` (postgres:16-alpine, porta 5432, volume persistente)
- Item 9.3: Serviço `localstack` (emulação de AWS: EventBridge Scheduler, porta 4566)
- Item 9.4: Serviço `migrate` (aplica migrations automaticamente no startup, depende de `postgres`)
- Item 9.5: Healthcheck no `postgres` (pg_isready)
- Item 9.6: Rede interna `release-trains-net`
- Item 9.7: Volume `pg_data` para persistência

---

## FASE 4 — Domínio (Domain Layer)

**Passo 10 — Entidades de domínio (`internal/domain/entity/`)**
- Item 10.1: `application.go` — struct Application com todos os campos
- Item 10.2: `package.go` — struct Package (com self-reference ParentID)
- Item 10.3: `release.go` — struct Release (campos + método para verificar status terminal)
- Item 10.4: `release_audience.go` — struct ReleaseAudience
- Item 10.5: `release_train.go` — struct ReleaseTrain
- Item 10.6: `release_train_schedule.go` — struct ReleaseTrainSchedule (WeekDays como []string)
- Item 10.7: `release_train_block.go` — struct ReleaseTrainBlock
- Item 10.8: `audience.go` — struct Audience (self-reference ParentID)
- Item 10.9: `release_status.go` e `release_status_history.go`
- Item 10.10: `release_train_status.go` e `release_train_status_history.go`

---

**Passo 11 — Enums e constantes (`internal/domain/enum/`)**
- Item 11.1: `release_status.go` — constantes para os 11 status de Release
- Item 11.2: `release_train_status.go` — constantes para os 6 status de Release Train
- Item 11.3: `audience.go` — constantes para as 10 audiences
- Item 11.4: `week_day.go` — constantes SUNDAY a SATURDAY
- Item 11.5: Helper `IsTerminalStatus(status string) bool` (FINISHED, ROLLBACK_DONE, STEPBACK_DONE, CANCELLED, ERROR)

---

**Passo 12 — Helper UUID V7 (`internal/domain/`)**
- Item 12.1: `uuid.go` — função `NewUUIDv7() (uuid.UUID, error)` usando lib compatível
- Item 12.2: Garantir geração no domínio (factories), nunca no banco

---

**Passo 13 — Interfaces de repositório / portas out (`internal/domain/port/out/`)**
- Item 13.1: `application_repository.go` — Create, FindByID, FindByName, List, Delete
- Item 13.2: `package_repository.go` — Create, FindByID, FindByApplicationID, FindByCommitSha, List, Update, SoftDelete, FindForValidation
- Item 13.3: `release_repository.go` — Create, FindByID, List, Update, Delete, FindByStatusAndSchedule, FindByReleaseTrainId, FindByReleaseDate
- Item 13.4: `release_train_repository.go` — Create, FindByID, List, Update, Delete, FindByStartAtDate
- Item 13.5: `release_train_schedule_repository.go` — Create, FindByID, List (only_valid), Update, Delete, FindActiveByDate
- Item 13.6: `release_train_block_repository.go` — Create, FindByID, List, Delete, FindByDate
- Item 13.7: `audience_repository.go` — Create, FindByID, FindByParentID, List, Delete
- Item 13.8: `release_status_repository.go` e `release_train_status_repository.go` — FindByName, FindByID, List
- Item 13.9: `release_status_history_repository.go` — Create, FindLastByReleaseID
- Item 13.10: `release_train_status_history_repository.go` — Create

---

**Passo 14 — Interfaces de serviços externos / portas out**
- Item 14.1: `event_publisher.go` — `CreateScheduleRule(ctx, ruleInput) (arn string, err error)`, `DeleteScheduleRule(ctx, arn string) error`
- Item 14.2: `gmud_service.go` — `CreateGmud(ctx, releaseID, releaseTrainID string) (gmudID string, err error)`

---

**Passo 15 — Interfaces de use cases / portas in (`internal/domain/port/in/`)**
- Item 15.1: Uma interface por use case (ApplicationService, PackageService, ReleaseService, etc.)
- Item 15.2: `ReleaseTrainCreationService` (Flow 1 EventBridge)
- Item 15.3: `ReleaseAssociationService` (Flow 2 EventBridge)

---

## FASE 5 — Use Cases (`internal/usecase/`)

**Passo 16 — ApplicationUseCase**
- Item 16.1: `Create` — salva application no banco
- Item 16.2: `List` — paginado
- Item 16.3: `GetByID`
- Item 16.4: `GetPackagesByApplicationID` — paginado
- Item 16.5: `Delete`

---

**Passo 17 — PackageUseCase**
- Item 17.1: `Create` — auto-cria Application se não existir + cria Release com status WAITING
- Item 17.2: `List` — filtros combináveis (applicationId, applicationName, commitSha) + paginação
- Item 17.3: `GetByID`
- Item 17.4: `GetReleaseAudiences` — histórico de audiences do package
- Item 17.5: `Validate` — retorna `isBlocked` do package
- Item 17.6: `Update` (PATCH)
- Item 17.7: `SoftDelete`

---

**Passo 18 — ReleaseUseCase**
- Item 18.1: `Create` — valida duplicate (mesma Release IN_PROGRESS/ROLLBACK_REQUESTED no mesmo package+schedule)
- Item 18.2: `List` — filtro por releaseTrainId + paginação
- Item 18.3: `GetByID` — response com status (nome enum) e audiences (array de nomes)
- Item 18.4: `Update` (PATCH)
- Item 18.5: `Delete`
- Item 18.6: `ExecuteAction` (PUT) com as ações:
  - `postpone` — adia para novo scheduler, valida maxPreviousSchedulingHours
  - `pause` — status PAUSED + histórico
  - `stepback` — status STEPBACK_REQUESTED + histórico
  - `rollback` — status ROLLBACK_REQUESTED, bloqueia package atual, valida package target + histórico
  - `deploy` — status IN_PROGRESS + histórico
  - `rollout-result` — lógica de success/failure com transições de status + histórico

---

**Passo 19 — ReleaseTrainUseCase**
- Item 19.1: `Create` — cria RT com status WAITING + histórico
- Item 19.2: `List` — paginado
- Item 19.3: `GetByID` — response com status (nome enum)
- Item 19.4: `GetReleases` — lista releases da RT paginado
- Item 19.5: `Update` (PATCH)
- Item 19.6: `Delete`
- Item 19.7: `ExecuteAction` (PUT) com as ações:
  - `pause` — RT → PAUSED, todas as releases → PAUSED + histórico em ambas
  - `resume` — RT → IN_PROGRESS, restaura status anterior de cada release via histórico
  - `cancel` — RT → CANCELLED + todas releases → CANCELLED + histórico
  - `stepback` — RT → STEPPED_BACK + releases → STEPBACK_REQUESTED + histórico
  - `postpone` — clona releases para data futura, cancela atuais, cancela RT
- Item 19.8: `BatchActions` (PUT /batch-actions) — executa ação em múltiplas RTs

---

**Passo 20 — Auto-finish da Release Train**
- Item 20.1: Extrair lógica `checkAndFinishReleaseTrain(ctx, releaseTrainID)` como helper interno do ReleaseUseCase
- Item 20.2: Chamado toda vez que o status de uma Release muda para terminal
- Item 20.3: Verifica se TODAS as releases da RT estão em status terminal → atualiza RT para FINISHED + histórico

---

**Passo 21 — ReleaseTrainScheduleUseCase**
- Item 21.1: `Create`
- Item 21.2: `List` — filtro `only_valid=true`
- Item 21.3: `GetByID`
- Item 21.4: `Update` (PATCH) — ao desativar (`isActive=false`), cancela todas as releases associadas + histórico
- Item 21.5: `Delete` — ao deletar, cancela releases associadas + histórico

---

**Passo 22 — ReleaseTrainBlockUseCase**
- Item 22.1: `Create` — salva block + cancela RTs no intervalo da data + cancela Releases com aquela data (nessa ordem, transacional)
- Item 22.2: `List`
- Item 22.3: `GetByID`
- Item 22.4: `Delete`

---

**Passo 23 — AudienceUseCase**
- Item 23.1: `Create`
- Item 23.2: `List`
- Item 23.3: `GetByID`
- Item 23.4: `GetByParentID`
- Item 23.5: `Delete`

---

**Passo 24 — ReleaseStatusUseCase e ReleaseTrainStatusUseCase**
- Item 24.1: `Create`, `List`, `GetByID`, `Delete` para cada um

---

**Passo 25 — ReleaseTrainCreationUseCase (EventBridge Flow 1)**
- Item 25.1: Verificar block para a data atual
- Item 25.2: Buscar schedulers ativos para o dia (`FindActiveByDate`)
- Item 25.3: Para cada scheduler: criar RT (nome: `schedulerName_YYYYMMDD`), histórico, criar regra EventBridge one-time, salvar ARN

---

**Passo 26 — ReleaseAssociationUseCase (EventBridge Flow 2)**
- Item 26.1: Buscar RT pelo ID do evento
- Item 26.2: Buscar releases WAITING com releaseDate = hoje e schedule_id do evento
- Item 26.3: Se vazio: cancela a RT
- Item 26.4: Para cada release: associar releaseTrainId + criar GMUD (stub) + criar regra EventBridge + status SCHEDULED + histórico

---

## FASE 6 — Adapters Out (Implementações)

**Passo 27 — Repositórios PostgreSQL (`internal/adapters/out/postgres/`)**
- Item 27.1: Um arquivo por repositório, implementando a interface correspondente
- Item 27.2: Usar `pgx/v5` com pool de conexões
- Item 27.3: Paginação via `LIMIT` e `OFFSET` com `COUNT(*) OVER()` para total
- Item 27.4: Soft delete respeitado em todas as queries de listagem (`WHERE deleted_at IS NULL`)
- Item 27.5: UUIDs gerados no domínio (não no banco — sem `gen_random_uuid()`)

---

**Passo 28 — EventBridge Publisher (`internal/adapters/out/eventbridge/`)**
- Item 28.1: Implementar `CreateScheduleRule` usando AWS SDK v2 Scheduler
- Item 28.2: Retornar ARN da regra para persistência
- Item 28.3: Implementar `DeleteScheduleRule` para cancelamento de agendamentos

---

**Passo 29 — GMUD Stub (`internal/adapters/out/gmud/`)**
- Item 29.1: Implementar `CreateGmud` retornando `"gmud-placeholder-{releaseID}"`
- Item 29.2: Estrutura preparada para substituição futura por HTTP client real

---

## FASE 7 — Adapters In (HTTP e Lambda)

**Passo 30 — DTOs de Request e Response**
- Item 30.1: Um arquivo de DTOs por resource (request structs com `json` tags e validação)
- Item 30.2: Response DTOs com substituição de IDs por nomes (status, audiences)
- Item 30.3: Struct de resposta paginada genérica: `PaginatedResponse[T]`
- Item 30.4: Struct de erro padrão com código e mensagem

---

**Passo 31 — Middlewares (`internal/adapters/in/http/middleware/`)**
- Item 31.1: `Auth` — valida JWT do header `Authorization: Bearer {token}`
- Item 31.2: `CorrelationID` — lê ou gera header `correlationID` e injeta no contexto
- Item 31.3: `FlowID` — lê header `flowID` e injeta no contexto
- Item 31.4: `RequestLogger` — loga método, path, status code e duração
- Item 31.5: `Recover` — recupera de panics e retorna 500

---

**Passo 32 — Router (`internal/adapters/in/http/router.go`)**
- Item 32.1: Registrar todos os middlewares globais
- Item 32.2: Registrar todas as rotas conforme tabela de endpoints da doc
- Item 32.3: Prefixo `/v1` em todas as rotas
- Item 32.4: Rota `GET /v1/checks` para health check

---

**Passo 33 — Handlers HTTP**
- Item 33.1: `application_handler.go` — 5 endpoints
- Item 33.2: `package_handler.go` — 7 endpoints (incluindo validação e audiences)
- Item 33.3: `release_handler.go` — 6 endpoints (CRUD + ação PUT)
- Item 33.4: `release_train_handler.go` — 8 endpoints (CRUD + ações + batch)
- Item 33.5: `release_train_schedule_handler.go` — 5 endpoints
- Item 33.6: `release_train_block_handler.go` — 4 endpoints
- Item 33.7: `audience_handler.go` — 5 endpoints
- Item 33.8: `release_status_handler.go` — 4 endpoints
- Item 33.9: `release_train_status_handler.go` — 4 endpoints
- Item 33.10: `health_handler.go` — 1 endpoint

---

**Passo 34 — Lambda Handler (`internal/adapters/in/event/`)**
- Item 34.1: `lambda.go` — roteador principal: detecta campo `source` (EventBridge) e roteia por `eventType`
- Item 34.2: `eventType == RELEASE_TRAIN_ASSOCIATION` → `ReleaseAssociationService.Execute()`
- Item 34.3: Default → `ReleaseTrainCreationService.Execute()`

---

## FASE 8 — Entrypoints

**Passo 35 — Entrypoint HTTP local (`cmd/api/main.go`)**
- Item 35.1: Carregar `.env`
- Item 35.2: Conectar ao banco + rodar migrations
- Item 35.3: Executar seed (idempotente)
- Item 35.4: Instanciar repositórios → use cases → handlers → router
- Item 35.5: Subir servidor HTTP na porta configurada

---

**Passo 36 — Entrypoint Lambda (`cmd/lambda/main.go`)**
- Item 36.1: Carregar config de variáveis de ambiente (sem `.env`, usar env vars nativas do Lambda)
- Item 36.2: Instanciar repositórios, use cases
- Item 36.3: Registrar handler Lambda com `lambda.Start(handler.Handle)`

---

## FASE 9 — Documentação Técnica

**Passo 37 — OpenAPI / Swagger (`docs/swagger.yaml`)**
- Item 37.1: Definir `info`, `servers` (4 ambientes: local, dev, hom, prod)
- Item 37.2: Definir `components/securitySchemes` (BearerAuth JWT)
- Item 37.3: Definir `components/parameters` para headers padrão (Authorization, correlationID, flowID)
- Item 37.4: Definir `components/schemas` para todos os models (Application, Package, Release, etc.)
- Item 37.5: Definir schema de paginação reutilizável
- Item 37.6: Definir schemas de erro (400, 404, 409, 422, 500)
- Item 37.7: Documentar todos os paths com request bodies, query params e response examples
- Item 37.8: Incluir enum values nos schemas (Release Status, RT Status, Audiences, WeekDays)

---

**Passo 38 — Insomnia Collection atualizada (`docs/insomnia-collection.json`)**
- Item 38.1: Atualizar a collection existente (fornecida na doc) com headers padrão em todas as requests
- Item 38.2: Adicionar variáveis de ambiente por ambiente (local, dev, hom, prod)
- Item 38.3: Corrigir rotas inconsistentes em relação à doc (ex: `/health` → `/v1/checks`)
- Item 38.4: Adicionar todas as ações de Release (postpone, deploy, rollout-result)
- Item 38.5: Adicionar batch-actions de Release Train
- Item 38.6: Adicionar endpoints de Release Train Status e Release Status
- Item 38.7: Garantir que todos os bodies de exemplo estejam alinhados ao modelo de dados

---

**Passo 39 — Diagrama ER DrawIO (`docs/drawio/er-diagram.drawio`)**
- Item 39.1: Tabela `applications`
- Item 39.2: Tabela `packages` (self-reference + FK applications)
- Item 39.3: Tabela `release_statuses` e `release_train_statuses`
- Item 39.4: Tabela `audiences` (self-reference)
- Item 39.5: Tabela `release_train_schedules`
- Item 39.6: Tabela `release_train_blocks`
- Item 39.7: Tabela `release_trains` (FK status)
- Item 39.8: Tabela `releases` (FK package, RT, schedule, status)
- Item 39.9: Tabela `release_audiences` (N-N releases × audiences)
- Item 39.10: Tabela `release_status_history`
- Item 39.11: Tabela `release_train_status_history`
- Item 39.12: Todas as cardinalidades (1-N, N-N, self-reference)

---

**Passo 40 — Diagrama de Arquitetura DrawIO (`docs/drawio/architecture.drawio`)**
- Item 40.1: Camada de entrada: API Gateway / ALB → Lambda / HTTP Server
- Item 40.2: Camada de use cases (hexágono central)
- Item 40.3: Camada de saída: PostgreSQL, EventBridge Scheduler, GMUD Service
- Item 40.4: Fluxo de eventos internos (in → usecase → out)

---

**Passo 41 — Diagrama de Fluxo EventBridge (`docs/drawio/eventbridge-flows.drawio`)**
- Item 41.1: Flow 1 — Cron diário → verifica block → busca schedulers → cria RT → cria regra EventBridge
- Item 41.2: Flow 2 — Regra one-time dispara → busca releases → associa à RT → cria GMUD → agenda deploy → status SCHEDULED
- Item 41.3: Destacar pontos de falha e rollback de cada fluxo

---

## FASE 10 — Testes

**Passo 42 — Testes unitários dos use cases**
- Item 42.1: Mocks das interfaces de repositório (usando `testify/mock`)
- Item 42.2: Testes para cada regra de negócio crítica (auto-finish, cancelamento por block, duplicate release, etc.)
- Item 42.3: Cobertura mínima de 80% nos use cases

---

**Passo 43 — Testes de integração dos repositórios**
- Item 43.1: Banco PostgreSQL em memória ou via `testcontainers-go`
- Item 43.2: Testar cada repositório com dados reais no banco

---

**Passo 44 — Testes E2E dos endpoints**
- Item 44.1: Subir servidor de test com banco isolado
- Item 44.2: Testar fluxo completo: criar Application → Package → Release → Release Train → ações

---

## Ordem de Execução Sugerida

```
Fase 1 (Setup) → Fase 2 (Banco) → Fase 3 (Docker) → Fase 4 (Domínio)
→ Fase 5 (Use Cases) → Fase 6 (Adapters Out) → Fase 7 (Adapters In)
→ Fase 8 (Entrypoints) → Testar localmente → Fase 9 (Docs) → Fase 10 (Testes)
```

---

## Resumo de Artefatos Gerados ao Final

| Artefato | Arquivo |
|---|---|
| Estrutura Go | `internal/`, `cmd/`, `migrations/` |
| Dockerfile | `Dockerfile` |
| Docker Compose | `docker-compose.yml` |
| Makefile | `Makefile` |
| Env example | `.env.example` |
| Swagger spec | `docs/swagger.yaml` |
| Insomnia collection | `docs/insomnia-collection.json` |
| ER Diagram | `docs/drawio/er-diagram.drawio` |
| Architecture Diagram | `docs/drawio/architecture.drawio` |
| EventBridge Flows | `docs/drawio/eventbridge-flows.drawio` |
| Seed SQL | `scripts/seed.sql` |
| Migrations SQL | `migrations/*.sql` (12 arquivos) |