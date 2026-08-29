import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { resolveIconName } from '../../icons/icon.registry';

/**
 * Componente único de ícones da aplicação (Lucide).
 *
 * Aceita tanto nomes Lucide ("chart-pie") quanto nomes legados do
 * PrimeIcons (prefixo "pi-"), o que mantém compatível o `iconClass`
 * salvo no banco de dados.
 *
 * Uso:
 *   <app-icon name="plus" />
 *   <app-icon [name]="item.iconClass" size="20" />
 *   <app-icon name="loader-circle" [spin]="true" />
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      lucideIcon
      [lucideIcon]="resolved()"
      [size]="size()"
      [strokeWidth]="strokeWidth()"
      [class.icon--spin]="spin()"
    ></svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
    }

    .icon--spin {
      animation: icon-spin 1s linear infinite;
    }

    @keyframes icon-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
})
export class Icon {
  /** Nome do ícone (lucide ou legado pi-*). */
  readonly name = input.required<string>();
  /** Tamanho em px (largura/altura). */
  readonly size = input<number | string>(18);
  /** Espessura do traço. */
  readonly strokeWidth = input<number | string>(2);
  /** Anima em rotação contínua (substitui pi-spin). */
  readonly spin = input<boolean>(false);

  readonly resolved = computed(() => resolveIconName(this.name()));
}
