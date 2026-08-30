import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal-confirmacao',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule],
  templateUrl: './modal-confirmacao.html',
  styleUrl: './modal-confirmacao.scss',
})
export class ModalConfirmacao {
  readonly visible = signal(false);
  readonly title = signal('Confirmação');
  readonly message = signal('Deseja confirmar esta ação?');
  readonly action = signal<string | null>(null);

  readonly confirm = output<string | null>();

  show(title: string, message: string, action?: string): void {
    this.title.set(title);
    this.message.set(message);
    this.action.set(action ?? null);
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }

  onConfirm(): void {
    this.confirm.emit(this.action());
    this.hide();
  }

  onCancel(): void {
    this.hide();
  }
}
