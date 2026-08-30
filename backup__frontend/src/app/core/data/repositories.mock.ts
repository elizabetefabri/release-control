import { RepositoryRow } from '../models/application.models';
import { ReleaseStatus } from '../types/enums.type';
import { PagedResult } from '../models/pagination.models';
import { ListQuery } from '../types/query.type';

/**
 * Mock de contexto da tela "Repositórios / Jornadas ativas".
 * Fonte única de dados enquanto o backend Go não está conectado
 * (feature-toggle `mock`). Reflete o formato do contrato real.
 */
const REPOSITORIES: readonly Omit<RepositoryRow, 'updatedAt'>[] = [
  { id: '1', repositoryName: 'aplicacao-renda-fixa', repositoryUrl: 'https://git.example/aplicacao-renda-fixa', version: 'e7f0c7', rollout: 0, load: 0, status: ReleaseStatus.WAITING, audience: 'Cliente', gmud: 'CHG0123456' },
  { id: '2', repositoryName: 'aplicacao-renda-variavel', repositoryUrl: 'https://git.example/aplicacao-renda-variavel', version: 't8g9b1', rollout: 50, load: 50, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG8901234' },
  { id: '3', repositoryName: 'aplicacao-resgate-ativos', repositoryUrl: 'https://git.example/aplicacao-resgate-ativos', version: 'd4a2e3', rollout: 0, load: 0, status: ReleaseStatus.WAITING, audience: 'Ituber', gmud: 'CHG7890123' },
  { id: '4', repositoryName: 'virtual-banking-service', repositoryUrl: 'https://git.example/virtual-banking-service', version: 'c2a5d8', rollout: 20, load: 20, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG6789012' },
  { id: '5', repositoryName: 'virtual-banking-service', repositoryUrl: 'https://git.example/virtual-banking-service', version: 'b3c7f2', rollout: 30, load: 30, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG4567890' },
  { id: '6', repositoryName: 'web-banking-solution', repositoryUrl: 'https://git.example/web-banking-solution', version: 'f4a2d8', rollout: 10, load: 10, status: ReleaseStatus.SCHEDULED, audience: 'Ituber', gmud: 'CHG3456789' },
  { id: '7', repositoryName: 'web-banking-solution', repositoryUrl: 'https://git.example/web-banking-solution', version: 'c9b8a2', rollout: 40, load: 40, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG9012345' },
  { id: '8', repositoryName: 'cloud-banking', repositoryUrl: 'https://git.example/cloud-banking', version: 'g5h1c4', rollout: 60, load: 60, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG2345678' },
  { id: '9', repositoryName: 'cloud-banking', repositoryUrl: 'https://git.example/cloud-banking', version: 'e7f0c6', rollout: 70, load: 70, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG1234567' },
  { id: '10', repositoryName: 'banking-digital-hub', repositoryUrl: 'https://git.example/banking-digital-hub', version: 'c2f0c6', rollout: 80, load: 80, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG5678901' },
  { id: '11', repositoryName: 'banking-digital-hub', repositoryUrl: 'https://git.example/banking-digital-hub', version: 'f1d3d5', rollout: 90, load: 90, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG0987654' },
  { id: '12', repositoryName: 'banking-online-portal', repositoryUrl: 'https://git.example/banking-online-portal', version: 'a9c5e8', rollout: 20, load: 20, status: ReleaseStatus.PAUSED, audience: 'Cliente', gmud: 'CHG5432109' },
  { id: '13', repositoryName: 'banking-online-portal', repositoryUrl: 'https://git.example/banking-online-portal', version: 'b8c4f9', rollout: 20, load: 20, status: ReleaseStatus.PAUSED, audience: 'Cliente', gmud: 'CHG2109876' },
  { id: '14', repositoryName: 'banking-online-portal', repositoryUrl: 'https://git.example/banking-online-portal', version: 'd3e1b2', rollout: 30, load: 30, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG8765432' },
  { id: '15', repositoryName: 'banking-portal-online', repositoryUrl: 'https://git.example/banking-portal-online', version: 'f4a4c7', rollout: 40, load: 40, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG1357902' },
  { id: '16', repositoryName: 'internet-banking-web', repositoryUrl: 'https://git.example/internet-banking-web', version: 'c1d2e3', rollout: 50, load: 50, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG2468013' },
  { id: '17', repositoryName: 'banking-web-service', repositoryUrl: 'https://git.example/banking-web-service', version: 'd9e1b9', rollout: 60, load: 60, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG3579124' },
  { id: '18', repositoryName: 'payments-core', repositoryUrl: 'https://git.example/payments-core', version: 'a1b2c3', rollout: 100, load: 100, status: ReleaseStatus.FINISHED, audience: 'Cliente', gmud: 'CHG4680235' },
  { id: '19', repositoryName: 'payments-gateway', repositoryUrl: 'https://git.example/payments-gateway', version: 'b2c3d4', rollout: 0, load: 0, status: ReleaseStatus.ERROR, audience: 'Ituber', gmud: 'CHG5791346' },
  { id: '20', repositoryName: 'pix-service', repositoryUrl: 'https://git.example/pix-service', version: 'c3d4e5', rollout: 100, load: 100, status: ReleaseStatus.ROLLBACK_DONE, audience: 'Cliente', gmud: 'CHG6802457' },
  { id: '21', repositoryName: 'pix-dispatcher', repositoryUrl: 'https://git.example/pix-dispatcher', version: 'd4e5f6', rollout: 15, load: 15, status: ReleaseStatus.SCHEDULED, audience: 'Ituber', gmud: 'CHG7913568' },
  { id: '22', repositoryName: 'cards-issuer', repositoryUrl: 'https://git.example/cards-issuer', version: 'e5f6a7', rollout: 25, load: 25, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG8024679' },
  { id: '23', repositoryName: 'cards-processor', repositoryUrl: 'https://git.example/cards-processor', version: 'f6a7b8', rollout: 35, load: 35, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG9135780' },
  { id: '24', repositoryName: 'loan-engine', repositoryUrl: 'https://git.example/loan-engine', version: 'a7b8c9', rollout: 45, load: 45, status: ReleaseStatus.CANCELLED, audience: 'Cliente', gmud: 'CHG0246891' },
  { id: '25', repositoryName: 'loan-simulator', repositoryUrl: 'https://git.example/loan-simulator', version: 'b8c9d0', rollout: 55, load: 55, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG1357903' },
  { id: '26', repositoryName: 'investment-portal', repositoryUrl: 'https://git.example/investment-portal', version: 'c9d0e1', rollout: 65, load: 65, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG2468014' },
  { id: '27', repositoryName: 'investment-advisor', repositoryUrl: 'https://git.example/investment-advisor', version: 'd0e1f2', rollout: 75, load: 75, status: ReleaseStatus.STEPBACK_REQUESTED, audience: 'Ituber', gmud: 'CHG3579125' },
  { id: '28', repositoryName: 'insurance-hub', repositoryUrl: 'https://git.example/insurance-hub', version: 'e1f2a3', rollout: 85, load: 85, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG4680236' },
  { id: '29', repositoryName: 'insurance-claims', repositoryUrl: 'https://git.example/insurance-claims', version: 'f2a3b4', rollout: 95, load: 95, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG5791347' },
  { id: '30', repositoryName: 'onboarding-service', repositoryUrl: 'https://git.example/onboarding-service', version: 'a3b4c5', rollout: 100, load: 100, status: ReleaseStatus.FINISHED, audience: 'Cliente', gmud: 'CHG6802458' },
  { id: '31', repositoryName: 'kyc-service', repositoryUrl: 'https://git.example/kyc-service', version: 'b4c5d6', rollout: 5, load: 5, status: ReleaseStatus.WAITING, audience: 'Ituber', gmud: 'CHG7913569' },
  { id: '32', repositoryName: 'fraud-detection', repositoryUrl: 'https://git.example/fraud-detection', version: 'c5d6e7', rollout: 100, load: 100, status: ReleaseStatus.STEPBACK_DONE, audience: 'Cliente', gmud: 'CHG8024680' },
  { id: '33', repositoryName: 'notifications-service', repositoryUrl: 'https://git.example/notifications-service', version: 'd6e7f8', rollout: 22, load: 22, status: ReleaseStatus.IN_PROGRESS, audience: 'Ituber', gmud: 'CHG9135781' },
  { id: '34', repositoryName: 'statements-service', repositoryUrl: 'https://git.example/statements-service', version: 'e7f8a9', rollout: 33, load: 33, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG0246892' },
  { id: '35', repositoryName: 'accounts-service', repositoryUrl: 'https://git.example/accounts-service', version: 'f8a9b0', rollout: 44, load: 44, status: ReleaseStatus.IN_PROGRESS, audience: 'Cliente', gmud: 'CHG1357904' },
];

function withUpdatedAt(): RepositoryRow[] {
  // Datas decrescentes a partir de 19/01/2026 19:15 (como na imagem de referência).
  const base = new Date('2026-01-19T19:15:00Z').getTime();
  return REPOSITORIES.map((r, i) => ({
    ...r,
    updatedAt: new Date(base + i * 15 * 60 * 1000).toISOString(),
  }));
}

/** Todos os registros mock (imutável). */
export const MOCK_REPOSITORIES: readonly RepositoryRow[] = withUpdatedAt();

/** Aplica busca, ordenação e paginação em memória, simulando o servidor. */
export function mockRepositoryPage(query: ListQuery): PagedResult<RepositoryRow> {
  let rows = [...MOCK_REPOSITORIES];

  if (query.search) {
    const term = query.search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.repositoryName.toLowerCase().includes(term) ||
        r.version.toLowerCase().includes(term) ||
        r.gmud.toLowerCase().includes(term),
    );
  }

  // Filtros combináveis (Estado / Público) vindos do sidesheet.
  const statusFilter = query.filters?.['status'];
  if (statusFilter) {
    const set = new Set(String(statusFilter).split(',').filter(Boolean));
    if (set.size) rows = rows.filter((r) => set.has(r.status));
  }
  const audienceFilter = query.filters?.['audience'];
  if (audienceFilter) {
    rows = rows.filter((r) => r.audience === audienceFilter);
  }

  if (query.sortField && query.sortOrder) {
    const field = query.sortField as keyof RepositoryRow;
    const dir = query.sortOrder === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  const total = rows.length;
  const start = (query.page - 1) * query.pageSize;
  const items = rows.slice(start, start + query.pageSize);

  return { items, pagination: { page: query.page, total, limit: query.pageSize } };
}
