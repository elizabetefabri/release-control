## Modelos de Domínio Implementados

### 1. Tipos Base (types.go)

- `ReleaseStatus` - Enum de estados de release
- `Audit` - Estrutura de auditoria (createdAt, updatedAt, createdBy, updatedBy)

### 2. Modelos Principais (models.go)

- **Application** - Aplicação no sistema
- **Release** - Liberação de software
- **ReleaseTrain** - Trem de releases (múltiplas releases correlatas)
- **ReleaseTrainSchedule** - Agendamento de um release train
- **ReleaseTrainBlock** - Período bloqueado para releases
- **StatusHistory** - Histórico de mudanças de status
- **Audience** - Segmento de usuários
- **Package** - Pacote de software
- **EventRule** - Regras de automação

## Interfaces de Repositório (ports/out)

### ApplicationRepository

- `Create(ctx, app) -> (id, error)`
- `GetByID(ctx, id) -> (*Application, error)`
- `GetAll(ctx, filter, skip, limit) -> ([]*Application, total, error)`
- `Update(ctx, id, app) -> error`
- `Delete(ctx, id) -> error`

### ReleaseRepository

- `Create(ctx, release) -> (id, error)`
- `GetByID(ctx, id) -> (*Release, error)`
- `GetByApplicationID(ctx, appID, skip, limit) -> ([]*Release, total, error)`
- `Update(ctx, id, release) -> error`
- `Delete(ctx, id) -> error`
- `UpdateStatus(ctx, id, status, reason, changedBy) -> error`

### ReleaseTrainRepository

- Operações CRUD para release trains
- Suporte a agendamento e bloqueios

## Interfaces de Serviço (ports/in)

### ApplicationService

- `ListApplications(ctx, filter, page, pageSize)`
- `GetApplication(ctx, id)`
- `CreateApplication(ctx, app)`
- `UpdateApplication(ctx, id, app)`
- `DeleteApplication(ctx, id)`

### ReleaseService

- `ListReleases(ctx, filter, page, pageSize)`
- `ListReleasesByApplication(ctx, appID, page, pageSize)`
- `GetRelease(ctx, id)`
- `CreateRelease(ctx, release)`
- `PauseRelease(ctx, releaseID, reason, userID)` - Pausa expansão
- `ResumeRelease(ctx, releaseID, reason, userID)` - Retoma expansão
- `CancelRelease(ctx, releaseID, reason, userID)` - Cancela release
- `RollbackRelease(ctx, releaseID, reason, userID)` - Rollback completo
- `StepbackRelease(ctx, releaseID, reason, userID)` - Stepback (audience anterior)
