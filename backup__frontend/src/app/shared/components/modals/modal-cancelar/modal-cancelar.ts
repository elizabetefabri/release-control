import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal-cancelar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule],
  templateUrl: './modal-cancelar.html',
  styleUrl: './modal-cancelar.scss',
})
export class ModalCancelar {
  readonly visible = signal(false);
  readonly title = signal('Cancelar Operação');
  readonly message = signal('Tem certeza que deseja cancelar esta operação?');

  show(title?: string, message?: string): void {
    if (title) this.title.set(title);
    if (message) this.message.set(message);
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }

  onConfirm(): void {
    // TODO: Implementar lógica de cancelar
    console.log('Operação cancelada');
    this.hide();
  }

  onCancel(): void {
    this.hide();
  }
}