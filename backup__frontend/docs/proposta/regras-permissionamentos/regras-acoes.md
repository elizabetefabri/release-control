# 🎉 Regras de Ações de Release — Rollout Service

**Projeto:** Rollout Service  
**Data:** 18 de Julho 2026  
**Desenvolvedor:** Elizabete Fabri  
**Status:** ✅ **X**

---

> **Documento de referência permanente.**
> Descreve os dois cenários de operação de releases, as matrizes de ações permitidas por estado e as regras-chave de negócio.

---

## Visão Geral dos Cenários

| Aspecto                     | Cenário 1 — Lote                                        | Cenário 2 — Individual                        |
| --------------------------- | ------------------------------------------------------- | --------------------------------------------- |
| **Tela**                    | Release Train (tabela)                                  | Detalhes da Release                           |
| **Escopo**                  | Múltiplos releases de uma Release Train simultaneamente | Uma única release individualmente             |
| **Ações disponíveis**       | Pausar, Retomar, Cancelar, Reagendar                    | Pausar, Retomar, Cancelar, Rollback, Stepback |
| **Ação exclusiva**          | Reagendar Release                                       | Rollback, Stepback                            |
| **Agendado pode**           | Cancelar + Reagendar                                    | Apenas Cancelar                               |
| **Expansão concluída pode** | Nenhuma ação                                            | Rollback + Stepback                           |

---

## Estados Possíveis das Releases

Os estados abaixo se aplicam tanto ao Cenário 1 quanto ao Cenário 2:

- **Agendado** — release agendada, aguardando execução
- **Reagendado** — release foi reagendada para outro horário/data
- **Expansão pausada** — expansão em andamento foi pausada manualmente
- **Em progresso** — expansão em execução ativa
- **Expansão concluída** — expansão finalizada com sucesso
- **Stepback** — release revertida para audiência anterior (estado terminal)
- **Rollback** — release revertida completamente (estado terminal)
- **Cancelado** — release cancelada (estado terminal)

---

## Cenário 1: Ações em Lote (Release Train)

### Contexto

- **Tela:** Usuário RM acessa menu **Rollouts → Release Train**
- **Visualização:** Tabela de releases do dia para acompanhamento
- **Escopo:** Ações aplicadas a **múltiplos releases** de uma Release Train simultaneamente (batch)

### Matriz de Ações Permitidas por Estado

| Estado                 |  Pausar Release  | Retomar Release | Cancelar Release | Reagendar Release |
| ---------------------- | :--------------: | :-------------: | :--------------: | :---------------: |
| **Agendado**           |       Não        |       Não       |     **Sim**      |      **Sim**      |
| **Expansão pausada**   | — _(já pausado)_ |     **Sim**     |     **Sim**      |      **Sim**      |
| **Em progresso**       |     **Sim**      |       Não       |       Não        |        Não        |
| **Stepback**           |       Não        |       Não       |       Não        |        Não        |
| **Cancelado**          |       Não        |       Não       |       Não        |        Não        |
| **Rollback**           |       Não        |       Não       |       Não        |        Não        |
| **Expansão concluída** |       Não        |       Não       |       Não        |        Não        |

### Regras-chave do Cenário 1

- **Agendado:** Permite apenas **cancelar** e **reagendar**. NÃO permite pausar.
- **Expansão pausada:** Permite retomar, cancelar e reagendar. Pausar é N/A (já está pausado).
- **Em progresso:** Permite APENAS pausar. Nenhuma outra ação em lote.
- **Stepback, Cancelado, Rollback, Expansão concluída:** NENHUMA ação permitida — estados terminais para o lote.

---

## Cenário 2: Ações Individuais (Por uma Release)

### Contexto

- **Tela:** Detalhes da release (acessada ao clicar em um item da tabela)
- **Escopo:** Ações aplicadas a **uma única release** individualmente

### Matriz de Ações Permitidas por Estado

| Estado                 | Pausar Expansão  | Retomar Expansão | Cancelar Expansão  |       Rollback       | Stepback |
| ---------------------- | :--------------: | :--------------: | :----------------: | :------------------: | :------: |
| **Agendado**           |       Não        |       Não        |      **Sim**       |         Não          |   Não    |
| **Expansão pausada**   | — _(já pausado)_ |     **Sim**      |      **Sim**       |       **Sim**        |   Não    |
| **Em progresso**       |     **Sim**      |       Não        |        Não         |         Não          |   Não    |
| **Stepback**           |       Não        |       Não        |        Não         |         Não          |   Não    |
| **Cancelado**          |       Não        |       Não        | — _(já cancelado)_ |         Não          |   Não    |
| **Rollback**           |       Não        |       Não        |        Não         | — _(já em rollback)_ |   Não    |
| **Expansão concluída** |       Não        |       Não        |        Não         |       **Sim**        | **Sim**  |

### Regras-chave do Cenário 2

- **Agendado:** Permite APENAS cancelar expansão.
- **Expansão pausada:** Permite retomar, cancelar e rollback. NÃO permite stepback.
- **Em progresso:** Permite APENAS pausar expansão.
- **Stepback:** NENHUMA ação permitida (estado terminal).
- **Cancelado:** NENHUMA ação permitida (estado terminal). Cancelar é N/A.
- **Rollback:** NENHUMA ação permitida. Rollback já está em andamento.
- **Expansão concluída:** Permite **Rollback** e **Stepback** (reverter um deploy concluído).

---

## Observações Importantes

1. **Reagendar** só existe nas ações em lote (Release Train), **não** nas ações individuais.
2. **Rollback** e **Stepback** só existem nas ações individuais (por release), **não** nas ações em lote.
3. **Expansão concluída** é terminal para ações em lote, mas permite rollback/stepback individualmente.
4. Os estados **Stepback**, **Cancelado** e **Rollback** são **terminais** — nenhuma ação é permitida a partir deles no cenário de lote.

---

## Diagrama de Estados (Resumo)

```
Agendado
  ├── [Cancelar]     → Cancelado (terminal)
  ├── [Reagendar]    → Reagendado  (lote apenas)
  └── [iniciar]      → Em progresso

Em progresso
  ├── [Pausar]       → Expansão pausada
  └── [concluir]     → Expansão concluída

Expansão pausada
  ├── [Retomar]      → Em progresso
  ├── [Cancelar]     → Cancelado (terminal)
  ├── [Reagendar]    → Reagendado  (lote apenas)
  └── [Rollback]     → Rollback (terminal)  (individual apenas)

Expansão concluída
  ├── [Rollback]     → Rollback (terminal)  (individual apenas)
  └── [Stepback]     → Stepback (terminal)  (individual apenas)

Cancelado   → (terminal — nenhuma ação)
Rollback    → (terminal — nenhuma ação)
Stepback    → (terminal — nenhuma ação)
```

---

## Referências Técnicas

| Entidade                        | Descrição                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `Releases`                      | Tabela principal de releases com `release_status_id`                               |
| `Releases_Statuses`             | Tabela de statuses possíveis (GMUD_SCHEDULED, IN_PROGRESS, PAUSED, etc.)           |
| `Releases_Status_History`       | Histórico de mudanças de estado de cada release                                    |
| `Releases_Trains`               | Agrupamento de releases em um trem de liberação                                    |
| `Release_Train_Statuses`        | Statuses do trem (WAITING, IN_PROGRESS, PAUSED, CANCELLED, STEPPED_BACK, FINISHED) |
| `Release_Trains_Status_History` | Histórico de mudanças de estado do trem                                            |
| `Release_Trains_Scheduler`      | Configuração de horários de execução (manhã 06:00 / tarde 13:00)                   |
| `Release_Trains_Blocks_Days`    | Dias em que o trem está bloqueado para execução                                    |

---

_Documento criado em: 2026-03-31_
_Projeto: Rollout Service_
