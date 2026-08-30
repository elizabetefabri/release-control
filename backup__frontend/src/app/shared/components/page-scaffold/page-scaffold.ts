import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Bloco de scaffold corporativo reutilizável para páginas ainda não
 * implementadas por completo. Mantém consistência visual enquanto o
 * conteúdo real (ex: SmartTable) é desenvolvido.
 */
@Component({
  selector: 'app-page-scaffold',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="scaffold">
      <div class="scaffold__icon">
        <app-icon [name]="icon()" [size]="28" />
      </div>
      <h1 class="scaffold__title">{{ title() }}</h1>
      <p class="scaffold__note">{{ note() }}</p>
    </section>
  `,
  styles: `
    .scaffold {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      text-align: center;
      min-height: 55vh;
      padding: 2rem;
    }
    .scaffold__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      background: var(--color-card-background);
      border: 1px solid var(--color-card-border);
      color: var(--color-accent-400);
    }
    .scaffold__title {
      margin: 0;
      font-size: 1.375rem;
      color: var(--color-text-title);
    }
    .scaffold__note {
      margin: 0;
      max-width: 32rem;
      color: var(--color-text-secondary);
    }
  `,
})
export class PageScaffold {
  readonly title = input.required<string>();
  readonly icon = input<string>('sparkles');
  readonly note = input<string>(
    'Estrutura pronta — o conteúdo desta tela será conectado à Tabela Inteligente e à camada de dados.',
  );
}
