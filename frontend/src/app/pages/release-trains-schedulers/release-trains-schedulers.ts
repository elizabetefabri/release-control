import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { Icon } from '../../shared/components/icon/icon';
import { ModalConfirmacao } from '../../shared/components/modals/modal-confirmacao/modal-confirmacao';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { ReleaseTrainCalendar } from './release-train-calendar/release-train-calendar';

interface ToolbarAction {
  key: string;
  label: string;
  icon: string;
  title: string;
  message: string;
}

@Component({
  selector: 'app-release-trains-schedulers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, Icon, ModalConfirmacao, PageHeader, ReleaseTrainCalendar, TabsModule],
  templateUrl: './release-trains-schedulers.html',
  styleUrl: './release-trains-schedulers.scss',
})
export class ReleaseTrainsSchedulers {
  /** Aba ativa. */
  protected readonly activeTab = signal<string | number | undefined>('agendamentos');

  /** Ações da toolbar. */
  protected readonly toolbarActions: ToolbarAction[] = [
    {
      key: 'add-rm',
      label: 'Adicionar RM',
      icon: 'plus',
      title: 'Adicionar RM',
      message: 'Deseja adicionar uma nova RM?',
    },
    {
      key: 'add-bloqueios',
      label: 'Adicionar Bloqueios',
      icon: 'ban',
      title: 'Adicionar Bloqueios',
      message: 'Deseja adicionar um novo bloqueio?',
    },
    {
      key: 'listar-bloqueios',
      label: 'Listar Bloqueios',
      icon: 'list',
      title: 'Listar Bloqueios',
      message: 'Deseja listar os bloqueios?',
    },
    {
      key: 'importar',
      label: 'Importar Informações',
      icon: 'download',
      title: 'Importar Informações',
      message: 'Deseja importar as informações?',
    },
  ];

  /** Referência do modal de confirmação. */
  protected readonly modalConfirmacao = viewChild.required<ModalConfirmacao>('modalConfirmacao');

  /** Abre o modal de confirmação da ação selecionada. */
  protected onToolbarAction(action: ToolbarAction): void {
    this.modalConfirmacao().show(action.title, action.message, action.key);
  }

  /** Trata a confirmação do modal. */
  protected onConfirm(action: string | null): void {
    if (!action) return;
    console.log('Ação confirmada:', action);
  }
}
