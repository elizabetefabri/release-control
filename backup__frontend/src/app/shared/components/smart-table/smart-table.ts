import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input, output, TemplateRef } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TableAction, TableActionEvent, TableBadgeSeverity, TableColumn, TableLazyEvent, TableSortDirection } from '../../../core/types/table.type';
import { Icon } from '../icon/icon';


/**
 * Tabela Inteligente (SmartTable).
 *
 * Componente de apresentação (burro), desacoplado de regra de negócio:
 * recebe dados/config por @Input e emite eventos por @Output. Suporta
 * paginação e ordenação server-side (lazy), renderização por tipo de
 * célula e estados visuais padronizados (loading, empty, error+retry e
 * refresh sem apagar os dados exibidos).
 *
 * A conversão de base de paginação (PrimeNG usa `first` 0-based; o
 * contrato do domínio usa `page` 1-based) acontece aqui, na fronteira —
 * nunca no consumidor.
 */
@Component({
  selector: 'app-smart-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    TagModule,
    ProgressBarModule,
    SkeletonModule,
    TooltipModule,
    ButtonModule,
    Icon,
  ],
  templateUrl: './smart-table.html',
  styleUrl: './smart-table.scss',
})
// Sem `extends Record<string, unknown>`: essa constraint impedia o Angular de
// inferir o genérico a partir de modelos sem index signature (ex: RepositoryRow),
// fazendo o checker cair no bound `Record<string, unknown>` e quebrar os @Input.
// Com `T = any` (default), o Angular infere T dos inputs do consumidor
// (ex: TableColumn<RepositoryRow>) mantendo a tipagem forte no ponto de definição.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SmartTable<T = any> {
  /** Definição das colunas. */
  readonly columns = input.required<TableColumn<T>[]>();
  /** Itens da página atual. */
  readonly value = input<T[]>([]);
  /** Total de itens (todas as páginas) — necessário para paginação server-side. */
  readonly totalRecords = input<number>(0);
  /** Itens por página. */
  readonly pageSize = input<number>(10);
  /** Opções de page size do paginador. */
  readonly rowsPerPageOptions = input<number[]>([10, 20, 50, 100]);
  /** Carregamento inicial (mostra skeleton). */
  readonly loading = input<boolean>(false);
  /** Atualização em background (mantém dados na tela + barra sutil). */
  readonly refreshing = input<boolean>(false);
  /** Estado de erro. */
  readonly error = input<boolean>(false);
  /** Ações da coluna "Ações". */
  readonly actions = input<TableAction<T>[]>([]);
  /** Chave única de linha. */
  readonly dataKey = input<string>('id');
  /** Habilita seleção por checkbox. */
  readonly showSelection = input<boolean>(false);
  /** Itens selecionados. */
  readonly selectedItems = input<T[]>([]);
  /** Mensagens dos estados. */
  readonly emptyMessage = input<string>('Nenhum registro encontrado.');
  readonly errorMessage = input<string>('Não foi possível carregar os dados.');
  /** Templates projetados para colunas do tipo 'custom' (chave = templateKey). */
  readonly cellTemplates = input<Record<string, TemplateRef<unknown>>>({});

  /** Emite quando a página/ordenação muda (contrato base 1). */
  readonly lazyLoad = output<TableLazyEvent>();
  /** Emite quando uma ação de linha é acionada. */
  readonly action = output<TableActionEvent<T>>();
  /** Emite ao clicar numa linha. */
  readonly rowClick = output<T>();
  /** Emite ao clicar em "Tentar novamente" no estado de erro. */
  readonly retry = output<void>();
  /** Emite quando a seleção muda. */
  readonly selectionChange = output<T[]>();

  /** Linhas-fantasma para o skeleton do loading inicial. */
  protected readonly skeletonRows = computed(() =>
    Array.from({ length: this.pageSize() }, (_, i) => i),
  );

  /** Converte o evento lazy do PrimeNG (0-based) no contrato do domínio (1-based). */
  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? this.pageSize();
    const first = event.first ?? 0;
    const page = Math.floor(first / rows) + 1;

    let sortField: string | undefined;
    let sortOrder: TableSortDirection = '';
    if (event.sortField) {
      sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
      sortOrder = event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : '';
    }

    this.lazyLoad.emit({ page, pageSize: rows, sortField, sortOrder });
  }

  /** Resolve o valor bruto de uma célula (getter customizado ou row[field]). */
  protected cellValue(col: TableColumn<T>, row: T): unknown {
    return col.value ? col.value(row) : (row as Record<string, unknown>)[col.field];
  }

  protected badgeSeverity(col: TableColumn<T>, row: T): TableBadgeSeverity {
    return col.badgeSeverity ? col.badgeSeverity(row) : 'secondary';
  }

  protected badgeLabel(col: TableColumn<T>, row: T): string {
    return col.badgeLabel ? col.badgeLabel(row) : String(this.cellValue(col, row) ?? '');
  }

  protected asNumber(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  protected linkTarget(col: TableColumn<T>, row: T): string | unknown[] | undefined {
    return col.link ? col.link(row) : undefined;
  }

  protected isRouterLink(target: string | unknown[] | undefined): boolean {
    return Array.isArray(target);
  }

  protected tooltip(col: TableColumn<T>, row: T): string | undefined {
    return col.tooltip ? col.tooltip(row) : undefined;
  }

  protected iconOf(col: TableColumn<T>, row: T): string | undefined {
    return col.icon ? col.icon(row) : undefined;
  }

  protected visibleActions(row: T): TableAction<T>[] {
    return this.actions().filter((a) => (a.visible ? a.visible(row) : true));
  }

  protected isDisabled(actionItem: TableAction<T>, row: T): boolean {
    return actionItem.disabled ? actionItem.disabled(row) : false;
  }

  protected onAction(key: string, row: T, event: Event): void {
    event.stopPropagation();
    this.action.emit({ key, row });
  }

  protected templateFor(col: TableColumn<T>): TemplateRef<unknown> | null {
    if (!col.templateKey) return null;
    // return this.cellTemplates()[col.templateKey] ?? null;
    return null;
  }
}
