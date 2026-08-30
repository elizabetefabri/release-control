# API de Release Trains --- Especificação de Endpoints

> Documentação dos endpoints REST para o sistema de Release Trains, Releases,
> Packages e Applications. Atualizada para refletir o estado atual da implementação. Cada endpoint possui documentação detalhada em arquivo individual na pasta `docs/proposta/endpoints/`.

## Indice

0. [Environments](<>)
1. [Headers Padrão](<>)
2. [Paginação Padrão](<>)
3. [Enums e Tipos](<>)
4. [Applications](<>)
5. [Packages](<>)
6. [Releases](<>)
7. [Release Trains](<>)
8. [Release Trains Schedules](<>)
9. [Release Trains Blocks](<>)
10. [Audiences](<>)
11. [Release Statuses](<>)
12. [Release Trains Statuses](<>)
13. [Health](<>)
14. [Modelagem de Dados](<>)
15. [Relacionamentos (ER)](<>)
16. [Regras de Negócio](<>)

## Environments

Lista de environments da aplicação

| Environment | Host                                                           |
| ----------- | -------------------------------------------------------------- |
| local       | [http://localhost:8080/v1](http://localhost:8080/v1)           |
| dev         | [http://localhost-dev:8080/v1](http://localhost-dev:8080/v1)   |
| hom         | [http://localhost-hom:8080/v1](http://localhost-hom:8080/v1)   |
| prod        | [http://localhost-prod:8080/v1](http://localhost-prod:8080/v1) |
|             |                                                                |

## Headers Padrão

Todos os endpoints requerem os seguintes headers:

| Header        | Tipo   | Obrigatório | Descrição                             |
| ------------- | ------ | ----------- | ------------------------------------- |
| Authorization | string | Sim         | Token JWT no formato "Bearer {token}" |
| correlationID | string | Sim         | UUID de correlação para rastreamento  |
| flowID        | string | Sim         | Identificador do fluxo de origem      |
|               |        |             |                                       |

## Paginação Padrão

Todos os endpoints de coleção (listagem) dos resources principais retornam componentes paginadas com a seguinte estrutura:

```json
{
  "data": {
    "items": [/* array de objetos do resource */],
    "pagination": {
      "page": 1,
      "total": 100,
      "limit": 10
    }
  }
}
```

### Query Parameters de Paginação

| Parâmetro | Tipo   | Obrigatório | Descrição                                 |
| --------- | ------ | ----------- | ----------------------------------------- |
| page      | number | Não         | Número da página (default: 1)             |
| limit     | number | Não         | Itens por página (default: 10, max: 100)  |
| pageSize  | number | Não         | Alias para limit (usado se limit ausente) |

## Enums e Tipos

### Release Status

Valores padronizados (seeds automáticos na inicialização):

| Valor              | Descrição              |
| ------------------ | ---------------------- |
| WAITING            | Aguardando início      |
| SCHEDULED          | Agendada               |
| IN_PROGRESS        | Em andamento           |
| PAUSED             | Pausada                |
| CANCELLED          | Cancelada              |
| STEPBACK_REQUESTED | Step back solicitado   |
| STEPBACK_DONE      | Step back concluído    |
| ROLLBACK_REQUESTED | Rollback solicitado    |
| ROLLBACK_DONE      | Rollback concluído     |
| FINISHED           | Finalizada com sucesso |
| ERROR              | Erro na release        |

## Release Train Status

Valores padronizados (seeds automáticos na inicialização):

| Valor        | Descrição                        |
| ------------ | -------------------------------- |
| WAITING      | Aguardando início                |
| IN_PROGRESS  | Em andamento                     |
| PAUSED       | Pausada                          |
| CANCELLED    | Cancelada                        |
| STEPPED_BACK | Retrocedida (step back aplicado) |
| FINISHED     | Finalizada com sucesso           |

> **Nota:** Os status são registrados nas tabelas `release_statuses` e `release_train_statuses`.
> Os valores acima são criados automaticamente no startup da aplicação (seed).
> Todos seguem o padrão **UPPERCASE_WITH_UNDERSCORES**.

## Audiences

Valores padronizados (seeds automáticos na inicialização):

| Valor           | Descrição                 |
| --------------- | ------------------------- |
| ITUBER          | Audiência ituber          |
| VAREJO-IOS      | Audiência varejo iOS      |
| VAREJO-ANDROID  | Audiência varejo Android  |
| UNCLASS-IOS     | Audiência unclass iOS     |
| UNCLASS-ANDROID | Audiência unclass Android |
| PERSON-IOS      | Audiência person iOS      |
| PERSON-ANDROID  | Audiência person Android  |
| PRIVATE-IOS     | Audiência private iOS     |
| PRIVATE-ANDROID | Audiência private Android |
| EVERYONE        | Audiência geral (todos)   |

### Formato de Datas

Todas as datas seguem o padrão ISO 8601 `(ex: "2024-01-01T12:00:00Z")` e são tratadas como UTC.

## Applications

| Método | Endpoint                       | Descrição                          | Documentação                          |
| ------ | ------------------------------ | ---------------------------------- | ------------------------------------- |
| POST   | /v1/applications               | Criar Application                  | [POST-applications.md](<>)            |
| GET    | /v1/applications               | Listar Applications                | [GET-applications.md](<>)             |
| GET    | /v1/applications/{id}          | Buscar Application por ID          | [GET-applications-id.md](<>)          |
| GET    | /v1/applications/{id}/packages | Listar Packages de uma Application | [GET-applications-id-packages.md](<>) |
| DELETE | /v1/applications/{id}          | Deletar Application                | [DELETE-applications-id.md](<>)       |

## Packages

| Método | Endpoint                             | Descrição                             | Documentação                                |
| ------ | ------------------------------------ | ------------------------------------- | ------------------------------------------- |
| POST   | /v1/packages                         | Criar Package                         | [POST-packages.md](<>)                      |
| GET    | /v1/packages                         | Listar Packages (filtros combináveis) | [GET-packages.md](<>)                       |
| GET    | /v1/packages/{id}                    | Buscar Package por ID                 | [GET-packages-id.md](<>)                    |
| GET    | /v1/packages/{id}/releases/audiences | Audiences do histórico de releases    | [GET-packages-id-releases-audiences.md](<>) |
| GET    | /v1/packages-validations             | Validar Package (isBlocked)           | [GET-packages-validations.md](<>)           |
| PATCH  | /v1/packages/{id}                    | Atualizar Package                     | [PATCH-packages-id.md](<>)                  |
| DELETE | /v1/packages/{id}                    | Deletar Package                       | [DELETE-packages-id.md](<>)                 |

## Releases

| Método | Endpoint          | Descrição                | Documentação                |
| ------ | ----------------- | ------------------------ | --------------------------- |
| POST   | /v1/releases      | Criar Release            | [POST-releases.md](<>)      |
| GET    | /v1/releases      | Listar Releases          | [GET-releases.md](<>)       |
| GET    | /v1/releases/{id} | Buscar Release por ID    | [GET-releases-id.md](<>)    |
| PATCH  | /v1/releases/{id} | Atualizar Release        | [PATCH-releases-id.md](<>)  |
| PUT    | /v1/releases/{id} | Executar Ação na Release | [PUT-releases-id.md](<>)    |
| DELETE | /v1/releases/{id} | Deletar Release          | [DELETE-releases-id.md](<>) |

## Release Trains

| Método | Endpoint                         | Descrição                                | Documentação                              |
| ------ | -------------------------------- | ---------------------------------------- | ----------------------------------------- |
| POST   | /v1/release-trains               | Criar Release Train                      | [POST-release-trains.md](<>)              |
| GET    | /v1/release-trains               | Listar Release Trains                    | [GET-release-trains.md](<>)               |
| GET    | /v1/release-trains/{id}          | Buscar Release Train por ID              | [GET-release-trains-id.md](<>)            |
| GET    | /v1/release-trains/{id}/releases | Listar Releases de um Release Train      | [GET-release-trains-id-releases.md](<>)   |
| PATCH  | /v1/release-trains/{id}          | Atualizar Release Train                  | [PATCH-release-trains-id.md](<>)          |
| PUT    | /v1/release-trains/{id}          | Executar Ação na Release Train           | [PUT-release-trains-id.md](<>)            |
| PUT    | /v1/release-trains/batch-actions | Executar Ação em Lote nas Release Trains | [PUT-release-trains-batch-actions.md](<>) |
| DELETE | /v1/release-trains/{id}          | Deletar Release Train                    | [DELETE-release-trains-id.md](<>)         |

## Release Trains Schedules

| Método | Endpoint                         | Descrição                 | Documentação                               |
| ------ | -------------------------------- | ------------------------- | ------------------------------------------ |
| POST   | /v1/release-train-schedules      | Criar Agendamento         | [POST-release-train-schedules.md](<>)      |
| GET    | /v1/release-train-schedules      | Listar Agendamentos       | [GET-release-train-schedules.md](<>)       |
| GET    | /v1/release-train-schedules/{id} | Buscar Agendamento por ID | [GET-release-train-schedules-id.md](<>)    |
| PATCH  | /v1/release-train-schedules/{id} | Atualizar Agendamento     | [PATCH-release-train-schedules-id.md](<>)  |
| DELETE | /v1/release-train-schedules/{id} | Deletar Agendamento       | [DELETE-release-train-schedules-id.md](<>) |

## Release Trains Blocks

| Método | Endpoint                      | Descrição              | Documentação                            |
| ------ | ----------------------------- | ---------------------- | --------------------------------------- |
| POST   | /v1/release-train-blocks      | Criar Bloqueio         | [POST-release-train-blocks.md](<>)      |
| GET    | /v1/release-train-blocks      | Listar Bloqueios       | [GET-release-train-blocks.md](<>)       |
| GET    | /v1/release-train-blocks/{id} | Buscar Bloqueio por ID | [GET-release-train-blocks-id.md](<>)    |
| DELETE | /v1/release-train-blocks/{id} | Deletar Bloqueio       | [DELETE-release-train-blocks-id.md](<>) |

## Audiences

| Método | Endpoint                           | Descrição                      | Documentação                        |
| ------ | ---------------------------------- | ------------------------------ | ----------------------------------- |
| POST   | /v1/audiences                      | Criar Audience                 | [POST-audiences.md](<>)             |
| GET    | /v1/audiences                      | Listar Audiences               | [GET-audiences.md](<>)              |
| GET    | /v1/audiences/{id}                 | Buscar Audience por ID         | [GET-audiences-id.md](<>)           |
| GET    | /v1/audiences/by-parent/{parentId} | Listar Audiences por Parent ID | [GET-audiences-by-parent-id.md](<>) |
| DELETE | /v1/audiences/{id}                 | Deletar Audience               | [DELETE-audiences-id.md](<>)        |

## Release Statuses

| Método | Endpoint                  | Descrição                    | Documentação                        |
| ------ | ------------------------- | ---------------------------- | ----------------------------------- |
| POST   | /v1/release-statuses      | Criar Release Status         | [POST-release-statuses.md](<>)      |
| GET    | /v1/release-statuses      | Listar Release Statuses      | [GET-release-statuses.md](<>)       |
| GET    | /v1/release-statuses/{id} | Buscar Release Status por ID | [GET-release-statuses-id.md](<>)    |
| DELETE | /v1/release-statuses/{id} | Deletar Release Status       | [DELETE-release-statuses-id.md](<>) |

## Release Trains Statuses

| Método | Endpoint                        | Descrição                          | Documentação                              |
| ------ | ------------------------------- | ---------------------------------- | ----------------------------------------- |
| POST   | /v1/release-train-statuses      | Criar Release Train Status         | [POST-release-train-statuses.md](<>)      |
| GET    | /v1/release-train-statuses      | Listar Release Train Statuses      | [GET-release-train-statuses.md](<>)       |
| GET    | /v1/release-train-statuses/{id} | Buscar Release Train Status por ID | [GET-release-train-statuses-id.md](<>)    |
| DELETE | /v1/release-train-statuses/{id} | Deletar Release Train Status       | [DELETE-release-train-statuses-id.md](<>) |

## Health

| Método | Endpoint   | Descrição    | Documentação       |
| ------ | ---------- | ------------ | ------------------ |
| GET    | /v1/checks | Health Check | [GET-check.md](<>) |

---

# Modelos de Dados

## Application

| Campo          | Tipo      | Descrição                              |
| -------------- | --------- | -------------------------------------- |
| id             | UUID (V7) | Identificador único                    |
| repositoryName | string    | Nome do repositório                    |
| repositoryUrl  | string    | URL do repositório                     |
| journeyName    | string    | Nome da jornada (nullable)             |
| path           | string    | Caminho da aplicação                   |
| isActive       | boolean   | Se a aplicação está ativa              |
| createdAt      | datetime  | Data de criação (imutável após insert) |
| updatedAt      | datetime  | Data da última atualização (nullable)  |

## Package

| Campo          | Tipo      | Descrição                                                                             |
| -------------- | --------- | ------------------------------------------------------------------------------------- |
| id             | UUID (V7) | Identificador único                                                                   |
| parentId       | UUID (V7) | ID do pacote pai (self-reference, FK)                                                 |
| applicationId  | UUID (V7) | ID da aplicação (FK)                                                                  |
| taacId         | string    | ID do TAAC                                                                            |
| isBlocked      | boolean   | Se o pacote está bloqueado                                                            |
| isActive       | boolean   | Se o pacote está ativo                                                                |
| commitSha      | string    | SHA do commit do pacote                                                               |
| pullRequestUrl | string    | URL da Pull Request                                                                   |
| story          | string    | Identificador da story (obrigatório)                                                  |
| createdAt      | datetime  | Data de criação (mutavél apos insert)                                                 |
| updatedAt      | datetime  | Data da última atualização (nullable)                                                 |
| deletedAt      | datetime  | Data do soft delete (nullable). Quando preenchido o package não aparece nas listagens |

## Release

| Campo                  | Tipo      | Descrição                                                                            |
| ---------------------- | --------- | ------------------------------------------------------------------------------------ |
| id                     | UUID (V7) | Identificador único                                                                  |
| packageId              | UUID (V7) | ID do package (FK)                                                                   |
| releaseTrainId         | UUID (V7) | ID do Release Train (FK, nullable)                                                   |
| releaseTrainScheduleId | UUID (V7) | ID do scheduler de release train (FK, nullable)                                      |
| releaseStatusId        | UUID (V7) | ID do status de release (FK)                                                         |
| gmud                   | string    | Número da GMUD                                                                       |
| racf                   | string    | RACF do originador                                                                   |
| progress               | integer   | Progresso do rollout (nullable)                                                      |
| releaseDate            | date      | Data da release (YYYY-MM-DD, nullable)                                               |
| scheduledAt            | datetime  | Data/hora agendada (nullable)                                                        |
| arnEventSchedule       | string    | ARN da regra EventBridge scheduler (nullable) usado para cancelamento do agendamento |
| createdAt              | datetime  | Data de criação (mutável após insert)                                                |
| updatedAt              | datetime  | Data da última atualização (nullable)                                                |

> Nota: No response da API, releaseStatusId é substituído por status (nome do enum).
> O campo audiences é um array com os nomes das audiências associadas.

## Release Audience

| Campo      | Tipo      | Descrição            |
| ---------- | --------- | -------------------- |
| id         | UUID (V7) | Identificador único  |
| releaseId  | UUID (V7) | ID da release (FK)   |
| audienceId | UUID (V7) | ID da audiência (FK) |
| createdAt  | datetime  | Data de criação      |

## Release Train

| Campo         | Tipo      | Descrição                              |
| ------------- | --------- | -------------------------------------- |
| id            | UUID (V7) | Identificador único                    |
| statusId      | UUID (V7) | ID do status atual (FK)                |
| name          | string    | Nome da Release Train                  |
| isPaused      | boolean   | Se está pausada                        |
| isSteppedBack | boolean   | Se está step back (rollback)           |
| startAt       | datetime  | Data/hora de início (ISO 8601)         |
| endAt         | datetime  | Data/hora de término (nullable)        |
| createdAt     | datetime  | Data de criação (utilizado pós-insert) |
| updatedAt     | datetime  | Data da última atualização (nullable)  |

> **Nota:** No response da API, `statusId` é substituído pelo nome do enum.

## Release Train Schedule

| Campo                      | Tipo      | Descrição                                              |
| -------------------------- | --------- | ------------------------------------------------------ |
| id                         | UUID (V7) | Identificador único                                    |
| name                       | string    | Nome do agendamento                                    |
| isActive                   | boolean   | Se está ativo                                          |
| startAt                    | string    | Horário de execução (HH:mm)                            |
| startDate                  | datetime  | Início da vigência (nullable)                          |
| endDate                    | datetime  | Fim da vigência (nullable)                             |
| weekDays                   | string[]  | Dias da semana (SUNDAY–SATURDAY)                       |
| maxPreviousSchedulingHours | integer   | Máx. horas de antecedência permitidas para agendamento |
| createdAt                  | datetime  | Data de criação (imutável após insert)                 |
| updatedAt                  | datetime  | Data da última atualização (nullable)                  |

## Release Train Block

| Campo       | Tipo      | Descrição                              |
| ----------- | --------- | -------------------------------------- |
| id          | UUID (V7) | Identificador único                    |
| date        | datetime  | Data bloqueada (ISO 8601)              |
| observation | string    | Observação/motivo (nullable)           |
| createdAt   | datetime  | Data de criação (imutável após insert) |
| updatedAt   | datetime  | Data da última atualização (nullable)  |

## Audience

| Campo     | Tipo      | Descrição                                |
| --------- | --------- | ---------------------------------------- |
| id        | UUID (V7) | Identificador único                      |
| name      | string    | Nome da audiência                        |
| parentId  | UUID (V7) | ID da audiência pai (nullable, opcional) |
| createdAt | datetime  | Data de criação (imutável após insert)   |
| updatedAt | datetime  | Data da última atualização (nullable)    |

## Release Status

| Campo       | Tipo      | Descrição                              |
| ----------- | --------- | -------------------------------------- |
| id          | UUID (V7) | Identificador único                    |
| name        | string    | Nome do status                         |
| description | string    | Descrição do status                    |
| createdAt   | datetime  | Data de criação (imutável após insert) |

## Release Train Status

| Campo       | Tipo      | Descrição                              |
| ----------- | --------- | -------------------------------------- |
| id          | UUID (V7) | Identificador único                    |
| name        | string    | Nome do status                         |
| description | string    | Descrição do status                    |
| createdAt   | datetime  | Data de criação (imutável após insert) |

## Release Status History

| Campo           | Tipo      | Descrição                    |
| --------------- | --------- | ---------------------------- |
| id              | UUID (V7) | Identificador único          |
| releaseId       | UUID (V7) | ID da release (FK)           |
| releaseStatusId | UUID (V7) | ID do status no momento (FK) |
| observation     | string    | Observação/motivo (nullable) |
| createdAt       | datetime  | Data de criação do registro  |

## Release Train Status History

| Campo          | Tipo      | Descrição                    |
| -------------- | --------- | ---------------------------- |
| id             | UUID (V7) | Identificador único          |
| releaseTrainId | UUID (V7) | ID da release train (FK)     |
| statusId       | UUID (V7) | ID do status no momento (FK) |
| observation    | string    | Observação/motivo (nullable) |
| createdAt      | datetime  | Data de criação do registro  |

## Pagination

| Campo | Tipo   | Descrição        |
| ----- | ------ | ---------------- |
| page  | number | Página atual     |
| total | number | Total de itens   |
| limit | number | Itens por página |

# Relacionamentos (ER)

```
Application 1-N Package

Package 1-N Release

Release N-N Audience (via release_audiences)
Release N-1 Release Status
Release N-0..1 Release Train
Release 1-N Release Status History

Release Train 1-N Release Status History
Release Train 1-N Release Train Status
Release Train N-0..1 Release Train Status History
Release Train N-0..1 Release Train Schedule
Release Train Schedule (Independente)
Release Train Block (Independente)

```

# Regras de Negócio

## Timestamps

- createdAt: Gerado automaticamente pelo banco na primeira inserção. Imutável.

- updatedAt: Atualizado automaticamente somente quando ocorre um update real. No insert inicial permanece null.

## UUID V7

Todos os campos `id` são gerados como **UUID V7** pelas factories de domínio, garantindo ordenação temporal.

## Auto-cadastro de Application (POST /packages)

Quando um POST /v1/packages é recebido:

1. O sistema verifica se applicationName já existe na tabela applications.

2. Se existir, usa o id existente como application_id do package.

3. Se não existir, cria automaticamente uma nova Application com:
   - repository_name = valor de applicationName da request
   - repository_uri = domínio extraído de pullRequestUrl
   - journey_name = string vazia
   - path = valor enviado na request

## Criação de Release via POST /packages

Quando um package é criado via POST /packages, uma release é criada automaticamente com:

- package_id = ID do pacote recém-criado
- status = ID do enum WAITING
- pull_request_url = valor enviado na request (obrigatório)
- gradle_version = nulo (opcional)

## Criação de Release via POST /packages (versão 2 — mais completa)

Quando um package é criado via POST /packages, uma release é criada automaticamente com:

- package_id = ID do pacote recém-criado
- release_status = ID do enum WAITING
- gmud = valor enviado na request (obrigatório)
- racf = valor enviado na request (opcional)

## Histórico de Status (Status History)

Sempre que o status de uma Release ou Release Train for alterado:

- Um registro é criado na tabela correspondente (release_status_history ou release_train_status_history).

- O registro captura:
  - ID da entidade
  - ID do novo status
  - Observação (quando informada)
  - Timestamp da alteração

- O histórico só é criado quando o status realmente muda.
- Se houver erro ao salvar o histórico, a operação falha (transacional).

## Auto-finish da Release Train

Quando uma Release tem seu status alterado muda para um status terminal:

1. O sistema verifica se a release pertence a uma Release Train (releaseTrainId não nulo).

2. Consulta todas as Releases da mesma Release Train.

3. Se todas estiverem em status terminal
   (FINISHED, ROLLBACK_DONE, STEPBACK_DONE, CANCELLED, ERROR):

   - A Release Train é atualizada automaticamente para FINISHED
   - Um registro de histórico é criado na tabela release_train_status_history

4. Se alguma Release ainda não estiverem em status terminal, nenhuma ação é tomada na Release Train.

## Ações de Release Train (PUT /release-trains/{id})

Detalhes completos em: **PUT-release-trains-id.md**

**pause:**  
Pausa a Release Train (status PAUSED) e todas as releases associadas (status PAUSED).
Observação formatada como:
{observacao} {data atual DD/MM/YYYY}  
(default: pausa {data})  
Registra histórico em ambas as tabelas.

**resume:**  
Retoma a Release Train (status IN_PROGRESS) e restaura cada release ao status anterior (consultando release_status_history).
Registra histórico.

**cancel:**  
Cancela a Release Train (status CANCELLED) e todas as releases associadas (status CANCELLED).
Observação formatada como:
{observacao} {data atual DD/MM/YYYY}  
(default: cancel {data})  
Registra histórico em ambas as tabelas.

**stepback:**  
Aplica step back na Release Train (status STEPBACK_BACK) e todas as releases (status STEPBACK_REQUESTED).
Registra histórico.

**postpone:**  
Clona releases para data futura (status WAITING progress 0, sua releaseTrainId(), cancela releases atuais com observação, e cancela a RT (status CANCELLED)).
Aceita **releaseTrainScheduled** opcional para sobrescrever nas releases clonadas.
Observação formatada como: {observation} {data postergacao DD/MM/YYYY}  
(default: relase postergada para a data {data}). Registra historico.

## Ações de Release (PUT /releases/{id})

**postpone:**  
Adia a release a um novo scheduler e nova data.
Valida scheduler ativo e a regra de maxPreviousSchedulingHours.

**pause:**  
Pausa a release (status PAUSED). Registra histórico com observação.

**stepback:**  
Aplica step back (status STEPBACK_REQUESTED). Registra histórico com observação.

**rollback:**  
Reverte a release (status ROLLBACK_REQUESTED). Bloqueia o pacote atual e valida o pacote target.
Registra histórico.

**deploy:**  
Marca como deploy (status IN_PROGRESS).
Registra histórico.

**rollout-result:**  
Registra o resultado do rollout.

- success = true: SCHEDULING → FINISHED (progress = 100) para STEPBACK_REQUESTED → STEPBACK_DONE (progress = 100) ROLLBACK_REQUESTED → ROLLBACK_DONE (progress = 100). Outros status retornam 422

- success = false: Qualquer status vai para ERROR JSON intera do array error gravado na observation.

## Exibição de Status (DTOs)

- Nos responses de Release o campo status exibe o nome do enum do release status Ex.: WAITING, FINISHED, não o UUID do status.

- Nas resposnse de Release Train o campo status exibe o nome do enum do release train status:
  Ex.: WAITING, IN_PROGRESS, FINISHED não o UUID.

- Nos responses de Release o campo aundiences exibe um array com os nomes das audiencias associadas, não os UUIDs.
  Ex.: [ITUBER, VAREJO-IOS]

## Paginação (DTO)

Endpoints de coleção dos resources principais retornam respostas paginadas com a seguinte estrutura:

```json
{
  "data": {
    "items": [/* array de objetos do resource */],
    "pagination": {
      "page": 1,
      "total": 100,
      "limit": 10
    }
  }
}
```

## Cancelamento Retroativo por Block (POST /release-train-blocks)

Quando um release-train-block é criado:

1. O block é persistido no banco
2. O sistema busca em todas as releases train cujo startAt caia no intervala [startOfDate, endOfDay] da data bloqueada
3. Para cada RT não-cancelada atualiza status para CANCELLED e registra historico cm observação "Release Train cancelada por causa do block registrado para o dia - {observation}"
4. O sistema busca todas as releases cujo releaseDate corresponda a data bloqueada.
5. Para cada release não-cancelada atualiza status para CANCELLED e registra historico com observação "Release cancelada por causa do block registrado para o dia - {observation}"
6. Propagação de erros: Se qualquer etapa do cancelamento falhar, a requisição erro. O block permanece salvo.
7. Ordem: Release Trains são canceladas antes das releases. Se RTs falaharem, releases não são processadas.

## Cancelamento automatico por Desativação de Scheduler (PATCH /release-train-schedules)

Quando um release train schedule é desativado (isActive = false) ou deletado (deleted_at e preenchido):

- Todas as releases associadas a esse schedule são marcada como CANCELLED
- Um registro é criado no release_status_history para cada relase cancelada

## Validação de Duplicate em POST /releases

Quando uma release é criada com releaseTrainScheduleId:

- O sistema verifica se ja existe outra release em andamento (status IN_PROGRESS) ou (status ROLLBACK_REQUESTED) para o mesmo package no mesmo scheduler.
- Se existir, retorna erro 400 Conflict com a mensagem 'release ja esta em andamento'.

## Filtros via Query String

```
GET /v1/packages?applicationId={UUID}
  → Filtra packages por Application

GET /v1/packages?applicationName={string}
  → Filtra por nome da application (resolve para applicationId via GetByName)

GET /v1/packages?commitSha={string}
  → Filtra packages por SHA version

Todos os filtros de packages são combináveis com lógica AND
Exemplo: applicationName=appA & commitSha=shaB
→ Retorna no máximo 1 resultado (unicidade por application)

GET /v1/releases?releaseTrainId={UUID}
  → Filtra releases por Release Train

GET /v1/release-train-schedules?only_valid=true
  → Lista somente schedulers válidos

```

## Fluxos EventBridge (Automatizados)

### Flow 1 — Criação Automática de Release Trains

Fluxo disparado diariamente via cron EventBridge schedule. Não possui endpoint HTTP.

Trigger: EventBridge scheduled rule (cron diário)
Handler: internal/adapters/in/event/handler.go (detecta via campo source no evento)
UseCase: internal/usecases/release_train_creation_usecase.go

### Lógica

1. Verifica se existe block (release_trains_block) para a data atual.
   Se houver, loga motivo e encerra.

2. Busca schedulers ativos para a data atual: active = true, deletedAt = null, startDate/endDate válidos, weekDay correspondente.

3. Para cada scheduler ativo:

- Cria Release Train com nome schedulerName_YYYYMMDD, status WAITING, starts_at = now
- Registro histórico de status
- Cria regra EventBridge one-time via CreateRule + AddTarget (retorna ARN para cancelamento)
- Horario da regra = scheduler.startAt = maxPreviousSchedulingHours

#### Portas envolvidas

- in.ReleaseTrainCreationService (interface do use case)
- out.EventPublisher.CreateScheduleRule (cria regra EventBridge com ARN)
- out.ReleaseTrainBlockRepository.FindByDate
- out.ReleaseTrainSchedulerRepository.FindActiveByDate

### Flow 2 — Associação de Releases a Release Train

Fluxo disparado pelo EventBridge criado no Flow 1. Associa releases pendente a uma release train.

Trigger: EventBridge one-time rule (criada no flow 1. campo eventType: RELEASE_TRAIN_ASSOCIATION)
Handler: internal/adapters/in/event/handler.go (roteia por eventType no detail do evento)
UseCase: internal/usecase/release_association_usecase.go

### Lógica

1. Busca Release Train pelo ID do evento

2. Busca releases com status = WAITING, release_date = hoje, (schedule_id = id do evento).

3. Se nenhuma release encontrada cancela a Release Train (status CANCELLED + histórico)

4. Para cada release encontrada (4 updates sequenciais);
   a- Associa releaseTrainId na release
   b- Cria GMUD via serviço externo (stub por enquanto), salva gmud Id na release
   c- Cria regra EventBridge scheduled via CreateRule + AddTarget para o dia da release (campo releaseDate) e salva ARN na release para cancelamento futuro
   d- Atualiza status para SCHEDULED + Registra histórico

#### Portas envolvidas

- in.ReleaseAssociationService (interface do use case)
- out.GmudService.CreateGmud (integração externa - stub)
- out.EventPublisher.CreateSchedulingRule (cria a regra EventBridge com ARN)
- out.ReleaseRepository.FindByStatusAndSchedule

### GMUD Service (Stub)

Serviço externo da GMUD ainda em desenvolvimento. Implementação atual eum stub retorna um gmud-placeholder com ID.

#### Interface: out.GmudService. Método: CreateGmud(ctx, releaseID, releaseTrainID string) -> (gmudID string, err error). Implementação stub: internal/adapters/out/gmud_service_stub.go

## EventBridge Handler (Roteador de Eventos)

**Arquivo:** internal/adapters/in/event/lambda.go

**Função:** Detecta se o evento Lambda é um EventBridge event (via campo source) e roteia para o serviço correto:

Se eventType == RELEASE_TRAIN_ASSOCIATION → ReleaseAssociationService.Execute()

Caso contrário → ReleaseTrainCreationService.Execute() (default)

# Códigos de Erro Padrão

| Código  | Descrição                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------ |
| **400** | Bad Request — payload inválido ou malformado                                                     |
| **404** | Not Found — recurso não encontrado                                                               |
| **409** | Conflict — recurso duplicado ou release já em andamento                                          |
| **422** | Unprocessable Entity — validação de negócio (block, scheduler inativo, transação inválida, etc.) |
| **500** | Internal Server Error — erro inesperado                                                          |
