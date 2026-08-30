import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

import { ApplicationsFacade } from '../../core/facades/applications/applications.facade';
import { RepositoryRow } from '../../core/models/application.models';
import { AudienceOption } from '../../core/models/audience.models';
import { ReleaseStatus } from '../../core/types/enums.type';
import {
  TableAction,
  TableActionEvent,
  TableColumn,
  TableLazyEvent,
} from '../../core/types/table.type';
import { Icon } from '../../shared/components/icon/icon';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { SmartTable } from '../../shared/components/smart-table/smart-table';

/**
 * Página Repositórios (Applications) — "Jornadas ativas".
 * Container inteligente: conhece a facade e configura a SmartTable.
 * Colunas de domínio (Estado, Rollout, Carga) são renderizadas por
 * componentes dedicados (col-*), via templates customizados da tabela-base.
 */
@Component({
  selector: 'app-applications',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    DrawerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    Icon,
    PageHeader,
    SmartTable
  ],
  providers: [ApplicationsFacade],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications implements OnInit, OnDestroy {
  protected readonly facade = inject(ApplicationsFacade);
  private readonly router = inject(Router);
  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  /** Colunas de referência da tabela de rollout. */
  protected readonly columns: TableColumn<RepositoryRow>[] = [
    {
      field: 'repositoryName',
      header: 'Repositório',
      type: 'link',
      sortable: true,
      link: (row) => ['/applications', row.id],
      tooltip: (row) => row.repositoryUrl,
    },
    { field: 'version', header: 'Versão', type: 'code' },
    { field: 'rollout', header: 'Rollout', type: 'custom', templateKey: 'rollout', width: '200px', hideOnMobile: true },
    { field: 'load', header: 'Carga', type: 'custom', templateKey: 'carga', sortable: true },
    { field: 'status', header: 'Estado', type: 'custom', templateKey: 'estado' },
    { field: 'audience', header: 'Público', hideOnMobile: true },
    { field: 'gmud', header: 'GMUD', type: 'code', hideOnMobile: true },
    { field: 'updatedAt', header: 'Atualizado em', type: 'datetime', sortable: true, hideOnMobile: true },
  ];

  /** Ações isoladas na coluna "Ações". */
  protected readonly actions: TableAction<RepositoryRow>[] = [
    { key: 'view', label: 'Ver detalhes', icon: 'eye' },
    { key: 'edit', label: 'Editar', icon: 'square-pen' },
    { key: 'delete', label: 'Excluir', icon: 'trash-2', severity: 'danger' },
  ];

  /** Dados mockados do header — virão do backend futuramente. */
  protected readonly profile = 'Dev';
  protected readonly updatedAt = new Date();

  /** Estado do sidesheet de filtros. */
  protected readonly filtersOpen = signal(false);
  protected selectedStatuses: string[] = [];
  protected selectedAudience: string | null = null;

  protected readonly statusOptions: AudienceOption[] = Object.values(ReleaseStatus).map((s) => ({
    label: s,
    value: s,
  }));
  protected readonly audienceOptions: AudienceOption[] = [
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Ituber', value: 'Ituber' },
  ];

  ngOnInit(): void {
    this.search$
      .pipe(debounceTime(350), takeUntil(this.destroy$))
      .subscribe((term) => this.facade.search(term));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onLazyLoad(event: TableLazyEvent): void {
    this.facade.onLazy(event);
  }

  protected onSearch(value: string): void {
    this.search$.next(value);
  }

  protected get activeFilterCount(): number {
    return this.selectedStatuses.length + (this.selectedAudience ? 1 : 0);
  }

  protected applyFilters(): void {
    this.facade.applyFilters({
      status: this.selectedStatuses.length ? this.selectedStatuses.join(',') : undefined,
      audience: this.selectedAudience ?? undefined,
    });
    this.filtersOpen.set(false);
  }

  protected clearFilters(): void {
    this.selectedStatuses = [];
    this.selectedAudience = null;
    this.facade.applyFilters({});
    this.filtersOpen.set(false);
  }

  protected onAction(event: TableActionEvent<RepositoryRow>): void {
    if (event.key === 'view') {
      this.router.navigate(['/applications', event.row.id]);
    }
  }

  protected onRowClick(row: RepositoryRow): void {
    this.router.navigate(['/applications', row.id]);
  }
}
