// Enums do domínio de Rollout.
// Valores exatamente iguais aos seeds do backend (UPPERCASE_WITH_UNDERSCORES).
// Fonte: documentacao.md → "Enums e Tipos".

/** Status de uma Release. */
export enum ReleaseStatus {
  WAITING = 'WAITING',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  STEPBACK_REQUESTED = 'STEPBACK_REQUESTED',
  STEPBACK_DONE = 'STEPBACK_DONE',
  ROLLBACK_REQUESTED = 'ROLLBACK_REQUESTED',
  ROLLBACK_DONE = 'ROLLBACK_DONE',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

/** Status de uma Release Train. */
export enum ReleaseTrainStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  STEPPED_BACK = 'STEPPED_BACK',
  FINISHED = 'FINISHED',
}

/** Audiências padronizadas. */
export enum Audience {
  ITUBER = 'ITUBER',
  VAREJO_IOS = 'VAREJO-IOS',
  VAREJO_ANDROID = 'VAREJO-ANDROID',
  UNCLASS_IOS = 'UNCLASS-IOS',
  UNCLASS_ANDROID = 'UNCLASS-ANDROID',
  PERSON_IOS = 'PERSON-IOS',
  PERSON_ANDROID = 'PERSON-ANDROID',
  PRIVATE_IOS = 'PRIVATE-IOS',
  PRIVATE_ANDROID = 'PRIVATE-ANDROID',
  EVERYONE = 'EVERYONE',
}

/** Público-alvo exibido na coluna "Público" (Cliente / Ituber). */
export type PublicKind = 'Cliente' | 'Ituber';

/** Status terminais — usados por regras de auto-finish/UX. */
export const TERMINAL_RELEASE_STATUSES: ReadonlySet<ReleaseStatus> = new Set([
  ReleaseStatus.FINISHED,
  ReleaseStatus.ROLLBACK_DONE,
  ReleaseStatus.STEPBACK_DONE,
  ReleaseStatus.CANCELLED,
  ReleaseStatus.ERROR,
]);
