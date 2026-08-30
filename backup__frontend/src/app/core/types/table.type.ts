// Contratos da Tabela Inteligente (SmartTable).
// A tabela é um componente BURRO: recebe dados/config por @Input e
// emite eventos por @Output. Nenhuma regra de negócio vive aqui.

// posição da tabela
export type TablePosition = 'top' | 'bottom' | 'left' | 'right';

// sorteamento da tabela
export type TableSortDirection = 'asc' | 'desc' | '';

/** Alinhamento horizontal do conteúdo da célula. */
export type TableAlign = 'left' | 'center' | 'right';

/**
 * Tipo de renderização de uma célula. A SmartTable escolhe o template
 * adequado a partir deste valor — é o que a torna "inteligente" e
 * adaptável a diferentes tipos de dado por coluna.
 */
export type TableCellType =
  | 'text' // texto simples
  | 'code' // trecho monoespaçado (ex: SHA da versão)
  | 'badge' // p-tag padronizada (ex: Estado)
  | 'progress' // barra de progresso (ex: Rollout)
  | 'percent' // valor percentual (ex: Carga)
  | 'date' // data curta
  | 'datetime' // data + hora
  | 'link' // link interno (routerLink) ou externo (href)
  | 'icon-text' // ícone + texto
  | 'actions' // célula isolada de ações
  | 'custom'; // template projetado pelo consumidor (templateKey)

/** Severidades aceitas por p-tag / p-badge do PrimeNG. */
export type TableBadgeSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';

/** Estados visuais padronizados da tabela. */
export type TableState = 'loading' | 'refreshing' | 'error' | 'empty' | 'ready';

/**
 * Definição de uma coluna. Os callbacks recebem a linha inteira,
 * permitindo derivar valores/estilos sem lógica no template.
 */
export interface TableColumn<T = Record<string, unknown>> {
  /** Caminho do campo na linha (usado como chave e para ordenação server-side). */
  field: string;
  /** Rótulo do cabeçalho. */
  header: string;
  /** Tipo de renderização (default: 'text'). */
  type?: TableCellType;
  /** Habilita ordenação server-side nesta coluna. */
  sortable?: boolean;
  /** Largura fixa opcional (ex: '160px'). */
  width?: string;
  /** Alinhamento (default: 'left'). */
  align?: TableAlign;
  /** Oculta a coluna em telas pequenas (responsividade). */
  hideOnMobile?: boolean;
  /** Getter de valor customizado (default: acessa row[field]). */
  value?: (row: T) => unknown;
  /** Severidade do badge quando type = 'badge'. */
  badgeSeverity?: (row: T) => TableBadgeSeverity;
  /** Rótulo do badge quando type = 'badge' (default: valor da célula). */
  badgeLabel?: (row: T) => string;
  /** Ícone (nome lucide) para type = 'icon-text' ou prefixo de badge. */
  icon?: (row: T) => string | undefined;
  /** Destino do link quando type = 'link'. Array => routerLink; string => href. */
  link?: (row: T) => string | unknown[] | undefined;
  /** Abre o link em nova aba (href externo). */
  external?: boolean;
  /** Tooltip opcional da célula. */
  tooltip?: (row: T) => string | undefined;
  /** Chave do template projetado quando type = 'custom'. */
  templateKey?: string;
}

/** Ação exibida na célula de "Ações". */
export interface TableAction<T = Record<string, unknown>> {
  key: string;
  label: string;
  /** Nome do ícone lucide. */
  icon: string;
  severity?: TableBadgeSeverity;
  /** Desabilita condicionalmente por linha. */
  disabled?: (row: T) => boolean;
  /** Oculta condicionalmente por linha. */
  visible?: (row: T) => boolean;
}

/** Evento de lazy-load emitido pela tabela (contrato base 1). */
export interface TableLazyEvent {
  /** Página solicitada (base 1). */
  page: number;
  /** Itens por página. */
  pageSize: number;
  /** Campo de ordenação (undefined = sem ordenação). */
  sortField?: string;
  /** Direção de ordenação. */
  sortOrder?: TableSortDirection;
}

/** Evento emitido ao acionar uma ação de linha. */
export interface TableActionEvent<T = Record<string, unknown>> {
  key: string;
  row: T;
}
