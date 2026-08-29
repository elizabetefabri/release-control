import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { Icon } from '../../icon/icon';

/**
 * Barra de ações da tabela (apenas apresentação — sem regra de negócio).
 *
 * Pertence à Tabela Inteligente, por isso vive dentro de `smart-table/`.
 * Layout em flex: as três primeiras ações à esquerda; "Limpar seleção" e o
 * botão de filtro alinhados à direita.
 *
 * Comportamento FUTURO (documentado, não implementado nesta etapa):
 *  - Reagendar/Cancelar/Pausar release: agem sobre as linhas selecionadas.
 *  - Limpar seleção: desmarca os checkboxes selecionados na tabela.
 *  - Filtro: abre o sidesheet de filtros.
 */
@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TooltipModule, Icon],
  templateUrl: './table-toolbar.html',
  styleUrl: './table-toolbar.scss',
})
export class TableToolbar {
  /** 1. Reagendar release */
  readonly showReschedule = input<boolean>(true);
  readonly rescheduleLabel = input<string>('Reagendar release');
  readonly rescheduleIcon = input<string>('calendar');
  readonly rescheduleDisabled = input<boolean>(false);

  /** 2. Cancelar release */
  readonly showCancel = input<boolean>(true);
  readonly cancelLabel = input<string>('Cancelar release');
  readonly cancelIcon = input<string>('triangle-alert');
  readonly cancelDisabled = input<boolean>(false);

  /** 3. Pausar release (desabilitado por padrão) */
  readonly showPause = input<boolean>(true);
  readonly pauseLabel = input<string>('Pausar release');
  readonly pauseIcon = input<string>('pause');
  readonly pauseDisabled = input<boolean>(true);

  /** 4. Limpar seleção (alinhado à direita) */
  readonly showClear = input<boolean>(true);
  readonly clearLabel = input<string>('Limpar seleção');
  readonly clearIcon = input<string>('x');
  readonly clearDisabled = input<boolean>(false);

  /** 5. Filtro (somente ícone, no canto direito) */
  readonly showFilter = input<boolean>(true);
  readonly filterIcon = input<string>('sliders-horizontal');
  readonly filterLabel = input<string>('Filtros');

  /** Eventos emitidos pelos botões */
  readonly reschedule = output<void>();
  readonly cancel = output<void>();
  readonly pause = output<void>();
  readonly clear = output<void>();
  readonly filter = output<void>();

  protected onReschedule(): void {
    this.reschedule.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected onPause(): void {
    this.pause.emit();
  }

  protected onClear(): void {
    this.clear.emit();
  }

  protected onFilter(): void {
    this.filter.emit();
  }
}
