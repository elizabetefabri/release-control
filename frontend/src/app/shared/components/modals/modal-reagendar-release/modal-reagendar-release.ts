import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal-reagendar-release',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule],
  templateUrl: './modal-reagendar-release.html',
  styleUrl: './modal-reagendar-release.scss',
})
export class ModalReagendarRelease {
  readonly visible = signal(false);
  readonly title = signal('Reagendar Release');
  readonly message = signal('Confirme o reagendamento da release selecionada.');

  show(title?: string, message?: string): void {
    if (title) this.title.set(title);
    if (message) this.message.set(message);
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }

  onConfirm(): void {
    // TODO: Implementar lógica de reagendar release
    console.log('Reagendar release confirmado');
    this.hide();
  }

  onCancel(): void {
    this.hide();
  }
}
