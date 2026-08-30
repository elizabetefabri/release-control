import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { debounceTime, Subject, takeUntil } from 'rxjs';
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
import { ModalCancelar, ModalReagendarRelease } from '../../shared/components/modals';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { SmartTable } from '../../shared/components/smart-table/smart-table';
import { TableToolbar } from '../../shared/components/smart-table/table-toolbar/table-toolbar';

@Component({
  selector: 'app-release-trains',
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
    PageHeader,
    SmartTable,
    TableToolbar,
    ModalReagendarRelease,
    ModalCancelar,
  ],
  providers: [ApplicationsFacade],
  templateUrl: './release-trains.html',
  styleUrl: './release-trains.scss',
})
export class ReleaseTrains implements OnInit, OnDestroy {
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
    {
      field: 'rollout',
      header: 'Rollout',
      type: 'custom',
      templateKey: 'rollout',
      hideOnMobile: true,
    },
    { field: 'load', header: 'Carga', type: 'custom', templateKey: 'carga', sortable: true },
    { field: 'status', header: 'Estado', type: 'custom', templateKey: 'estado' },
    { field: 'audience', header: 'Público', hideOnMobile: true },
    { field: 'gmud', header: 'GMUD', type: 'code', hideOnMobile: true },
    {
      field: 'updatedAt',
      header: 'Atualizado em',
      type: 'datetime',
      sortable: true,
      hideOnMobile: true,
    },
  ];

  /** Ações isoladas na coluna "Ações". */
  protected readonly actions: TableAction<RepositoryRow>[] = [
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

  /** Estado da seleção da tabela. */
  protected selectedItems = signal<RepositoryRow[]>([]);

  /** Modais. */
  protected readonly modalReagendar = viewChild.required<ModalReagendarRelease>('modalReagendar');
  protected readonly modalCancelar = viewChild.required<ModalCancelar>('modalCancelar');

  protected readonly statusOptions: AudienceOption[] = Object.values(ReleaseStatus).map((s) => ({
    label: s,
    value: s,
  }));

  protected readonly audienceOptions: AudienceOption[] = [
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Ituber', value: 'Ituber' },
  ];

  ngOnInit(): void {
    this.facade.load();
    this.search$
      .pipe(debounceTime(50), takeUntil(this.destroy$))
      .subscribe((term) => this.facade.search(term));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onLazyLoad(event: TableLazyEvent): void {
    this.facade.onLazy(event);
  }

  protected onAction(event: TableActionEvent<RepositoryRow>): void {
    if (event.key === 'view') {
      this.router.navigate(['/applications', event.row.id]);
    }
  }

  protected onRowClick(row: RepositoryRow): void {
    this.router.navigate(['/applications', row.id]);
  }

  protected onSelectionChange(items: RepositoryRow[]): void {
    this.selectedItems.set(items);
  }

  protected onToolbarReschedule(): void {
    if (this.selectedItems().length === 0) return;
    this.modalReagendar().show(
      'Reagendar Release',
      `Você selecionou ${this.selectedItems().length} release(s) para reagendar.`,
    );
  }

  protected onToolbarCancel(): void {
    if (this.selectedItems().length === 0) return;
    this.modalCancelar().show(
      'Cancelar Release',
      `Tem certeza que deseja cancelar ${this.selectedItems().length} release(s)?`,
    );
  }

  protected onToolbarPause(): void {
    // TODO: Implementar lógica de pausar
    console.log('Pausar release - em desenvolvimento');
  }

  protected onToolbarClear(): void {
    this.selectedItems.set([]);
  }

  protected onToolbarFilter(): void {
    this.filtersOpen.set(!this.filtersOpen());
  }
}
