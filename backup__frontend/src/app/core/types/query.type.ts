import { TableSortDirection } from './table.type';

/**
 * Query canônica de listagem consumida pelas facades/serviços.
 * Contém page, pageSize, sort, filters, search e context — conforme
 * o contrato do projeto. A conversão de base (frontend 1 ↔ backend)
 * acontece na camada de integração (service), nunca no componente visual.
 */
export interface ListQuery {
  /** Página (base 1). */
  page: number;
  /** Itens por página. */
  pageSize: number;
  /** Campo de ordenação. */
  sortField?: string;
  /** Direção de ordenação. */
  sortOrder?: TableSortDirection;
  /** Busca textual global. */
  search?: string;
  /** Filtros combináveis (AND). */
  filters?: Record<string, string | number | boolean | undefined>;
  /** Contexto da tela (ex: 'applications', 'release-trains'). */
  context?: string;
}

/** Query default. */
export function defaultQuery(context?: string, pageSize = 10): ListQuery {
  return { page: 1, pageSize, context };
}

/** Serializa uma ListQuery em query-string para o backend. */
export function toHttpParams(query: ListQuery): Record<string, string> {
  const params: Record<string, string> = {
    page: String(query.page),
    limit: String(query.pageSize),
  };
  if (query.sortField && query.sortOrder) {
    params['sort'] = query.sortField;
    params['order'] = query.sortOrder;
  }
  if (query.search) params['search'] = query.search;
  if (query.filters) {
    for (const [key, val] of Object.entries(query.filters)) {
      if (val !== undefined && val !== '') params[key] = String(val);
    }
  }
  return params;
}
