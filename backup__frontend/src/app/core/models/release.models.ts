import { ReleaseStatus } from '../types/enums.type';

/** Release (documentacao.md → Modelos de Dados). */
export interface Release {
  id: string;
  packageId: string;
  releaseTrainId?: string | null;
  releaseTrainScheduleId?: string | null;
  /** No response da API vem o nome do enum, não o UUID. */
  status: ReleaseStatus;
  gmud: string;
  racf?: string | null;
  /** Progresso do rollout (0–100, nullable). */
  progress?: number | null;
  releaseDate?: string | null;
  scheduledAt?: string | null;
  /** Nomes das audiências associadas (ex: ['ITUBER', 'VAREJO-IOS']). */
  audiences: string[];
  createdAt: string;
  updatedAt?: string | null;
}
