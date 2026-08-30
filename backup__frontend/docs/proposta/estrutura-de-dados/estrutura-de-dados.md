# Estrutura de Dados — Rollout Service

**Projeto:** Rollout Service  
**Data:** 18/07/2026  
**Desenvolvedor:** Elizabete Fabri  
**Status:** ✅ **X**

> **Documento de referência permanente.**
> Descreve os cenários de modelagem de todos os dados do sistemar, as ações permitidas e as regras-chave de negócio.

---

### **Domain Model Updates** (`internal/domain/models.go`)

**Adicionados constantes de status**:

```go
const (
    StatusScheduled = "scheduled"
    StatusInProgress = "in_progress"
    StatusExpansionPaused = "expansion_paused"
    StatusCompleted = "completed"
    StatusCanceled = "canceled"
    StatusRollback = "rollback"
    StatusStepback = "stepback"
)
```

**Release Struct**:

```go
type Release struct {
    ID              primitive.ObjectID
    ApplicationID   primitive.ObjectID
    ReleaseTrainID  primitive.ObjectID
    Name            string
    Description     string
    Version         string
    PackageIDs      []primitive.ObjectID
    Status          string
    Notes           string
    ScheduledAt     time.Time
    StartedAt       time.Time
    CompletedAt     time.Time
    PausedAt        time.Time
    CanceledAt      time.Time
    RolledbackAt    time.Time
    CreatedBy       string
    Audit           *Audit
}
```
