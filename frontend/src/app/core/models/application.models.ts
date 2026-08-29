import { PublicKind, ReleaseStatus } from '../types/enums.type';

/** Application — repositório/aplicação (documentacao.md → Modelos de Dados). */
export interface Application {
  id: string;
  repositoryName: string;
  repositoryUrl: string;
  journeyName?: string | null;
  path: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

/**
 * Linha da tela "Repositórios / Jornadas ativas".
 * Visão denormalizada (rollout view) que combina dados de
 * Application + Package + Release para a Tabela Inteligente.
 */
export interface RepositoryRow {
  id: string;
  /** Nome do repositório (coluna Repositório, ordenável). */
  repositoryName: string;
  /** URL do repositório (para o link da coluna Repositório). */
  repositoryUrl: string;
  /** SHA curto da versão (coluna Versão). */
  version: string;
  /** Percentual do rollout 0–100 (coluna Rollout — progresso visual). */
  rollout: number;
  /** Percentual de carga 0–100 (coluna Carga, ordenável). */
  load: number;
  /** Estado atual (coluna Estado — badge). */
  status: ReleaseStatus;
  /** Público-alvo (coluna Público). */
  audience: PublicKind;
  /** Número da GMUD (coluna GMUD). */
  gmud: string;
  /** Última atualização ISO 8601 (coluna Atualizado em, ordenável). */
  updatedAt: string;
}
