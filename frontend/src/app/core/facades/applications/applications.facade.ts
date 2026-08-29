import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { RepositoryRow } from '../../models/application.models';
import { ListQuery, defaultQuery } from '../../types/query.type';
import { TableLazyEvent } from '../../types/table.type';
import { DEFAULT_PAGE_SIZE } from '../../models/pagination.models';
import { ApplicationsService } from '../../services/applications/applications.service';

type LoadMode = 'initial' | 'refresh';

/**
 * Facade da tela Repositórios/Applications.
 *
 * Concentra o estado (dados, total, loading, refreshing, error, query) em
 * signals e orquestra a chamada ao serviço. A página consome apenas os
 * signals expostos e dispara intenções (load, search, refresh, retry),
 * mantendo o componente visual desacoplado da orquestração.
 *
 * Fornecida no nível da página (não em root) para escopar o estado à tela.
 */
@Injectable()
export class ApplicationsFacade {
  private readonly service = inject(ApplicationsService);

  private readonly _rows = signal<RepositoryRow[]>([]);
  private readonly _total = signal(0);
  private readonly _loading = signal(true);
  private readonly _refreshing = signal(false);
  private readonly _error = signal(false);
  private readonly _query = signal<ListQuery>(defaultQuery('applications', DEFAULT_PAGE_SIZE));

  /** Estado exposto (readonly). */
  readonly rows = this._rows.asReadonly();
  readonly total = this._total.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly refreshing = this._refreshing.asReadonly();
  readonly error = this._error.asReadonly();
  readonly query = this._query.asReadonly();
  readonly pageSize = computed(() => this._query().pageSize);

  private sub?: Subscription;

  /** Carrega os dados aplicando um patch na query atual. */
  load(patch?: Partial<ListQuery>, mode: LoadMode = 'initial'): void {
    const query: ListQuery = { ...this._query(), ...patch };
    this._query.set(query);
    this._error.set(false);

    if (mode === 'refresh') this._refreshing.set(true);
    else this._loading.set(true);

    this.sub?.unsubscribe();
    this.sub = this.service.list(query).subscribe({
      next: (res) => {
        this._rows.set(res.items);
        this._total.set(res.pagination.total);
        this._loading.set(false);
        this._refreshing.set(false);
      },
      error: () => {
        this._error.set(true);
        this._loading.set(false);
        this._refreshing.set(false);
      },
    });
  }

  /** Reage à paginação/ordenação server-side vinda da SmartTable. */
  onLazy(event: TableLazyEvent): void {
    this.load({
      page: event.page,
      pageSize: event.pageSize,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    });
  }

  /** Busca textual (volta à primeira página). */
  search(term: string): void {
    this.load({ search: term || undefined, page: 1 });
  }

  /** Aplica filtros combináveis (Estado/Público) e volta à primeira página. */
  applyFilters(filters: ListQuery['filters']): void {
    this.load({ filters, page: 1 });
  }

  /** Atualiza mantendo os dados exibidos (estado de refresh). */
  refresh(): void {
    this.load(undefined, 'refresh');
  }

  /** Tenta novamente após erro. */
  retry(): void {
    this.load();
  }
}
