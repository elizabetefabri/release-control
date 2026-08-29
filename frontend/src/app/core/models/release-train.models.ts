import { ReleaseTrainStatus } from '../types/enums.type';

/** Release Train (documentacao.md → Modelos de Dados). */
export interface ReleaseTrain {
  id: string;
  /** No response da API vem o nome do enum, não o UUID. */
  status: ReleaseTrainStatus;
  name: string;
  isPaused: boolean;
  isSteppedBack: boolean;
  startAt: string;
  endAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

/** Agendamento de Release Train (Release Train Schedule). */
export interface ReleaseTrainSchedule {
  id: string;
  name: string;
  isActive: boolean;
  /** Horário de execução (HH:mm). */
  startAt: string;
  startDate?: string | null;
  endDate?: string | null;
  /** Dias da semana (SUNDAY–SATURDAY). */
  weekDays: string[];
  maxPreviousSchedulingHours: number;
  createdAt: string;
  updatedAt?: string | null;
}
