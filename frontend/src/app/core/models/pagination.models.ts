// Contratos de paginação — espelham o envelope do backend:
//   { data: { items: [...], pagination: { page, total, limit } } }
// O ApiService desembrulha `.data`, portanto um GET de coleção
// devolve diretamente um `PagedResult<T>`.

/** Bloco de paginação retornado pelo backend (base 1). */
export interface Pagination {
  /** Página atual (base 1 no backend). */
  page: number;
  /** Total de itens da coleção (todas as páginas). */
  total: number;
  /** Itens por página. */
  limit: number;
}

/** Resultado paginado genérico de um recurso. */
export interface PagedResult<T> {
  items: T[];
  pagination: Pagination;
}

/** Tamanho de página padrão (documentacao.md → Paginação Padrão). */
export const DEFAULT_PAGE_SIZE = 10;

/** Opções de page size oferecidas na UI. */
export const PAGE_SIZE_OPTIONS: readonly number[] = [10, 20, 50, 100];

/** Fábrica de um resultado vazio (útil para estados iniciais e testes). */
export function emptyPage<T>(limit: number = DEFAULT_PAGE_SIZE): PagedResult<T> {
  return { items: [], pagination: { page: 1, total: 0, limit } };
}
